import { useState, useEffect } from "react";
import { useERC20Token } from "hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import { TX_TYPE_UNISWAP_SWAP, TX_TYPE_UNISWAP_WRAP } from "constants/index";
import BigNumber from "bignumber.js";

function useBalanceOf(symbol) {
  const { account, chainId } = useWeb3React();
  const [balanceOf, setBalanceOf] = useState(0);
  const token = useERC20Token(symbol);
  const { timestamp, type } = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    (async () => {
      const nonNullCondition =
        token && symbol && chainId & allowedChainId(chainId);
      if (
        nonNullCondition ||
        (nonNullCondition &&
          (type === TX_TYPE_UNISWAP_SWAP || type === TX_TYPE_UNISWAP_WRAP))
      ) {
        setBalanceOf(null);
        const bn = await token.balanceOf(account);
        const decimals = await token.decimals();
        setBalanceOf(
          new BigNumber(bn.toString())
            .dividedBy(Math.pow(10, decimals))
            .toString()
        );
      }
    })();
  }, [token, symbol, account, chainId, timestamp, type]); //eslint-disable-line

  return balanceOf;
}

export default useBalanceOf;
