import React, { useMemo } from "react";
import ProgressBar from "components/ProgressBar";
import wrnBlueBlack from "assets/images/warren-blue-black.svg";
import copyGrey from "assets/images/copy-grey.svg";
import openGrey from "assets/images/open-grey.svg";
import caretRightPrimary from "assets/images/caret-right-primary.svg";
import useWRNInfo from "hooks/useWRNInfo";
import AnimatedNumber from "components/AnimatedNumber";
import ClipLoader from "react-spinners/ClipLoader";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import ADDRESSES from "constants/addresses";
import DECIMALS from "constants/decimals";
import IMAGES from "constants/images";

const MAX_SUPPLY = 1200000;
const WRN_ADDRESS = "0xdd42f573125b920b25769b903d4d2c831bd46340";

function WRNBanner(props) {
  const { totalSupply, WRNPrice } = useWRNInfo();

  const memoized = useMemo(() => {
    return (
      <div className="wrn-banner row align-top justify-between top-40">
        <div className="logo-container row align-top right-20">
          <div className="col right-15">
            <img className="wrn-logo" src={wrnBlueBlack} alt="" />
          </div>
          <div className="wrn-info">
            <h6 className="white">WRN (Warren) distribution</h6>
            <div className="row align-center grey top-5 bottom-5">
              <small className="wrn-address overflow-ellipsis">
                {WRN_ADDRESS}
              </small>
              <CopyToClipboard
                text={WRN_ADDRESS}
                onCopy={() => toast.success("Copied to clipboard!")}
              >
                <img className="grey-icon link left-5" src={copyGrey} alt="" />
              </CopyToClipboard>

              <img
                className="grey-icon link left-5"
                src={openGrey}
                alt=""
                onClick={() => {
                  window.open(
                    `https://testnet.bscscan.com/token/${WRN_ADDRESS}`,
                    "_blank"
                  );
                }}
              />
            </div>
            <a
              href="https://hunt-docs.gitbook.io/neverlose-money-bsc/faq#what-is-warren-wrn-token"
              target="_blank"
              rel="noopener noreferrer"
            >
              <small className="primary">About WRN</small>
              <img
                className="caret-right left-5"
                src={caretRightPrimary}
                alt=""
              />
            </a>

            <span
              className="left-15"
              onClick={async () => {
                const symbol = "WRN";
                const address = ADDRESSES[97][symbol];
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
              <small className="primary link">Add WRN to Metamask</small>
              <img
                className="caret-right left-5"
                src={caretRightPrimary}
                alt=""
              />
            </span>
          </div>
        </div>

        <div className="wrn-data col justify-between">
          <div className="row">
            <div className="data-item-margin">
              <small className="grey">Price</small>
              <h6 className="white bold">
                {WRNPrice ? (
                  <AnimatedNumber value={WRNPrice} format="$0,0.00" />
                ) : (
                  <ClipLoader size={14} color="#fff" />
                )}
              </h6>
            </div>
            <div className="data-item-margin">
              <small className="grey">Total supply</small>
              <h6 className="white bold">
                {totalSupply ? (
                  <AnimatedNumber value={totalSupply} format="0,0" />
                ) : (
                  <ClipLoader size={14} color="#fff" />
                )}
              </h6>
            </div>
            <div>
              <small className="grey">Max supply</small>
              <h6 className="white bold">1.2M</h6>
            </div>
          </div>

          <ProgressBar
            backgroundColor="#6d7278"
            progress={totalSupply / MAX_SUPPLY}
          />
        </div>
      </div>
    );
  }, [totalSupply, WRNPrice]);

  return memoized;
}

export default WRNBanner;
