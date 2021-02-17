import React, { useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { allowedChainId } from "utils/chainId";
import { useWeb3React } from "@web3-react/core";

function WrongNetworkBanner(props) {
  const isHome = props.location.pathname === "/";
  const { chainId } = useWeb3React();
  const prev = useRef();

  useEffect(() => {
    if (prev.current !== chainId && !allowedChainId(chainId)) {
      prev.current = chainId;
    }
  }, [chainId]);

  return !allowedChainId(chainId) ? (
    <div
      className="network-banner padded-horizontal row centered max-width"
      style={{
        backgroundColor: isHome ? "#030304" : "#f2f2f2",
        borderColor: isHome ? "#373737" : "#dedede",
      }}
    >
      <p className="red max-width break-word text-center">
        Warning: You should be connected to BSC Testnet
      </p>
    </div>
  ) : null;
}

export default withRouter(WrongNetworkBanner);
