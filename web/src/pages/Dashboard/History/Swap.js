import React, { useState, useEffect } from "react";
import rightArrowPrimary from "assets/images/right-arrow-primary.svg";
import swapHide from "assets/images/swap-hide.svg";
import useSwap from "hooks/useSwap";
import useETHBalance from "hooks/useETHBalance";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import ClipLoader from "react-spinners/ClipLoader";
import { handleNaN } from "utils/numbers";
import { useRecoilState, useRecoilValue } from "recoil";
import useBalanceOf from "hooks/useBalanceOf";
import questionGrey from "assets/images/question-grey.svg";
import ADDRESSES from "constants/addresses";
import { openTx, pendingTx } from "atoms";
import {
  TX_TYPE_UNISWAP_APPROVE,
  TX_TYPE_UNISWAP_WRAP,
  TX_TYPE_UNISWAP_SWAP,
} from "constants/index";
import { useWeb3React } from "@web3-react/core";
import { handleErrorMessage } from "utils/errors";

function Swap({ symbol = "HUNT" }) {
  const { chainId } = useWeb3React();
  const [inverse, setInverse] = useState({
    ETH: false,
    BTCB: false,
    WBNB: false,
  });
  const [inputBalance, setInputBalance] = useState(null);
  const [collapsed, setCollapsed] = useState(
    window.localStorage.getItem(`${symbol}-collapsed`) === "true"
  );

  const ethBalance = useETHBalance();
  const tokenBalance = useBalanceOf(symbol);

  useEffect(() => {
    if (inverse[symbol] === true) {
      setInputBalance(tokenBalance);
      setAmount(Math.min(1, +tokenBalance));
    } else {
      setInputBalance(ethBalance);
      setAmount(Math.min(1, +ethBalance));
    }
  }, [ethBalance, tokenBalance, inverse, symbol]);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(`${symbol}-collapsed`) === "true");
  }, [symbol]);

  const [amount, setAmount] = useState(1);
  const pendingTransactions = useRecoilValue(pendingTx);
  const [openTransactions, setOpenTx] = useRecoilState(openTx);

  const { title, collapsedTitle, description, link, buttonText } = TEXT_MAP[
    symbol
  ];

  const { allowance, approve, swap, outputAmount } = useSwap(
    symbol,
    numeral(amount).value(),
    inverse[symbol]
  );

  const buttonLoading =
    !allowance ||
    openTransactions.some(
      (tx) => tx.type === TX_TYPE_UNISWAP_APPROVE && tx.symbol === symbol
    ) ||
    openTransactions.some(
      (tx) =>
        (tx.type === TX_TYPE_UNISWAP_WRAP ||
          tx.type === TX_TYPE_UNISWAP_SWAP) &&
        tx.symbol === symbol
    ) ||
    pendingTransactions.some(
      (tx) => tx.type === TX_TYPE_UNISWAP_APPROVE && tx.symbol === symbol
    ) ||
    pendingTransactions.some(
      (tx) =>
        (tx.type === TX_TYPE_UNISWAP_WRAP ||
          tx.type === TX_TYPE_UNISWAP_SWAP) &&
        tx.symbol === symbol
    );

  const buttonDisabled =
    allowance !== "0" &&
    (!swap[symbol] ||
      !outputAmount[symbol] ||
      !amount ||
      amount < 0 ||
      +amount > +inputBalance);

  return (
    <div
      className="swap-interface row wrap max-width top-40"
      style={{ padding: collapsed ? "0.9375rem 2.5rem" : "2.5rem" }}
    >
      <div className="swap-hide link">
        <img
          src={swapHide}
          alt=""
          onClick={() =>
            setCollapsed((prev) => {
              window.localStorage.setItem(`${symbol}-collapsed`, !prev);
              return !prev;
            })
          }
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {collapsed ?   (
        <h6 className="white collapsed-title">{collapsedTitle}</h6>
      ) : (
        <>
          <div className="grow description-box relative">
            <h6 className="white">{title}</h6>
            <h6 className="top-15 light-grey max-width">
              {description}{" "}
              <a href={link} target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            </h6>
          </div>

          <div className="col text-right top-40 cap-max-width">
            <div className="swap-widget row align-center justify-between left-20 relative">
              {allowance && allowance === "0" && (
                <div className="approve-overlay col justify-center align-start">
                  <p className="approve-text white">
                    You need to approve the contract first
                    <br />
                    before using this swap interface
                  </p>
                </div>
              )}

              <div className="input-container">
                <div className="input-box row align-center">
                  <input
                    className="number-input"
                    value={Number.isNaN(amount) ? 0 : amount}
                    min={0}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={(e) =>
                      setAmount(
                        numeral(e.target.value).format(
                          "0,0.[000000000000000000]"
                        )
                      )
                    }
                  />
                  <p className="light-grey">
                    {inverse[symbol] ? symbol : "BNB"}
                  </p>
                </div>
                <div className="font-10 top-5 row">
                  <span className="light-grey">Balance: </span>
                  &nbsp;
                  <span
                    className="white link underline"
                    onClick={() => {
                      setAmount(+inputBalance);
                    }}
                  >
                    {handleNaN(
                      +inputBalance,
                      numeral(inputBalance).format("0,0.[000000]")
                    )}
                  </span>
                </div>
              </div>

              <img
                className="right-arrow link"
                src={rightArrowPrimary}
                alt=""
                onClick={() =>
                  setInverse((prev) => {
                    return { ...prev, [symbol]: !prev[symbol] };
                  })
                }
              />

              <div className="input-container">
                <div className="input-box row align-center">
                  <div
                    className="number-input grow white overflow-ellipsis text-left"
                    data-tip
                    data-for={symbol}
                  >
                    {outputAmount[symbol] !== null ? (
                      <>
                        {numeral(outputAmount[symbol]).format(
                          "0,0.[000000000000000000]"
                        )}
                        <ReactTooltip id={symbol} type="dark" effect="float">
                          {numeral(outputAmount[symbol]).format(
                            "0,0.[000000000000000000]"
                          )}
                        </ReactTooltip>
                      </>
                    ) : (
                      <ClipLoader size={14} color="#fff" />
                    )}
                  </div>
                  <p className="light-grey">
                    {inverse[symbol] ? "ETH" : symbol}
                  </p>
                </div>
                <div
                  className="font-10 top-5 light-grey row"
                  data-tip
                  data-for="estimated-tooltip"
                >
                  <span>{symbol === "WETH" ? "Guaranteed" : "Estimated"}</span>
                  <img src={questionGrey} className="question-grey left-5" alt="" />
                  <ReactTooltip
                    id="estimated-tooltip"
                    type="dark"
                    effect="float"
                  >
                    {symbol === "WETH"
                      ? "1 ETH has an equivalent value to 1 WETH"
                      : "Your transaction will revert if the price changes unfavorably by more than 0.5%."}
                  </ReactTooltip>
                </div>
              </div>

              <button
                disabled={buttonDisabled || buttonLoading}
                onClick={() => {
                  const actionTimestamp = new Date().getTime();
                  let type = "";

                  const onError = () => {
                    setOpenTx((txArr) =>
                      txArr.filter((item) => item.timestamp !== actionTimestamp)
                    );
                  };

                  const onSuccess = onError;

                  try {
                    if (allowance === "0") {
                      approve(onSuccess, onError);
                      type = TX_TYPE_UNISWAP_APPROVE;
                    } else if (symbol === "WETH") {
                      swap[symbol](onSuccess, onError);
                      type = TX_TYPE_UNISWAP_WRAP;
                    } else {
                      swap[symbol](onSuccess, onError);
                      type = TX_TYPE_UNISWAP_SWAP;
                    }
                  } catch (e) {
                    handleErrorMessage(e);
                  }

                  setOpenTx((txArr) =>
                    txArr.concat({
                      timestamp: actionTimestamp,
                      type,
                      symbol,
                    })
                  );
                }}
              >
                {buttonLoading ? (
                  <ClipLoader size={14} color="#fff" />
                ) : allowance === "0" ? (
                  "Approve"
                ) : symbol === "WETH" && inverse[symbol] ? (
                  "Unwrap"
                ) : (
                  buttonText
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const TEXT_MAP = {
  ETH: {
    title: "Wrap your Ether first!",
    collapsedTitle: "Wrap your Ether first!",
    description:
      "Wrapped ETH (WETH) is a token that represents Ether 1:1 and conforms to the ERC20 token standard. Ether is not an ERC20 token, this is why we need to wrap it first.",
    link: "https://academy.binance.com/en/glossary/wrapped-ether",
    buttonText: "Wrap",
  },
  BTCB: {
    title: "Get WBTC to make Bitcoin usable in Ethereum",
    collapsedTitle: "Wrap your Bitcoin first!",
    description:
      "Wrapped Bitcoin (WBTC) is an ERC-20 token backed 1:1 by Bitcoin, bringing the liquidity of Bitcoin to the Ethereum ecosystem.",
    link: "https://wbtc.network/",
    buttonText: "Swap",
  },
  WBNB: {
    title: "Earn x2 WRN tokens via WBNB lock-ups",
    collapsedTitle: "Swap your BNB to WBNB first!",
    description:
      "The generated WRN tokens are allocated in the following way: 50% to WBNB, 25% to BTCB, and 25% to ETH asset pool.",
    link: "https://token.hunt.town",
    buttonText: "Swap",
  },
};

export default Swap;
