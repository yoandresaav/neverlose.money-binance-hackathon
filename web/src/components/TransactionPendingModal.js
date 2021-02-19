import React from "react";
import Modal from "components/Modal";
import { useRecoilState } from "recoil";
import { transactionPendingModal } from "atoms";
import { useWeb3React } from "@web3-react/core";
import ClockLoader from "react-spinners/ClockLoader";
import ETHERSCAN from "constants/etherscan";

function TransactionPendingModal({ symbol }) {
  const { chainId } = useWeb3React();
  const [tx, setVisible] = useRecoilState(transactionPendingModal);

  const onClose = () => setVisible(false);

  return (
    <Modal visible={tx} onClose={onClose} style={{ zIndex: 99999 }}>
      <div className="col grow centered text-center">
        <div style={{ marginTop: 100 }}>
          <ClockLoader size={70} color={"#f0b90b"} loading={true} />
        </div>
        <div className="font-32 top-60">Transaction pending...</div>
        <p className="light-grey top-5 bottom-70">
          Transaction is being broadcasted to the network.
        </p>
        <a
          className="max-width"
          href={`${ETHERSCAN[chainId]}/tx/${tx?.hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="top-100 big max-width" onClick={() => {}}>
            View on Etherscan
          </button>
        </a>
      </div>
    </Modal>
  );
}

export default TransactionPendingModal;
