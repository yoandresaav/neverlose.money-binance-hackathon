import React from "react";
import {
  TX_TYPE_LOCKUP,
  TX_TYPE_EXIT,
  TX_TYPE_CLAIM_BOTH,
} from "constants/index";
import ADDRESSES from "constants/addresses";
import { useRecoilState } from "recoil";
import {
  transactionPendingModal,
  txTimestampAtom,
  pendingTx,
  openTx,
} from "atoms";
import { useWeb3React } from "@web3-react/core";
import { handleErrorMessage } from "utils/errors";
import { toast } from "react-toastify";

function ClaimBoth({ symbol }) {
  const { chainId, account } = useWeb3React();
  const rewardPool = global.rewardPool;
  const [, setPendingModalVisible] = useRecoilState(transactionPendingModal);
  const [, setTxTimestamp] = useRecoilState(txTimestampAtom);
  const [openTransactions, setOpenTx] = useRecoilState(openTx);
  const [pendingTransactions, setPendingTx] = useRecoilState(pendingTx);
  const { bonus, pendingWRN } = global.dashboard[symbol];

  return (
    <div className="claim-both centered top-20">
      <button
        className="big max-width"
        disabled={
          !account ||
          bonus === null ||
          pendingWRN === null ||
          (+bonus === 0 && +pendingWRN === 0) ||
          openTransactions.some(
            (tx) =>
              (tx.type === TX_TYPE_CLAIM_BOTH ||
                tx.type === TX_TYPE_EXIT ||
                tx.type === TX_TYPE_LOCKUP) &&
              tx.symbol === symbol
          ) ||
          pendingTransactions.some(
            (tx) =>
              (tx.type === TX_TYPE_CLAIM_BOTH ||
                tx.type === TX_TYPE_EXIT ||
                tx.type === TX_TYPE_LOCKUP) &&
              tx.symbol === symbol
          )
        }
        onClick={async () => {
          const actionTimestamp = new Date().getTime();
          try {
            setOpenTx((txArr) =>
              txArr.concat({
                type: TX_TYPE_CLAIM_BOTH,
                timestamp: actionTimestamp,
                symbol,
              })
            );
            const tx = await rewardPool.claimWRNandBonus(
              ADDRESSES[chainId]?.[symbol]
            );

            setPendingModalVisible(tx);
            setPendingTx((txArr) =>
              txArr.concat({
                action: "Claim pending bonus and WRN",
                type: TX_TYPE_CLAIM_BOTH,
                timestamp: actionTimestamp,
                symbol,
                tx,
              })
            );
            await tx.wait();
            setTxTimestamp({
              type: TX_TYPE_CLAIM_BOTH,
              timestamp: new Date().getTime(),
            });
            toast.success("You have successfully claimed your WRN reward 🤑");
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
          }
        }}
      >
        Claim pending
      </button>
    </div>
  );
}

export default ClaimBoth;
