import React from "react";

function Loading({ className, size = 12 }) {
  return (
    <svg
      className={`component-loading ${className}`}
      style={{ display: "inline-block", width: size, height: size }}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 460.115 373.846 L 453.174 369.838 C 447.628 366.636 445.61 359.661 448.513 353.952 C 481.484 289.114 479.68 211.221 443.098 147.998 C 406.594 84.642 339.98 44.122 267.298 40.297 C 260.952 39.963 256 34.676 256 28.321 L 256 20.309 C 256 13.405 261.808 7.972 268.703 8.327 C 352.255 12.633 428.86 59.188 470.809 131.997 C 512.878 204.7 514.892 294.319 476.843 368.835 C 473.703 374.984 466.093 377.297 460.115 373.846 Z" />
    </svg>
  );
}

export default Loading;
