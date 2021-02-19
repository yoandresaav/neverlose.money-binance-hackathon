import React from "react";
import pendingBonusImg from "assets/images/pending-bonus.svg";
import claimInfo from "assets/images/claim-info.svg";
import DollarValue from "components/DollarValue";

function ClaimBonus({ symbol }) {
  const { bonus } = global.dashboard[symbol];

  return (
    <div className="claim-item bonus centered col right-20">
      <a
        className="claim-info-icon"
        href="https://hunt-docs.gitbook.io/neverlose-money-bsc/faq#how-is-the-bonus-calculated"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={claimInfo} alt="" />
      </a>
      <div className="text-center">
        <img src={pendingBonusImg} alt="" />
        <h6 className="grey top-20">Pending Bonus</h6>
        <h6 className="black top-5">
          <DollarValue
            value={bonus}
            format="0,0.[000000000000000000]"
            suffix={" " + symbol}
            symbol={symbol}
          />
        </h6>
      </div>
    </div>
  );
}

export default ClaimBonus;
