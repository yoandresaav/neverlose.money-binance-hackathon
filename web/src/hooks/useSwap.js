import { useState, useEffect, useMemo } from "react";
import ADDRESSES from "constants/addresses";
import DECIMALS from "constants/decimals";
import {
  Token,
  Percent,
  JSBI,
  WETH,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
} from "@uniswap/sdk";
import { useWeb3React } from "@web3-react/core";
import { useRouterContract, useERC20Token, useWETH } from "hooks/useContract";
import isZero from "utils/isZero";
import { calculateGasMargin } from "utils/Contract";
import { handleErrorMessage } from "utils/errors";
import { debounce } from "lodash";
import { useRecoilState } from "recoil";
import { pendingTx, txTimestampAtom } from "atoms";
import BigNumber from "bignumber.js";
import {
  TX_TYPE_UNISWAP_APPROVE,
  TX_TYPE_UNISWAP_WRAP,
  TX_TYPE_UNISWAP_SWAP,
} from "constants/index";
import numeral from "numeral";
import { toast } from "react-toastify";
import Web3WsProvider from "web3-providers-ws";
import { ALCHEMY_API_KEY } from "web3/connectors";
import ethers from "ethers";

function toHex(currencyAmount) {
  return `0x${currencyAmount.raw.toString(16)}`;
}

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50; //0.5%
export const BIPS_BASE = JSBI.BigInt(10000);

// ETH -> WBTC 같은 경우에는 최종적으로 swapExactETHForTokens 펑션이 콜되고
// ETH -> WETH 같은 경우는 그냥 WETH 에 deposit 콜

function useSwap(symbol, amount, inverse = false) {
  const [allowance, setAllowance] = useState(null);
  const [, setPendingTx] = useRecoilState(pendingTx);
  const [lastTx, setTxTimestamp] = useRecoilState(txTimestampAtom);
  const [outputAmount, setOutputAmount] = useState({
    WETH: null,
    WBTC: null,
    HUNT: null,
  });
  const [swap, setSwap] = useState({
    WETH: null,
    WBTC: null,
    HUNT: null,
  });
  const { chainId, library, account } = useWeb3React();

  //used for calculating deadline, which is used to calculate swap/wrap details

  //used for executing contract such as estimateGas and actual swap methods
  const router = useRouterContract(chainId);

  const tokenContract = useERC20Token(symbol);
  const wethContract = useWETH(WETH[chainId]?.address);

  useEffect(() => {
    (async () => {
      if (
        (wethContract && tokenContract && router && account) ||
        lastTx.type === TX_TYPE_UNISWAP_APPROVE
      ) {
        let allowance;
        if (inverse) {
          allowance = await tokenContract.allowance(account, router.address);
        } else {
          allowance = await wethContract.allowance(account, router.address);
        }

        setAllowance(allowance?.toString());
      }
    })();
  }, [wethContract, tokenContract, router, account, lastTx, inverse, chainId]);

  useEffect(() => {
    if (chainId && library && symbol && router && tokenContract && account) {
      setOutputAmount({ ...outputAmount, [symbol]: null });
      setSwap({ ...swap, [symbol]: null });
      if (!amount) {
        setOutputAmount({ ...outputAmount, [symbol]: 0 });
      } else if (amount > 0) {
        debouncedCalculate(symbol, amount);
      }
    }
    //eslint-disable-next-line
  }, [
    amount,
    chainId,
    library,
    symbol,
    router,
    tokenContract,
    wethContract,
    account,
    inverse,
  ]);

  //TODO: add to pending transactions
  const approve = async (onSuccess, onError) => {
    const actionTimestamp = new Date().getTime();
    try {
      let tx, action;
      if (inverse) {
        tx = await tokenContract.approve(
          router.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
        action = `${symbol} approval`;
      } else {
        tx = await wethContract.approve(
          router.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
        action = "WETH approval";
      }
      setPendingTx((txArr) =>
        txArr.concat({
          action,
          timestamp: actionTimestamp,
          type: TX_TYPE_UNISWAP_APPROVE,
          symbol,
          tx,
        })
      );
      await tx.wait();
      setTxTimestamp({
        type: TX_TYPE_UNISWAP_APPROVE,
        timestamp: new Date().getTime(),
      });
      onSuccess(TX_TYPE_UNISWAP_APPROVE);
      if (inverse) {
        toast.success(`Successfully approved ${symbol}! 🎉`);
      } else {
        toast.success(`Successfully approved WETH! 🎉`);
      }
    } catch (e) {
      handleErrorMessage(e);
      onError(TX_TYPE_UNISWAP_APPROVE);
    } finally {
      setPendingTx((txArr) =>
        txArr.filter((item) => item.timestamp !== actionTimestamp)
      );
    }
  };

  const wrap = async (ethAmount, onSuccess, onError) => {
    if (!account) return;

    const value = new BigNumber(ethAmount).times(Math.pow(10, 18)).toString(10);
    const actionTimestamp = new Date().getTime();
    try {
      let tx;

      if (inverse) {
        tx = await wethContract.withdraw(value);
      } else {
        tx = await wethContract.deposit({
          value,
        });
      }

      let action = `Wrapping ${numeral(ethAmount).format(
        "0,0.00[0000]"
      )} ETH to WETH`;

      if (inverse) {
        action = `Unwrapping ${numeral(ethAmount).format(
          "0,0.00[0000]"
        )} WETH to ETH`;
      }

      setPendingTx((txArr) =>
        txArr.concat({
          action,
          timestamp: actionTimestamp,
          type: TX_TYPE_UNISWAP_WRAP,
          symbol,
          tx,
        })
      );
      await tx.wait();
      setTxTimestamp({
        type: TX_TYPE_UNISWAP_WRAP,
        timestamp: new Date().getTime(),
      });
      onSuccess(TX_TYPE_UNISWAP_WRAP);
      if (inverse) {
        toast.success(
          `Successfully unwrapped ${numeral(ethAmount).format(
            "0,0.00[0000]"
          )} WETH to ETH! 🎉`
        );
      } else {
        toast.success(
          `Successfully wrapped ${numeral(ethAmount).format(
            "0,0.00[0000]"
          )} ETH to WETH! 🎉`
        );
      }
    } catch (e) {
      handleErrorMessage(e);
      onError(TX_TYPE_UNISWAP_WRAP);
    } finally {
      setPendingTx((txArr) =>
        txArr.filter((item) => item.timestamp !== actionTimestamp)
      );
    }
  };

  const calculate = async (symbol, amount) => {
    if (!account) return;

    if (symbol === "WETH") {
      setOutputAmount({ ...outputAmount, [symbol]: amount });
      const _swap = async (onSuccess, onError) =>
        wrap(amount, onSuccess, onError);
      setSwap({ ...swap, [symbol]: _swap });
      return;
    }

    try {
      let inputToken,
        outputToken,
        inputAddress,
        outputAddress,
        method,
        inputSymbol,
        outputSymbol;

      const token = new Token(
        chainId,
        ADDRESSES[chainId]?.[symbol],
        DECIMALS[symbol],
        symbol
      );

      const ws = new Web3WsProvider(
        `wss://eth-mainnet.ws.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
      );

      inputSymbol = "ETH";
      inputAddress = WETH[chainId].address;
      inputToken = WETH[token.chainId];

      outputSymbol = token.symbol;
      outputAddress = ADDRESSES[chainId]?.[symbol];
      outputToken = token;

      method = "swapExactETHForTokens";

      if (inverse) {
        inputSymbol = token.symbol;
        inputAddress = ADDRESSES[chainId]?.[symbol];
        inputToken = token;

        outputSymbol = "ETH";
        outputAddress = WETH[chainId].address;
        outputToken = WETH[token.chainId];
        method = "swapExactTokensForETH";
      }

      const pair = await Fetcher.fetchPairData(
        outputToken,
        inputToken,
        new ethers.providers.Web3Provider(ws)
      );
      const route = new Route([pair], inputToken);

      const amountIn = new BigNumber(amount)
        .times(Math.pow(10, inverse ? DECIMALS[symbol] : 18))
        .toString(10);

      const trade = new Trade(
        route,
        new TokenAmount(inputToken, amountIn),
        TradeType.EXACT_INPUT
      );

      //20 minute deadline, and 1% slippage
      const allowedSlippage = new Percent(
        JSBI.BigInt(INITIAL_ALLOWED_SLIPPAGE),
        BIPS_BASE
      );

      const amountOutMin = toHex(trade.minimumAmountOut(allowedSlippage));
      const path = [inputAddress, outputAddress];
      const to = account;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
      let args = [amountOutMin, path, to, deadline];
      let value = toHex(trade.inputAmount);

      if (inverse) {
        const amountInput = toHex(trade.maximumAmountIn(allowedSlippage));
        args = [amountInput, amountOutMin, path, to, deadline];
        value = "0x0";
      }

      const options = !value || isZero(value) ? {} : { value };

      // function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
      const _swap = async (onSuccess, onError) => {
        const actionTimestamp = new Date().getTime();
        try {
          const gasEstimate = await router.estimateGas[method](
            ...args,
            options
          );

          const tx = await router[method](...args, {
            gasLimit: calculateGasMargin(gasEstimate),
            ...(value && !isZero(value)
              ? { value, from: account }
              : { from: account }),
          });
          setPendingTx((txArr) =>
            txArr.concat({
              action: `Swapping ${numeral(amount).format(
                "0,0.00[0000]"
              )} ${inputSymbol} to ${outputSymbol}`,
              timestamp: actionTimestamp,
              type: TX_TYPE_UNISWAP_SWAP,
              symbol,
              tx,
            })
          );
          await tx.wait();
          setTxTimestamp({
            type: TX_TYPE_UNISWAP_SWAP,
            timestamp: new Date().getTime(),
          });
          onSuccess(TX_TYPE_UNISWAP_SWAP);
          toast.success(
            `Successfully swapped ${numeral(amount).format(
              "0,0.00[0000] 🎉"
            )} ${inputSymbol} to ${outputSymbol}`
          );
        } catch (e) {
          console.error(e);
          handleErrorMessage(e);
          onError(TX_TYPE_UNISWAP_SWAP);
        } finally {
          setPendingTx((txArr) =>
            txArr.filter((item) => item.timestamp !== actionTimestamp)
          );
        }
      };

      setSwap({ ...swap, [symbol]: _swap });
      setOutputAmount({
        ...outputAmount,
        [symbol]: new BigNumber(
          parseInt(
            trade
              .minimumAmountOut(new Percent(JSBI.BigInt(0), BIPS_BASE))
              .raw.toString(10)
          )
        )
          //if inverse, output is always 18 decimal points
          .dividedBy(Math.pow(10, inverse ? 18 : DECIMALS[symbol]))
          .toNumber(),
      });
    } catch (e) {
      handleErrorMessage(e);
    }
  };

  //eslint-disable-next-line
  const debouncedCalculate = useMemo(() => debounce(calculate, 500), [
    chainId,
    library,
    symbol,
    router,
    tokenContract,
    wethContract,
    inverse,
  ]);

  return { allowance, approve, wrap, swap, calculate, outputAmount };
}

export default useSwap;
