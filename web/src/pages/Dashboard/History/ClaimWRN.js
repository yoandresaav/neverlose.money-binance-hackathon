import React from "react";
import pendingWRNImg from "assets/images/pending-wrn.svg";
import claimInfo from "assets/images/claim-info.svg";
import DollarValue from "components/DollarValue";

function ClaimWRN({ symbol }) {
  const { pendingWRN } = global.dashboard[symbol];

  return (
    <div className="claim-item centered col">
      <a
        className="claim-info-icon"
        href="https://hunt-docs.gitbook.io/neverlose-money-bsc/faq#what-is-warren-wrn-token"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={claimInfo} alt="" />
      </a>
      <div className="text-center">
        <img src={pendingWRNImg} alt="" />
        <h6 className="grey top-20">Pending WRN</h6>
        <h6 className="black top-5">
          <DollarValue
            value={pendingWRN}
            format="0,0.[000000000000000000]"
            suffix={" WRN"}
            symbol={"WRN"}
          />
        </h6>
      </div>
    </div>
  );
}

export default ClaimWRN;
