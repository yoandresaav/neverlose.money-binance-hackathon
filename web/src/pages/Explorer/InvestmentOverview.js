import React, { useState, useMemo } from "react";
import AnimatedNumber from "components/AnimatedNumber";
import OverviewGraph from "components/OverviewGraph";
import activeOn from "assets/images/active-on.svg";
import activeOff from "assets/images/active-off.svg";
import cumulativeOn from "assets/images/cumulative-on.svg";
import cumulativeOff from "assets/images/cumulative-off.svg";
import HodlIndex from "./HodlIndex";

function InvestmentOverview(props) {
  const [
    penalties,
    activeLockUps,
    accLockUps,
    totalPenalty,
    totalActiveLockUp,
    totalAccLockUp,
  ] = global.explorerOverview;
  const [isCumulative, setIsCumulative] = useState(true);

  const memoized = useMemo(
    () => (
      <div>
        <h4>Total investment overview</h4>

        <div className="row justify-between wrap relative">
          <div className="stat-card top-20 relative">
            <div className="active-cumulative">
              <img
                className="link"
                src={isCumulative ? activeOff : activeOn}
                onClick={() => setIsCumulative(false)}
                alt=""
              />
              <img
                className="link left-5"
                src={isCumulative ? cumulativeOn : cumulativeOff}
                onClick={() => setIsCumulative(true)}
                alt=""
              />
            </div>
            <h6 className="grey">
              Total{" "}
              <span
                className="primary link"
                onClick={() => setIsCumulative((prev) => !prev)}
              >
                {isCumulative ? "cumulative" : "active"}
              </span>{" "}
              lock-ups
            </h6>
            <div className="title white">
              <AnimatedNumber
                className="bold"
                value={isCumulative ? totalAccLockUp : totalActiveLockUp}
                format="$0,0.00"
              />
            </div>
            <OverviewGraph
              data={isCumulative ? accLockUps : activeLockUps}
              total={isCumulative ? totalAccLockUp : totalActiveLockUp}
            />
          </div>
          <div className="stat-card top-20">
            <h6 className="grey">Total bonus generated</h6>
            <div className="title white">
              <AnimatedNumber
                className="bold"
                value={totalPenalty}
                format="$0,0.00"
              />
            </div>
            <OverviewGraph data={penalties} total={totalPenalty} />
          </div>
          <HodlIndex />
        </div>
      </div>
    ),
    [
      isCumulative,
      penalties,
      activeLockUps,
      accLockUps,
      totalPenalty,
      totalActiveLockUp,
      totalAccLockUp,
    ]
  );

  return memoized;
}

export default InvestmentOverview;
