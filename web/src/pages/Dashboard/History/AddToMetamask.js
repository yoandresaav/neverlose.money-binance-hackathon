import React, { useState, useEffect } from "react";
import close from "assets/images/close.svg";
import metamaskLogo from "assets/images/metamask-logo.svg";
import { useWeb3React } from "@web3-react/core";
import ADDRESSES from "constants/addresses";
import DECIMALS from "constants/decimals";
import IMAGES from "constants/images";
import { toast } from "react-toastify";

function AddToMetamask({ symbol }) {
  const { chainId } = useWeb3React();
  const [collapsed, setCollapsed] = useState(
    window.localStorage.getItem(`add-${symbol}-to-metamask`) || false
  );

  useEffect(() => {
    setCollapsed(
      window.localStorage.getItem(`add-${symbol}-to-metamask`) === "true"
    );
  }, [symbol]);

  if (collapsed) return null;

  return (
    <div
      className="max-width add-to-metamask centered bottom-20 link"
      onClick={async () => {
        if (!chainId) return;
        const address = ADDRESSES[chainId][symbol];
        const decimals = DECIMALS[symbol];
        const image = IMAGES[symbol];

        try {
          const wasAdded = await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
              options: {
                address,
                symbol,
                decimals,
                image,
              },
            },
          });

          if (wasAdded) {
            toast.success(`${symbol} is added on your Metamask.`);
          }
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <small>Add {symbol} to Metamask</small>
      <img className="metamask-logo left-5" src={metamaskLogo} alt="" />
      <img
        className="close-button"
        src={close}
        alt=""
        onClick={(e) => {
          e.stopPropagation();
          setCollapsed(true);
          window.localStorage.setItem(`add-${symbol}-to-metamask`, true);
        }}
      />
    </div>
  );
}

export default AddToMetamask;
