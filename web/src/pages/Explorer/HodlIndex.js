import React from "react";
import bnbLogo from "assets/images/bnb-logo.svg";
import ethBlue from "assets/images/eth-blue.svg";
import wbtcBlue from "assets/images/wbtc-blue.svg";
import questionGrey from "assets/images/question-grey.svg";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";

const INITIAL_PRICES = {
  BTCB: 19269.392,
  ETH: 585.542,
  WBNB: 29.55
};

function getColor(rate) {
  return !rate || rate === 0 ? "grey" : rate > 0 ? "green" : "red";
}

function HodlIndex(props) {
  const { ETH, BTCB, WBNB } = global.tokenPrices || {};
  const btcIncrease = (BTCB - INITIAL_PRICES.BTCB) / INITIAL_PRICES.BTCB;
  const ethIncrease = (ETH - INITIAL_PRICES.ETH) / INITIAL_PRICES.ETH;
  const huntIncrease = (WBNB - INITIAL_PRICES.WBNB) / INITIAL_PRICES.WBNB;

  return (
    <div className="stat-card hodl-index centered top-20">
      <img
        data-tip
        data-for="hodl-index"
        className="question-grey"
        src={questionGrey}
        alt=""
      />
      <ReactTooltip id={"hodl-index"} type="dark" effect="float">
        <span>
          HODL index represents the market value change since the beginning of
          Neverlose.money
        </span>
      </ReactTooltip>
      <div className="outer-circle">
        <div className="middle-circle">
          <div className="inner-circle centered">
            <div className="rotate">
              <div className="coin-symbol hunt">
                <img src={bnbLogo} alt="" />
                <small className={`percentage ${getColor(huntIncrease)}`}>
                  {numeral(huntIncrease).format("0,0.00%")}
                </small>
              </div>
              <div className="coin-symbol eth">
                <img src={ethBlue} alt="" />
                <small className={`percentage ${getColor(ethIncrease)}`}>
                  {numeral(ethIncrease).format("0,0.00%")}
                </small>
              </div>
              <div className="coin-symbol btc">
                <img src={wbtcBlue} alt="" />
                <small className={`percentage ${getColor(btcIncrease)}`}>
                  {numeral(btcIncrease).format("0,0.00%")}
                </small>
              </div>
            </div>
            <h5 className="text-center white">
              HODL
              <br />
              INDEX
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HodlIndex;
