import React, { useState } from "react";
import zaps from "assets/images/zaps.svg";
import close from "assets/images/close.svg";

function AutoClaimBanner(props) {
  const [collapsed, setCollapsed] = useState(
    window.localStorage.getItem("auto-claim-banner") || false
  );

  if (collapsed) return null;

  return (
    <div className="auto-claim-banner row align-center max-width top-40">
      <img
        className="link close-button"
        src={close}
        alt=""
        onClick={() => {
          window.localStorage.setItem("auto-claim-banner", true);
          setCollapsed(true);
        }}
      />
      <img className="right-20" src={zaps} alt="" />
      <div className="row grow">
        <h6 className="grey max-width">
          The pending bonus and WRN will be automatically claimed whenever you
          lock-up, unlock or break assets in the same pool.{" "}
          <a
            href="https://hunt-docs.gitbook.io/neverlose-money-bsc/faq#pending-bonus-and-wrn-is-suddenly-gone-why"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </h6>
      </div>
    </div>
  );
}

export default AutoClaimBanner;
