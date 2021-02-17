import React, { useState } from "react";
import lockBlack from "assets/images/lock-black.svg";
import earnBlack from "assets/images/earn-black.svg";
import warrenBlack from "assets/images/warren-black.svg";
import brokeBlack from "assets/images/broke-black.svg";
import profitBlack from "assets/images/profit-black.svg";
import arrowRight from "assets/images/arrow-right.svg";
import arrowDown from "assets/images/arrow-down.svg";
import arrowDownRight from "assets/images/arrow-down-right.svg";
import arrowDownSolid from "assets/images/arrow-down-solid.svg";
import close from "assets/images/close.svg";

function HowItWorks(props) {
  const [collapsed, setCollapsed] = useState(
    window.localStorage.getItem("how-it-works") || false
  );

  if (collapsed) return null;

  return (
    <div className="how-it-works row justify-between bottom-60 wrap">
      <img
        className="close-button"
        src={close}
        alt=""
        onClick={() => {
          window.localStorage.setItem("how-it-works", true);
          setCollapsed(true);
        }}
      />
      <div className="left-col top-40">
        <h4>How it works</h4>
        <p className="grey top-20">
          Neverlose.money is a gamified HODL protocol. You lock-up your assets
          for a set period. Users who HODL get a bonus while those who fail to
          HODL pay a penalty.
        </p>
      </div>
      <div className="right-col top-40">
        <div className="row">
          <div className="text-block with-arrow">
            <div className="row justify-between align-center">
              <img className="icon" src={lockBlack} alt="" />
              <img className="left-20" src={arrowRight} alt="" />
            </div>
            <h6 className="top-10">Lock-up</h6>
            <p className="grey top-5">
              your long-term investment asset with a set period
            </p>
          </div>

          <div className="text-block with-arrow">
            <div className="row justify-between align-center">
              <img className="icon" src={earnBlack} alt="" />
              <img className="left-20" src={arrowRight} alt="" />
            </div>
            <h6 className="top-10">Get constant bonus</h6>
            <p className="grey top-5">
              whenever others fail to HODL and withdraw their funds
            </p>
          </div>
          <div className="text-block">
            <img className="icon" src={warrenBlack} alt="" />
            <h6 className="top-10">Earn WARREN</h6>
            <p className="grey top-5">
              that empowers community governance of the Neverlose.money protocol
            </p>
          </div>
        </div>

        <div className="row justify-between top-10">
          <div className="text-block">
            <div>
              <img className="arrow-left" src={arrowDown} alt="" />
            </div>
            <img className="icon top-10" src={brokeBlack} alt="" />
            <h6 className="top-10">10% penalty fee</h6>
            <p className="grey top-5">
              if you withdraw within the lock-up period
            </p>
            <small className="grey">(+3% treasury fund)</small>
          </div>

          <div className="text-block">
            <div>
              <img className="arrow-left" src={arrowDown} alt="" />
            </div>
            <img className="icon top-10" src={profitBlack} alt="" />
            <h6 className="top-10">Earn long-term profit</h6>
            <p className="grey top-5">
              gained from not be swayed by short-term volatility
            </p>
          </div>
        </div>
      </div>

      <div className="right-col-mobile top-40">
        <div className="col">
          <div className="text-block with-arrow">
            <div className="row justify-between align-center">
              <img className="icon" src={lockBlack} alt="" />
            </div>
            <h6 className="top-10">Lock-up</h6>
            <p className="grey top-5">
              your long-term investment asset with a set period
            </p>
          </div>

          <div className="row top-10 bottom-10">
            <img className="arrow-down" src={arrowDownSolid} alt="" />
            <img
              className="arrow-down-right left-70"
              src={arrowDownRight}
              alt=""
            />
          </div>

          <div className="two-col-container row max-width">
            <div className="text-block right-20">
              <img className="icon" src={earnBlack} alt="" />
              <h6>Get constant bonus</h6>
              <p className="grey top-5">
                whenever others fail to HODL and withdraw their funds
              </p>
            </div>

            <div className="text-block">
              <img className="icon" src={brokeBlack} alt="" />
              <h6>10% penalty fee</h6>
              <p className="grey top-5">
                if you withdraw within the lock-up period
              </p>
              <small className="grey">(+3% treasury fund)</small>
            </div>
          </div>

          <div className="row top-10 bottom-10">
            <img className="arrow-down" src={arrowDownSolid} alt="" />
            <img
              className="arrow-down-right left-70"
              src={arrowDownRight}
              alt=""
            />
          </div>

          <div className="two-col-container row max-width">
            <div className="text-block right-20">
              <img className="icon" src={warrenBlack} alt="" />
              <h6>Earn WRN</h6>
              <p className="grey top-5">
                that empowers community governance of the Neverlose.money
                protocol
              </p>
            </div>

            <div className="text-block">
              <img className="icon" src={profitBlack} alt="" />
              <h6>Earn long-term profit</h6>
              <p className="grey top-5">
                if you withdraw within the lock-up period
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
