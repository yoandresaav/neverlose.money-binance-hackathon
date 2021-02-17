import React from "react";
import ReactTooltip from "react-tooltip";
import BigNumber from "bignumber.js";
import uuid from "utils/uuid";

//https://github.com/adamwdraper/Numeral-js/issues/512
export function handleNaN(value, textToShow, textOnly = false) {
  if (value <= 1e-6 && (textToShow === "NaN" || "$NaN")) {
    const _uuid = uuid();
    const _value = new BigNumber(value).toString(10);
    if (textOnly) return _value;
    return (
      <>
        <span data-tip data-for={_uuid}>
          {(+_value)?.toPrecision(3)}
        </span>
        <ReactTooltip id={_uuid} type="dark" effect="float">
          <span>{_value}</span>
        </ReactTooltip>
      </>
    );
  }

  return textToShow;
}

export function toFixedDown(num, digits) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = num.toString().match(re);
  return m ? parseFloat(m[1]) : num.valueOf();
}

//https://github.com/Steemhunt/neverlose.money-web/issues/89
export function formatToFit(num, digits) {
  const str = parseFloat(num).toString();

  // not a float value. don't modify it
  if (str.indexOf(".") === -1) return num;

  const integer = str.split(".")?.[0] || "";
  const decimal = str.split(".")?.[1] || "";

  // if whole num has greater length than the digits,
  // just return the num
  if (integer.length > digits) return integer;

  const belowZero = decimal.substring(0, Math.max(digits - integer.length, 0));

  return belowZero.length > 0 ? `${integer}.${belowZero}` : integer;
}
