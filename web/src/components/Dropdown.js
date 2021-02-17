import React from "react";
import selectDown from "assets/images/select-down-black.svg";
import wbtcBlue from "assets/images/wbtc-blue.svg";
import ethBlue from "assets/images/eth-blue.svg";
import huntBlue from "assets/images/hunt-blue.svg";

const IMAGE_SOURCES = {
  WBTC: wbtcBlue,
  WETH: ethBlue,
  HUNT: huntBlue,
};

function Dropdown({ className, options = [], value, onChange, formatter }) {
  const isCrypto = options.includes("WETH");
  return (
    <div className={`component-dropdown row relative ${className}`}>
      {isCrypto && (
        <img className="coin-img" src={IMAGE_SOURCES[value]} alt="" />
      )}

      <div className="grow">
        <select
          style={{ paddingLeft: isCrypto ? 35 : 15 }}
          onChange={onChange}
          value={value}
        >
          {options.map((o, i) => {
            return (
              <option key={i} value={o}>
                {formatter ? formatter(o) : o}
              </option>
            );
          })}
        </select>
      </div>
      <img src={selectDown} alt="" />
    </div>
  );
}

export default Dropdown;
