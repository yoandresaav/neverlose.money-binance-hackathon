import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { pendingTx } from "atoms";
import { useWeb3React } from "@web3-react/core";
import loadingPrimary from "assets/images/loading-primary.svg";
import openPrimary from "assets/images/open-primary.svg";
import ETHERSCAN from "constants/etherscan";
import Web3 from "web3";
import { getEthersProvider } from "utils/Contract";

function PendingTransactions(props) {
  const { account, chainId, library } = useWeb3React();
  const [clicked, setClicked] = useState(false);
  const [pending, setPending] = useRecoilState(pendingTx);

  useEffect(() => {
    let interval;

    async function refresh() {
      if (account && library) {
        const web3 = getEthersProvider(chainId);

        const cached = JSON.parse(
          window.localStorage.getItem(`${account}:pending-transactions`) || "[]"
        );

        const stillPending = [];

        for (const txObj of cached) {
          const { tx, timestamp } = txObj;
          const result = await web3.eth.getTransactionReceipt(tx.hash);
          const currentTimestamp = new Date().getTime();
          const diff = currentTimestamp - timestamp;
          const secondsPassed = diff / 1000;
          const tenMinutesPassed = secondsPassed > 10 * 60;
          if (!result && !tenMinutesPassed) {
            stillPending.push(txObj);
          }
        }

        if (!interval && stillPending.length > 0) {
          interval = setInterval(refresh, 12 * 1000);
        }

        setPending(stillPending);
      }
    }

    refresh();
    return () => interval && clearInterval(interval);
  }, [account, library]); // eslint-disable-line

  useEffect(() => {
    if (account && pending.length > 0) {
      const pendingObj = JSON.stringify(pending);
      window.localStorage.setItem(
        `${account}:pending-transactions`,
        pendingObj
      );
    }
  }, [account, pending]);

  if (pending.length === 0) return null;

  return (
    <div
      className="pending-transactions row align-center link relative"
      onClick={() => {
        setClicked(!clicked);
      }}
    >
      <h6 className="primary">{pending.length} Pending</h6>
      <img className="loading left-10" src={loadingPrimary} alt="" />

      {clicked && (
        <>
          <div className="popup-triangle" />
          <div className="transactions-popup">
            <div className="popup-content">
              <p className="grey left-15">Pending transactions</p>
              <div className="line" />
              <div className="left-15 right-15">
                {pending?.map(({ action, timestamp, tx }) => {
                  return (
                    <a
                      className="relative row align-center"
                      href={`${ETHERSCAN[chainId]}/tx/${tx?.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={timestamp}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p
                        className="primary break-word"
                        style={{ maxWidth: "90%" }}
                      >
                        {action}
                      </p>
                      <img
                        className="left-5"
                        src={openPrimary}
                        alt=""
                        style={{
                          width: "auto",
                          height: 12,
                        }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PendingTransactions;
