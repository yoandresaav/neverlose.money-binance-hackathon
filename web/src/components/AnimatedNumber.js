import React, { useMemo } from "react";
import AnimatedNum from "./AnimatedNumberLibrary";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import uuid from "utils/uuid";
import { formatToFit } from "utils/numbers";

function AnimatedNumber({
  className,
  value,
  format = "0,0.00[0000]",
  tooltip = "",
  space = 9,
}) {
  const _uuid = useMemo(() => uuid(), []);
  const isPercentage = format.includes("%");

  if (typeof value === "object") value = value?.toNumber();
  else if (typeof value === "string") value = +value;

  return value !== null && !Number.isNaN(value) ? (
    <span data-tip data-for={_uuid}>
      <AnimatedNum
        className={className}
        duration={1000}
        value={value}
        initialValue={value}
        formatValue={(val) => {
          if (value === 0) return `0.00${isPercentage ? "%" : ""}`;
          else if (value <= 1e-6) {
            return value.toPrecision(3);
          }

          const formatted = numeral(formatToFit(val, space)).format(format);

          return formatted === "NaN"
            ? `0.00${isPercentage ? "%" : ""}`
            : formatted;
        }}
      />
      {tooltip && (
        <ReactTooltip id={_uuid} type="dark" effect="float">
          <span>{tooltip}</span>
        </ReactTooltip>
      )}
    </span>
  ) : isPercentage ? (
    "- %"
  ) : (
    "-"
  );
}

export default AnimatedNumber;
