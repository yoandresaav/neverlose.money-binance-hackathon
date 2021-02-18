import React from "react";
import Modal from "components/Modal";
import ethBlue from "assets/images/eth-blue.svg";
import wbtcBlue from "assets/images/wbtc-blue.svg";
import huntBlue from "assets/images/hunt-blue.svg";
import { useERC20Token } from "hooks/useContract";
import { useRecoilState } from "recoil";
import { approveModal } from "atoms";
import ADDRESSES from "constants/addresses";
import useBalanceOf from "hooks/useBalanceOf";
import { txTimestampAtom, transactionPendingModal, pendingTx } from "atoms";
import { TX_TYPE_APPROVE } from "constants/index";
import { handleErrorMessage } from "utils/errors";
import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers'

function ApproveModal({ symbol }) {
  const { account, chainId } = useWeb3React();
  const [visible, setVisible] = useRecoilState(approveModal);
  const [, setPendingModalVisible] = useRecoilState(transactionPendingModal);
  const [, setTxTimestamp] = useRecoilState(txTimestampAtom);
  const [pendingTransactions, setPendingTx] = useRecoilState(pendingTx);
  const token = useERC20Token(symbol);
  const balance = useBalanceOf(symbol);

  const onClose = () => setVisible(false);

  let imgSrc = ethBlue;
  if (symbol === "WBTC") imgSrc = wbtcBlue;
  else if (symbol === "HUNT") imgSrc = huntBlue;

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="col grow centered text-center">
        <img
          src={imgSrc}
          style={{ width: 100, height: 100, marginTop: 160 }}
          alt=""
        />
        <div className="font-32 top-40 bottom-70">
          We need permission to use your {symbol}
        </div>
        <button
          className="top-100 big max-width"
          disabled={pendingTransactions.some(
            (tx) => tx.type === TX_TYPE_APPROVE && tx.symbol === symbol
          )}
          onClick={async () => {
            const actionTimestamp = new Date().getTime();
            console.log(ADDRESSES[chainId].WRNRewardPool, account, token);
            try {
              const tx = await token.methods
                .approve(
                  ADDRESSES[chainId]?.WRNRewardPool,
                  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                )
                .send();
              setVisible(false);
              setPendingModalVisible(tx);
              setPendingTx((txArr) =>
                txArr.concat({
                  action: `Approve ${symbol}`,
                  timestamp: actionTimestamp,
                  type: TX_TYPE_APPROVE,
                  symbol,
                  tx,
                })
              );
              // await tx.wait();
              setTxTimestamp({
                type: TX_TYPE_APPROVE,
                timestamp: new Date().getTime(),
              });
            } catch (e) {
              console.log(e)
              handleErrorMessage(e);
            } finally {
              setPendingModalVisible(false);
              setPendingTx((txArr) =>
                txArr.filter((item) => item.timestamp !== actionTimestamp)
              );
            }
          }}
        >
          Approve my {symbol}
        </button>
      </div>
      <p className="grey top-15 text-left">
        Wallet Balance: {balance} {symbol}
      </p>
    </Modal>
  );
}

export default ApproveModal;
