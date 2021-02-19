import React, { useState } from "react";
import Modal from "components/Modal";
import ethBlue from "assets/images/eth-blue.svg";
import wbtcBlue from "assets/images/wbtc-blue.svg";
import huntBlue from "assets/images/hunt-blue.svg";
import Slider from "components/Slider";
import Checkbox from "components/Checkbox";
import lock from "assets/images/lock-white.svg";
import ADDRESSES from "constants/addresses";
import useBalanceOf from "hooks/useBalanceOf";
import DECIMALS from "constants/decimals";
import { TX_TYPE_LOCKUP } from "constants/index";
import { useRecoilState } from "recoil";
import { lockUpModal } from "atoms";
import { useWeb3React } from "@web3-react/core";
import { toShortFormat } from "utils/date";
import { handleNaN, toFixedDown } from "utils/numbers";
import numeral from "numeral";
import {
  transactionPendingModal,
  txTimestampAtom,
  pendingTx,
  openTx,
} from "atoms";
import BigNumber from "bignumber.js";
import { handleErrorMessage } from "utils/errors";
import usePenaltyAndFee from "hooks/usePenaltyAndFee";
import lockupSuccess from "assets/images/lockup-success.svg";
import lockupFail from "assets/images/lockup-fail.svg";
import useDollarEstimate from "hooks/useDollarEstimate";
import { toast } from "react-toastify";

function LockUpModal({ symbol }) {
  const [penaltyRate, feeRate] = usePenaltyAndFee();
  const { chainId, account } = useWeb3React();
  const [visible, setVisible] = useRecoilState(lockUpModal);
  const [, setPendingModalVisible] = useRecoilState(transactionPendingModal);
  const [, setTxTimestamp] = useRecoilState(txTimestampAtom);
  const [pendingTransactions, setPendingTx] = useRecoilState(pendingTx);
  const [openTransactions, setOpenTx] = useRecoilState(openTx);
  const [lockAmount, setLockAmount] = useState("");
  const [sliderValue, setSliderValue] = useState(3);
  const [checked, setChecked] = useState(false);
  const rewardPool = global.rewardPool;
  const estimate = useDollarEstimate(symbol, lockAmount);

  const onClose = () => setVisible(false);

  const reset = () => {
    setLockAmount("");
    setSliderValue(3);
    setChecked(false);
  };

  const balanceOf = useBalanceOf(symbol);

  let imgSrc = ethBlue;

  if (symbol === "WBTC") imgSrc = wbtcBlue;
  else if (symbol === "HUNT") imgSrc = huntBlue;

  const SECONDS_IN_MONTH = 2592000;
  const currDate = new Date();
  const endDate = new Date(
    currDate.getTime() + SECONDS_IN_MONTH * sliderValue * 1000
  );

  if (!penaltyRate || !feeRate) return null;

  const insufficient = +balanceOf < +lockAmount;

  return (
    <Modal
      visible={visible}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <div className="row align-center">
        <img src={imgSrc} alt="" style={{ width: 40, height: 40 }} />
        <h3 className="left-10">{symbol}</h3>
      </div>

      <p className="top-60 lighter-grey">Lock-up amount</p>
      <div className="top-10 row align-center justify-between">
        <input
          type="number"
          className="amount-input font-40"
          placeholder="0.00000000"
          min={0}
          step="any"
          onChange={(e) => {
            const value = e.target.value;
            setLockAmount(toFixedDown(value, DECIMALS[symbol]));
          }}
          onBlur={(e) =>
            setLockAmount(toFixedDown(e.target.value, DECIMALS[symbol]))
          }
          value={lockAmount}
          autoFocus
        />
        <p className="primary link" onClick={() => setLockAmount(balanceOf)}>
          MAX
        </p>
      </div>

      <div className="top-40">
        <p className="lighter-grey">
          Estimated dollar value:{" "}
          <span className="black">
            {numeral(estimate).format("$0,0.00")}
          </span>
        </p>
        <p className="lighter-grey">
          Lock-up period:{" "}
          <span className="black">
            {toShortFormat(currDate)} - {toShortFormat(endDate)}
          </span>
        </p>
        <p className="lighter-grey">
          Bonus multiplier: <span className="black">{sliderValue / 3}x</span>
        </p>
      </div>

      <div className="top-60">
        <Slider value={sliderValue} onChange={(val) => setSliderValue(val)} />
      </div>

      <div className="top-40">
        <div className="hodl-success row align-top">
          <img className="right-20" src={lockupSuccess} alt="" />
          <div>
            <h6 className="green bold">HODL for {sliderValue} months</h6>
            <p className="top-10">
              ✔ Get bonus whenever others fail to HODL
              <br />✔ No fee and no penalty to unlock
            </p>
          </div>
        </div>
        <div className="hodl-fail row align-top top-15">
          <img className="right-20" src={lockupFail} alt="" />
          <div>
            <h6 className="red bold">Withdraw within {sliderValue} months</h6>
            <p className="top-10">
              ✔ {penaltyRate * 100}% penalty and {feeRate * 100}% treasury fund
            </p>
          </div>
        </div>
        <Checkbox
          className="top-40"
          checked={checked}
          onChange={() => setChecked(!checked)}
        >
          I understand and agree to assume full responsibility for all of the
          risks of accessing and using the Interface and interacting with
          Neverlose.money platform.
        </Checkbox>
      </div>

      <button
        className="big top-40 max-width centered"
        disabled={
          !account ||
          !lockAmount ||
          !checked ||
          insufficient ||
          openTransactions.some(
            (tx) => tx.type === TX_TYPE_LOCKUP && tx.symbol === symbol
          ) ||
          pendingTransactions.some(
            (tx) => tx.type === TX_TYPE_LOCKUP && tx.symbol === symbol
          )
        }
        onClick={async () => {
          const actionTimestamp = new Date().getTime();
          try {
            setOpenTx((txArr) =>
              txArr.concat({
                type: TX_TYPE_LOCKUP,
                symbol,
                timestamp: actionTimestamp,
              })
            );

            console.log(lockAmount)

            const hex = `0x${new BigNumber(lockAmount)
              .times(Math.pow(10, DECIMALS[symbol]))
              .toString(16)}`;

            const tx = await rewardPool.doLockUp(
              ADDRESSES[chainId]?.[symbol],
              hex,
              sliderValue
            );
            reset();
            setVisible(false);
            setPendingModalVisible(tx);
            setPendingTx((txArr) =>
              txArr.concat({
                type: TX_TYPE_LOCKUP,
                action: `Lock-up ${handleNaN(
                  lockAmount,
                  numeral(lockAmount).format("0,0.00[0000]"),
                  true
                )} ${symbol}`,
                timestamp: actionTimestamp,
                symbol,
                tx,
              })
            );
            await tx.wait();
            setTxTimestamp({
              type: TX_TYPE_LOCKUP,
              timestamp: new Date().getTime(),
            });
            toast.success("You have successfully locked-up your asset 👏");
          } catch (e) {
            handleErrorMessage(e);
          } finally {
            setPendingModalVisible(false);
            setPendingTx((txArr) =>
              txArr.filter((item) => item.timestamp !== actionTimestamp)
            );
            setOpenTx((txArr) =>
              txArr.filter((item) => item.timestamp !== actionTimestamp)
            );
            reset();
          }
        }}
      >
        <img className="right-5" src={lock} alt="" />
        {insufficient ? "Insufficient balance" : `Lock-up your ${symbol}`}
      </button>

      <p className="top-15 lighter-grey">
        Wallet Balance: {balanceOf} {symbol}
      </p>
    </Modal>
  );
}

export default LockUpModal;
