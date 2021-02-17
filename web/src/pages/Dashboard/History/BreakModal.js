import React, { useState } from "react";
import Modal from "components/Modal";
import Checkbox from "components/Checkbox";
import numeral from "numeral";
import { breakModal } from "atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { toShortFormat } from "utils/date";
import { handleNaN } from "utils/numbers";
import { openTx, pendingTx } from "atoms";
import usePenaltyAndFee from "hooks/usePenaltyAndFee";
import DECIMALS from "constants/decimals";

function BreakModal(props) {
  const pendingTransactions = useRecoilValue(pendingTx);
  const openTransactions = useRecoilValue(openTx);
  let [penaltyRate, feeRate] = usePenaltyAndFee();
  const [data, setData] = useRecoilState(breakModal);
  const [checked, setChecked] = useState(false);
  let unlockDate, daysLeft;

  if (!data) return null;

  const {
    startedAt,
    unlockedAt,
    symbol,
    exit,
    amount,
    setButtonDisabled,
  } = data;
  unlockDate = new Date(unlockedAt * 1000);
  daysLeft = Math.ceil(
    (unlockDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const MINIMUM = 1 / Math.pow(10, DECIMALS[symbol]);
  if (amount * penaltyRate < MINIMUM) penaltyRate = 0;
  if (amount * feeRate < MINIMUM) feeRate = 0;

  const penalty = amount * penaltyRate;
  const platformFee = amount * feeRate;
  const withdraw = amount * (1 - penaltyRate - feeRate);

  const penaltyFee = handleNaN(
    penalty,
    numeral(penalty).format("0,0.00[0000]")
  );

  const _platformFee = handleNaN(
    platformFee,
    numeral(platformFee).format("0,0.00[0000]")
  );

  const withdrawAmount = handleNaN(
    withdraw,
    numeral(withdraw).format("0,0.00[0000]")
  );

  const withdrawAmountText = handleNaN(
    withdraw,
    numeral(withdraw).format("0,0.00[0000]"),
    true
  );

  const pending =
    openTransactions.some((tx) => tx._id === startedAt) ||
    pendingTransactions.some((tx) => tx._id === startedAt);

  return (
    <Modal
      visible={data}
      className="break-modal"
      onClose={() => {
        setChecked(false);
        setData(null);
      }}
    >
      <h3 className="red">Break & Withdraw</h3>

      <p className="top-20 light-grey">
        Your lock-up period is set to end at{" "}
        <span className="black">{toShortFormat(unlockDate)}</span> and{" "}
        <span className="black">{daysLeft} days</span> left from today. If you
        break your contract and withdraw the fund now, 10% penalty and 3%
        treasury fund will be deducted.
      </p>

      <h6 className="top-60">Transaction details</h6>

      <div className="max-width top-10">
        <div className="row justify-between">
          <p className="light-grey">Lock-up amount</p>
          <div className="font-14">
            {handleNaN(+amount, numeral(amount).format("0,0.00[0000]"))}{" "}
            {symbol}
          </div>
        </div>
        <div className="row justify-between">
          <p className="light-grey">Penalty ({penaltyRate * 100}%)</p>
          <div className="font-14">
            - {penaltyFee} {symbol}
          </div>
        </div>
        <div className="row justify-between">
          <p className="light-grey">Treasury fund ({feeRate * 100}%)</p>
          <div className="font-14">
            - {_platformFee} {symbol}
          </div>
        </div>

        <hr />

        <div className="row justify-between">
          <p className="light-grey">Net amount</p>
          <div className="font-14">
            {withdrawAmount} {symbol}
          </div>
        </div>
      </div>

      <div className="break-amount col centered top-40">
        <p className="light-grey">Amount to withdraw</p>
        <h3>
          {withdrawAmount} {symbol}
        </h3>
      </div>

      <Checkbox
        className="top-45"
        checked={checked}
        onChange={() => setChecked(!checked)}
      >
        I am aware and agree that this transaction is not reversible, and the
        penalty and treasury fund is not refundable.
      </Checkbox>

      <button
        className="warning inverse big top-40 max-width"
        onClick={() => {
          exit(
            startedAt,
            () => {
              setButtonDisabled(true);
              setData(null);
            },
            () => {
              setButtonDisabled(false);
            },
            `Break & withdraw ${withdrawAmountText} ${symbol}`
          );
        }}
        disabled={pending || !checked}
      >
        Break and withdraw the asset
      </button>
    </Modal>
  );
}

export default BreakModal;
