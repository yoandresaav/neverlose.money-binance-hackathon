import React, { useState } from "react";
import numeral from "numeral";
import { breakModal, unlockModal, hodlModal } from "atoms";
import { useRecoilState } from "recoil";
import { toShortFormat } from "utils/date";
import { handleNaN } from "utils/numbers";
import usePenaltyAndFee from "hooks/usePenaltyAndFee";
import Countdown from "components/Countdown";
import caretDown from "assets/images/caret-down.svg";
import DECIMALS from "constants/decimals";

function HistoryTableRow(props) {
  const prices = global.tokenPrices;
  let [penaltyRate, platformFeeRate] = usePenaltyAndFee();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [, setBreakModalData] = useRecoilState(breakModal);
  const [, setUnlockModalData] = useRecoilState(unlockModal);
  const [, setHodlModalData] = useRecoilState(hodlModal);
  const {
    startedAt,
    durationInMonths,
    startPrice,
    exitedAt,
    unlockedAt,
    symbol,
    amount,
  } = props;

  const isBroken = +exitedAt > 0;
  const isUnlocked = +exitedAt > +unlockedAt;
  const unlockable = unlockedAt * 1000 < new Date().getTime();
  const currentPrice = prices?.[symbol];
  const diff = ((currentPrice - startPrice) / startPrice) * 100;

  const MINIMUM = 1 / Math.pow(10, DECIMALS[symbol]);
  if (amount * penaltyRate < MINIMUM) penaltyRate = 0;
  if (amount * platformFeeRate < MINIMUM) platformFeeRate = 0;

  const _penalty = handleNaN(
    amount * penaltyRate,
    numeral(amount * penaltyRate).format("0,0.00[0000]")
  );
  const _platformFee = handleNaN(
    amount * platformFeeRate,
    numeral(amount * platformFeeRate).format("0,0.00[0000]")
  );
  const withdrawAmount = handleNaN(
    amount * (1 - penaltyRate - platformFeeRate),
    numeral(amount * (1 - penaltyRate - platformFeeRate)).format("0,0.00[0000]")
  );

  const _amount = handleNaN(amount, numeral(amount).format("0,0.00[0000]"));

  return (
    <>
      <tr
        className={`grey mobile-visible ${isUnlocked &&
          "unlocked"} ${!isUnlocked && isBroken && "broken"}`}
      >
        <td>
          <div className="row align-center top-10">
            <h6 className="right-5">
              Date: {toShortFormat(startedAt)} / {durationInMonths} months
            </h6>
            <div className="multiplier centered">
              x{Math.floor(durationInMonths / 3)}
            </div>
          </div>
          {!unlockable && !isBroken && (
            <h6 className="font-12 lighter-grey">
              <Countdown timestamp={unlockedAt} /> left
            </h6>
          )}
          <h6
            className="top-10 link"
            onClick={() =>
              !isBroken &&
              !isUnlocked &&
              setHodlModalData({ ...props, currentPrice, mine: true })
            }
          >
            Quantity: {_amount} {symbol} abcd
          </h6>
          <h6 className="top-10">
            Initial price:{" "}
            <span>
              {startPrice
                ? numeral(startPrice).format(
                    startPrice > 1 ? "$0,0.00" : "$0,0.00[00]"
                  )
                : "-"}{" "}
              {prices && (
                <span
                  className={
                    diff > 0 ? "green" : startPrice && diff < 0 ? "red" : "grey"
                  }
                >
                  {" "}
                  ({startPrice && diff > 0 && "+"}
                  {startPrice ? diff.toFixed(2) : "-"}%)
                </span>
              )}
            </span>
          </h6>

          <div className="top-20">
            {isUnlocked ? (
              <div className="row align-center">
                <h6 className="grey">
                  Unlocked at {toShortFormat(new Date(exitedAt * 1000))}
                </h6>
              </div>
            ) : isBroken ? (
              <div className="row align-center">
                <h6 className="grey">
                  Broken at {toShortFormat(new Date(exitedAt * 1000))}
                </h6>
                <img
                  className="left-10 link"
                  src={caretDown}
                  alt=""
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    transition: "all 150ms ease-in-out",
                    transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
                  }}
                />
              </div>
            ) : unlockable ? (
              <button
                disabled={buttonDisabled}
                className="success"
                onClick={() => {
                  setUnlockModalData({ ...props, symbol, setButtonDisabled });
                }}
              >
                Withdraw
              </button>
            ) : (
              <button
                disabled={buttonDisabled}
                className="warning"
                onClick={() => {
                  setBreakModalData({ ...props, symbol, setButtonDisabled });
                }}
              >
                Break & Withdraw
              </button>
            )}
          </div>
        </td>
      </tr>

      {!isUnlocked && isBroken && !collapsed && (
        <tr className="broken mobile-visible">
          <td className="broken-td">
            <h6 className="grey">
              - Penalty ({penaltyRate * 100}%): {_penalty} {symbol}
              <br />- Treasury fund ({platformFeeRate * 100}%): {_platformFee}{" "}
              {symbol}
              <br />={" "}
              <span className="primary">
                {withdrawAmount} {symbol}
              </span>{" "}
              withdrawn
            </h6>
          </td>
          <td />
        </tr>
      )}

      <tr
        className={`grey mobile-hidden ${isUnlocked &&
          "unlocked"} ${!isUnlocked && isBroken && "broken"}`}
      >
        <td>
          <div className="row align-center">
            <p className="right-5">
              {toShortFormat(startedAt)} / {durationInMonths} months
            </p>
            <div className="multiplier centered">
              x{Math.floor(durationInMonths / 3)}
            </div>
          </div>
          {!unlockable && !isBroken && (
            <p className="font-12 lighter-grey">
              <Countdown timestamp={unlockedAt} /> left
            </p>
          )}
        </td>
        <td
          className={`primary ${!isBroken && !isUnlocked && "link"}`}
          onClick={() =>
            !isBroken &&
            !isUnlocked &&
            setHodlModalData({ ...props, currentPrice, mine: true })
          }
        >
          {_amount} {symbol}
        </td>
        <td>
          <span>
            {startPrice
              ? numeral(startPrice).format(
                  startPrice > 1 ? "$0,0.00" : "$0,0.00[00]"
                )
              : "-"}
            {prices && (
              <span
                className={
                  diff > 0 ? "green" : startPrice && diff < 0 ? "red" : "grey"
                }
              >
                {" "}
                ({startPrice && diff > 0 && "+"}
                {startPrice ? diff.toFixed(2) : "-"}%)
              </span>
            )}
          </span>
        </td>
        <td>
          {isUnlocked ? (
            <div className="row align-center">
              <p className="grey">
                Unlocked at {toShortFormat(new Date(exitedAt * 1000))}
              </p>
            </div>
          ) : isBroken ? (
            <div className="row align-center">
              <p className="grey">
                Broken at {toShortFormat(new Date(exitedAt * 1000))}
              </p>
              <img
                className="left-10 link"
                src={caretDown}
                alt=""
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  transition: "all 150ms ease-in-out",
                  transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
                }}
              />
            </div>
          ) : unlockable ? (
            <button
              disabled={buttonDisabled}
              className="success"
              onClick={() => {
                setUnlockModalData({ ...props, symbol, setButtonDisabled });
              }}
            >
              Withdraw
            </button>
          ) : (
            <button
              disabled={buttonDisabled}
              className="warning"
              onClick={() => {
                setBreakModalData({ ...props, symbol, setButtonDisabled });
              }}
            >
              Break & Withdraw
            </button>
          )}
        </td>
      </tr>
      {!isUnlocked && isBroken && !collapsed && (
        <tr className="broken mobile-hidden">
          <td />
          <td className="broken-td" colSpan={2}>
            <div className="grey">
              - Penalty ({penaltyRate * 100}%): {_penalty} {symbol}
              <br />- Treasury fund ({platformFeeRate * 100}%): {_platformFee}{" "}
              {symbol}
              <br />={" "}
              <span className="primary">
                {withdrawAmount} {symbol}
              </span>{" "}
              withdrawn
            </div>
          </td>
          <td />
        </tr>
      )}
    </>
  );
}

export default HistoryTableRow;
