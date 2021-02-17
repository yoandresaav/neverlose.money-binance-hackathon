import React, { useEffect } from "react";
import Modal from "components/Modal";
import wrnBlueBlack from "assets/images/warren-blue-black.svg";
import metamaskLogo from "assets/images/metamask-logo.svg";
import coinbaseLogo from "assets/images/coinbase-logo.svg";
import ledgerLogo from "assets/images/ledger-logo.svg";
import walletconnectLogo from "assets/images/walletconnect-logo.svg";
import bWallet from "assets/images/b-wallet.svg";
import arrowRight from "assets/images/right-blue.svg";
import checkWhite from "assets/images/check-white.svg";
import { useRecoilState } from "recoil";
import { connectWallet } from "atoms";
import {
  dcent,
  injected,
  walletlink,
  ledger,
  walletconnect,
} from "web3/connectors";
import { useWeb3React } from "@web3-react/core";
import useWeb3 from "hooks/useWeb3";
import { handleErrorMessage } from "utils/errors";

function WalletItem({ className, icon, title, onClick, connected }) {
  return (
    <div
      className={`wallet-item link max-width row align-center justify-between ${connected &&
        "connected"} ${className}`}
      onClick={onClick}
    >
      <div className="row align-center">
        <img className="wallet-logo" src={icon} alt="" />
        <h6 style={{ color: connected ? "white" : "black" }}>{title}</h6>
      </div>
      <img
        src={connected ? checkWhite : arrowRight}
        alt=""
        style={{ height: 14, width: "auto" }}
      />
    </div>
  );
}

function ConnectWallet(props) {
  const [visible, setVisible] = useRecoilState(connectWallet);
  const [activate, , connector, connected] = useWeb3();
  const { account } = useWeb3React();

  const metamaskAvailable =
    window.web3 && window.web3.currentProvider.isMetaMask === true;

  const dcentAvailable =
    window.ethereum && window.ethereum.isDcentWallet === true;

  async function activateDCENT() {
    if (!dcentAvailable) {
      window.open("https://dcentwallet.com/features/neverlose-money", "_blank");
      return;
    }

    try {
      await activate(dcent);
    } catch (e) {
      handleErrorMessage(e);
    }
  }

  useEffect(() => {
    if (account) {
      setVisible(false);
    }
  }, [account]); //eslint-disable-line

  return (
    <Modal visible={visible} onClose={() => setVisible(null)}>
      <div className="connect-wallet top-60">
        <div className="col align-center">
          <img src={wrnBlueBlack} alt="" style={{ width: 100, height: 100 }} />
          <h4 className="top-30">Connect Wallet</h4>
          <div className="top-70 col max-width">
            <WalletItem
              icon={bWallet}
              title={"Binance Chain Wallet"}
              onClick={() => {
                activateDCENT();
              }}
              connected={connected && connector === dcent}
            />
            <WalletItem
              className="top-15"
              icon={metamaskLogo}
              title={metamaskAvailable ? "Metamask" : "Install Metamask"}
              onClick={() => {
                metamaskAvailable
                  ? activate(injected)
                  : window.open("https://metamask.io/", "_blank");
              }}
              connected={connected && connector === injected}
            />
            <WalletItem
              className="top-15"
              icon={coinbaseLogo}
              title="Coinbase Wallet"
              onClick={() => activate(walletlink)}
              connected={connected && connector === walletlink}
            />
            <WalletItem
              className="top-15"
              icon={ledgerLogo}
              title="Ledger"
              onClick={() => activate(ledger)}
              connected={connected && connector === ledger}
            />
            <WalletItem
              className="top-15"
              icon={walletconnectLogo}
              title="Wallet Connect"
              onClick={() => activate(walletconnect)}
              connected={connected && connector === walletconnect}
            />
          </div>
        </div>

        <p className="lighter-grey top-70">
          By connecting, you agree to our{" "}
          <a
            className="primary"
            href="https://docs.neverlose.money/others/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
          .
        </p>
        <p className="lighter-grey top-10">
          New to Ethereum?{" "}
          <a
            className="primary"
            href="https://ethereum.org/en/wallets/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about wallets
          </a>
          .
        </p>
      </div>
    </Modal>
  );
}

export default ConnectWallet;