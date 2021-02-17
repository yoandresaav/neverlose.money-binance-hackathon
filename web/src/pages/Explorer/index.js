import React, { useMemo } from "react";
import InvestmentOverview from "./InvestmentOverview";
import LatestTransactions from "./LatestTransactions";
import WRNBanner from "./WRNBanner";
import MainBanner from "./MainBanner";
import BonusCalculator from "components/BonusCalculator";

function Explorer(props) {
  const mainBanner = useMemo(() => <MainBanner />, []);
  return (
    <div className="page-explorer">
      {mainBanner}
      <div className="padded-horizontal content">
        <InvestmentOverview />
        <WRNBanner />
        <LatestTransactions />
        <BonusCalculator />
      </div>
    </div>
  );
}

export default Explorer;
