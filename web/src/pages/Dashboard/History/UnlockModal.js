import React from "react";
import Modal from "components/Modal";
import numeral from "numeral";
import unlock from "assets/images/unlock.svg";
import { unlockModal } from "atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { toShortFormat } from "utils/date";
import { handleNaN } from "utils/numbers";
import { openTx, pendingTx } from "atoms";

function UnlockModal() {
  const pendingTransactions = useRecoilValue(pendingTx);
  const openTransactions = useRecoilValue(openTx);
  const [data, setData] = useRecoilState(unlockModal);
  const prices = global.tokenPrices;

  if (!data) return null;

  const {
    startedAt,
    startPrice,
    durationInMonths,
    amount,
    exit,
    symbol,
    setButtonDisabled,
  } = data;
  const withdrawAmount = handleNaN(
    amount,
    numeral(amount).format("0,0.00[0000]")
  );
  const withdrawAmountText = handleNaN(
    amount,
    numeral(amount).format("0,0.00[0000]"),
    true
  );
  const currentPrice = prices?.[symbol];
  const diff = ((currentPrice - startPrice) / startPrice) * 100;

  const pending =
    openTransactions.some((tx) => tx._id === startedAt) ||
    pendingTransactions.some((tx) => tx._id === startedAt);

  return (
    <Modal
      visible={data}
      className="break-modal"
      onClose={() => {
        setData(null);
      }}
    >
      <div className="col centered">
        <img src={unlock} alt="" />
        <h3 className="top-30">Unlock the asset</h3>
      </div>

      <div className="withdraw-amount col centered top-60">
        <p className="light-grey">Amount to withdraw</p>
        <h3>
          {withdrawAmount} {symbol}
        </h3>
      </div>

      <h6 className="top-40">Asset details</h6>

      <div className="max-width top-10">
        <div className="row justify-between">
          <p className="light-grey">Initiated at</p>
          <p>{toShortFormat(new Date(startedAt))}</p>
        </div>

        <div className="row justify-between">
          <p className="light-grey">Lock-up period</p>
          <p>{durationInMonths} months</p>
        </div>
        <div className="row justify-between">
          <p className="light-grey">Initial price</p>
          <p>{numeral(startPrice).format("$0,0.00")} </p>
        </div>
        <div className="row justify-between">
          <p className="light-grey">Return on investment</p>
          <p>
            {diff > 0 ? (
              <span className="green">+{diff.toFixed(2)}%</span>
            ) : (
              <span className="red">{diff.toFixed(2)}%</span>
            )}
          </p>
        </div>
      </div>

      <button
        className="success inverse big top-90 max-width"
        disabled={pending}
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
            `Withdraw ${withdrawAmountText} ${symbol}`
          );
        }}
      >
        Unlock asset{" "}
        <span role="img" aria-label="celebrate">
          🥳
        </span>
      </button>
    </Modal>
  );
}

export default UnlockModal;
