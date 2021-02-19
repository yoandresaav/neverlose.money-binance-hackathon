import React from "react";
import HistoryTable from "./HistoryTable";
import ApproveModal from "./ApproveModal";
import LockUpModal from "./LockUpModal";
import AutoClaimBanner from "./AutoClaimBanner";
import Swap from "./Swap";
import ClaimBonus from "./ClaimBonus";
import ClaimBoth from "./ClaimBoth";
import ClaimWRN from "./ClaimWRN";
import LockUpInformation from "./LockUpInformation";
// import AddToMetamask from "./AddToMetamask";

function TabContent({ symbol }) {
  return (
    <div className="tab-content col">
      {symbol === "WBNB" && <Swap symbol={symbol} />}
      {symbol !== "WBNB" && (
        <div className="swap-interface faucet top-40 white">
          Receive test {symbol} from{" "}
          <a
            href="https://testnet.binance.org/faucet-smart"
            target="_blank"
            rel="noopener noreferrer"
          >
            Binance Smart Chain Faucet
          </a>
          .
        </div>
      )}

      <div className="row justify-between wrap">
        <div className="lockup max-width top-40 row justify-between">
          <LockUpInformation symbol={symbol} />

          <div className="col justify-between">
            {/*<AddToMetamask symbol={symbol} />*/}
            <div className="claim-items grow row">
              <ClaimBonus symbol={symbol} />
              <ClaimWRN symbol={symbol} />
            </div>
            <ClaimBoth symbol={symbol} />
          </div>
        </div>
      </div>

      <AutoClaimBanner />

      <HistoryTable symbol={symbol} />
      <ApproveModal symbol={symbol} />
      <LockUpModal symbol={symbol} />
    </div>
  );
}

export default TabContent;
