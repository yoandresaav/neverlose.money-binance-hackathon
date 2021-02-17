import React, { useMemo } from "react";
import useInvestmentOverview from "hooks/useInvestmentOverview";
import AnimatedNumber from "components/AnimatedNumber";
import bonusFromLosers from "assets/images/bonus-from-losers.svg";
import roiFace from "assets/images/roi-face.svg";

function InvestmentOverview(props) {
  const [
    totalInvestedObject,
    totalEarnedObject,
    cumulativeObject,
  ] = useInvestmentOverview();
  const prices = global.tokenPrices;

  const memoized = useMemo(() => {
    let totalInvested;
    let totalEarned;
    let cumulative;

    if (
      totalInvestedObject &&
      totalEarnedObject &&
      cumulativeObject &&
      prices
    ) {
      Object.keys(totalInvestedObject).forEach((key) => {
        if (!totalInvested) totalInvested = 0;
        if (!totalEarned) totalEarned = 0;
        if (!cumulative) cumulative = 0;

        totalInvested += totalInvestedObject[key]
          .multipliedBy(prices[key])
          .toNumber();
        totalEarned += totalEarnedObject[key]
          .multipliedBy(prices[key])
          .toNumber();
        cumulative += cumulativeObject[key]
          .multipliedBy(prices[key])
          .toNumber();
      });
    }

    let totalROI =
      !cumulative || cumulative === 0 ? 0 : totalEarned / cumulative;

    return (
      <div className="investment-overview">
        <h4>Your investment overview</h4>

        <div className="row justify-between wrap">
          <div className="stat-card col top-20">
            <h6 className="lighter-grey">Active investment</h6>
            <div className="data white bold">
              <AnimatedNumber value={totalInvested} format="$0,0.00" />
            </div>
            <hr />
            <h6 className="lighter-grey">Cumulative investment so far</h6>
            <h6 className="white top-5">
              <AnimatedNumber value={cumulative} format="$0,0.00" />
            </h6>
          </div>

          <div className="col justify-between">
            <div className="stat-card row align-center small top-20">
              <img className="right-20" src={bonusFromLosers} alt="" />
              <div>
                <h6 className="lighter-grey">Bonus from losers</h6>
                <div className="data white bold">
                  <AnimatedNumber value={totalEarned} format="$0,0.00" />
                </div>
              </div>
            </div>

            <div className="stat-card row align-center small top-20">
              <img className="right-20" src={roiFace} alt="" />
              <div>
                <h6 className="lighter-grey">Return on investment</h6>
                <div className="data bold">
                  <AnimatedNumber
                    className="green"
                    value={totalROI}
                    format="0,0.00%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [totalInvestedObject, prices]); //eslint-disable-line

  return memoized;
}

export default InvestmentOverview;
