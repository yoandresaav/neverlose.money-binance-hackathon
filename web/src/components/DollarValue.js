import React from "react";
import numeral from "numeral";
import AnimatedNumber from "components/AnimatedNumber";
import { handleNaN } from "utils/numbers";
import { useRecoilValue } from "recoil";
import { toggleDollar } from "atoms";
import ClipLoader from "react-spinners/ClipLoader";

function DollarValue({
  className,
  value,
  symbol,
  suffix,
  format = "0,0.00[000000]",
  animated = true,
}) {
  const showDollar = useRecoilValue(toggleDollar);
  const prices = global.tokenPrices;
  const WRNPrice = global.WRNPrice;

  if (showDollar) {
    let price;
    if (symbol === "WRN") price = WRNPrice;
    else price = prices?.[symbol];

    if (!price) {
      const size = className?.split("font-")?.[1] || 14;
      return <ClipLoader size={size} color="#000" />;
    }

    const dollar = price * +value;

    return animated ? (
      <span className={className}>
        $
        <AnimatedNumber
          value={dollar}
          format="0,0.00"
          tooltip={`${handleNaN(
            dollar,
            numeral(dollar).format("$0,0.00"),
            true
          )}`}
        />
      </span>
    ) : (
      <span className={className}>{numeral(dollar).format("$0,0.00")}</span>
    );
  }

  return animated ? (
    <>
      <AnimatedNumber
        className={className}
        value={value}
        tooltip={`${handleNaN(
          value,
          numeral(value).format(format),
          true
        )} ${symbol}`}
      />
      {suffix}
    </>
  ) : (
    <span className={className}>
      {handleNaN(
        value,
        numeral(value).format(+value > 1 ? "0,0.00" : "0,0.00[0000]"),
        true
      )}{" "}
      {suffix}
    </span>
  );
}

export default DollarValue;
