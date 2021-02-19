import React from "react";
import ethBlue from "assets/images/eth-blue.svg";
import wbtcBlue from "assets/images/wbtc-blue.svg";
import bnbLogo from "assets/images/bnb-logo.svg";
import numeral from "numeral";
import { handleNaN } from "utils/numbers";

function OverviewGraph({ data, total, format = "$0,0.00" }) {
  return (
    <div className="overview-graph top-30">
      <div className="row align-center">
        <img className="graph-icon" src={bnbLogo} alt="" />
        <div className="row align-center wrap left-10 max-width">
          <div
            className="bar right-10"
            style={{ width: `${(data?.[0] / total) * 100}%` }}
          />
          <div className="light-grey font-14">
            {handleNaN(data?.[0], numeral(data?.[0]).format(format))}
          </div>
        </div>
      </div>
      <div className="row align-center top-5">
        <img className="graph-icon" src={wbtcBlue} alt="" />
        <div className="row align-center wrap left-10 max-width">
          <div
            className="bar right-10"
            style={{ width: `${(data?.[1] / total) * 100}%` }}
          />
          <div className="light-grey font-14">
            {handleNaN(data?.[1], numeral(data?.[1]).format(format))}
          </div>
        </div>
      </div>
      <div className="row align-center top-5">
        <img className="graph-icon" src={ethBlue} alt="" />
        <div className="row align-center wrap left-10 max-width">
          <div
            className="bar right-10"
            style={{ width: `${(data?.[2] / total) * 100}%` }}
          />
          <div className="light-grey font-14">
            {handleNaN(data?.[2], numeral(data?.[2]).format(format))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewGraph;
