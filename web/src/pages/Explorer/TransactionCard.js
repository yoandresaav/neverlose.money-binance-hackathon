import React, { useRef, useMemo } from "react";
import ethBlue from "assets/images/eth-blue.svg";
import wbtcBlue from "assets/images/wbtc-blue.svg";
import bnbLogo from "assets/images/bnb-logo.svg";
import wrnBlue from "assets/images/warren-blue-black.svg";
import BigNumber from "bignumber.js";
import DECIMALS from "constants/decimals";
import numeral from "numeral";
import { handleNaN } from "utils/numbers";
import { fromNow } from "utils/date";
import { CSSTransition } from "react-transition-group";
import { getSymbol } from "utils/Contract";
import { allowedChainId } from "utils/chainId";
import { hodlModal } from "atoms";
import { useRecoilState } from "recoil";
import ETHERSCAN from "constants/etherscan";
import DollarValue from "components/DollarValue";

//address indexed token, address indexed account, uint256 amount, uint256 refundAmount, uint256 penalty, uint256 fee, uint256 remainingTotal

/*
4 types
- LockedUp
- Exited
- BonusClaimed
- WRNClaimed
*/

function TransactionCard(props) {
  const node = useRef(null);
  const [, setHodlModalData] = useRecoilState(hodlModal);
  const {
    animationIndex,
    event,
    returnValues,
    transactionHash,
    chainId = 97,
  } = props;

  const memoized = useMemo(() => {
    if (!allowedChainId(chainId)) return null;
    const index = animationIndex ? animationIndex.split("-")?.[1] : 1;

    const fabricatedData = { imgSrc: ethBlue };
    let symbol;

    Object.keys(returnValues).forEach((key) => {
      const val = returnValues[key];
      if (!val instanceof BigNumber && val.startsWith("0x")) {
        fabricatedData[key] = val;
      } else {
        symbol = getSymbol(
          chainId,
          returnValues.token || returnValues.tokenAddress
        );
        fabricatedData.symbol = symbol;
        if (symbol === "WBTC") fabricatedData.imgSrc = wbtcBlue;
        else if (symbol === "HUNT") fabricatedData.imgSrc = bnbLogo;

        fabricatedData[key] = new BigNumber(val)
          .dividedBy(
            event === "WRNClaimed"
              ? Math.pow(10, DECIMALS["WRN"])
              : Math.pow(10, DECIMALS[symbol])
          )
          .toString();
      }
    });

    let isBroken = false;
    let isUnlocked = false;

    let months =
      returnValues.durationInMonths &&
      `${returnValues.durationInMonths} months`;

    if (event === "WRNClaimed") {
      symbol = "WRN";
      fabricatedData.imgSrc = wrnBlue;
      fabricatedData.event = "WRN Claimed";
    } else if (event === "LockedUp") {
      fabricatedData.event = `Locked / ${months}`;
    } else if (event === "BonusClaimed") {
      fabricatedData.event = "Bonus claimed";
    } else if (event === "Exited") {
      if (+fabricatedData.penalty === 0) {
        isUnlocked = true;
        fabricatedData.event = "Unlocked";
      } else {
        isBroken = true;
        fabricatedData.event = `Broken / ${months}`;
      }
    }

    return (
      <CSSTransition
        in
        timeout={index * 50}
        classNames="card"
        nodeRef={node}
        className={`transaction-card link top-20 ${isBroken && "broken"}
    ${(isUnlocked || event === "BonusClaimed" || event === "WRNClaimed") &&
      "claimed"} `}
        onClick={() => {
          const txLink = `${ETHERSCAN[1]}/tx/${transactionHash}`;

          if (event !== "LockedUp") {
            window.open(txLink, "_blank");
            return;
          }
          const { amount, symbol } = fabricatedData;
          const { durationInMonths, timestamp } = returnValues;
          const startedAt = new Date(+timestamp * 1000);
          const unlockedAt = +timestamp + +durationInMonths * 30 * 86400;
          setHodlModalData({
            amount,
            durationInMonths,
            symbol,
            unlockedAt,
            startedAt,
            txLink,
          });
        }}
      >
        <div ref={node}>
          <img className="token-icon" src={fabricatedData.imgSrc} alt="" />
          <div className="black overflow-ellipsis font-22">
            <DollarValue
              animated={false}
              value={fabricatedData.amount}
              symbol={symbol}
              suffix={<span style={{ fontSize: 12 }}> {symbol}</span>}
            />
          </div>
          <p className="grey">{fabricatedData.event}</p>
          <p className="grey">
            {fromNow(new Date(returnValues.timestamp * 1000))}{" "}
          </p>
          {isBroken && (
            <div className="broken-banner max-width white">
              <div className="font-14">
                {handleNaN(
                  fabricatedData.penalty,
                  numeral(fabricatedData.penalty).format("0,0.00[0000]")
                )}{" "}
                {symbol}
              </div>
              <p>Bonus generated</p>
            </div>
          )}
        </div>
      </CSSTransition>
    );
  }, [returnValues, chainId]); //eslint-disable-line

  return memoized;
}

export default TransactionCard;
