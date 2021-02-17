import React from "react";
import coinOff from "assets/images/coin-off.svg";
import coinOn from "assets/images/coin-on.svg";
import dollarOn from "assets/images/dollar-on.svg";
import dollarOff from "assets/images/dollar-off.svg";
import { useRecoilState } from "recoil";
import { toggleDollar } from "atoms";

function ToggleDollar(props) {
  const [showDollar, setShowDollar] = useRecoilState(toggleDollar);
  return (
    <div>
      <img
        className="link"
        src={showDollar ? coinOff : coinOn}
        alt=""
        onClick={() => setShowDollar(false)}
      />
      <img
        className="link left-5"
        src={showDollar ? dollarOn : dollarOff}
        alt=""
        onClick={() => setShowDollar(true)}
      />
    </div>
  );
}

export default ToggleDollar;
