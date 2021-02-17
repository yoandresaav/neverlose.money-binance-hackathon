import React from "react";
import { withRouter } from "react-router-dom";
import fullLogo from "assets/images/logo-full.svg";
import fullLogoBlack from "assets/images/logo-full-black.svg";
import { useWeb3React } from "@web3-react/core";
import metamask from "assets/images/metamask.svg";
import { toast } from "react-toastify";
import MobileHeader from "components/MobileHeader";
import { useRecoilState } from "recoil";
import { connectWallet } from "atoms";
import WrongNetworkBanner from "components/WrongNetworkBanner";

function Header(props) {
  const [, setVisible] = useRecoilState(connectWallet);
  const { pathname } = props.location;
  const isDashboard = pathname.includes("/dashboard");
  const isHome = pathname === "/";
  const isAbout = pathname.includes("/about");
  const blackBg = isAbout || isHome;
  const isVote = pathname.includes("/vote");

  const { account } = useWeb3React();

  const navigateTo = (route) => {
    if (!account) setVisible(true);
    else props.history.push(route);
  };

  return (
    <>
      <header>
        {props?.location?.pathname?.match(/^\/dashboard/) && (
          <WrongNetworkBanner />
        )}
        <div className="padded-horizontal header-padding">
          <MobileHeader />
          <div className="header-content row align-center justify-between">
            <div className="link" onClick={() => props.history.push("/")}>
              <img
                className="logo"
                src={blackBg ? fullLogo : fullLogoBlack}
                alt="logo"
              />
            </div>

            <div className="row">
              <div
                onClick={() => props.history.push("/")}
                className={`header-link ${isHome && "active"}`}
              >
                Home
              </div>
              <div
                onClick={() => navigateTo("/dashboard")}
                className={`header-link ${isDashboard && "active"}`}
              >
                Dashboard
              </div>
              <div
                onClick={() => toast("The governance page will launch soon.")}
                className={`header-link ${isVote && "active"}`}
              >
                Governance
              </div>
              <div
                onClick={() => props.history.push("/about")}
                className={`header-link ${isAbout && "active"}`}
              >
                About
              </div>
            </div>

            <div className="header-right">
              {account ? (
                <div
                  onClick={() => setVisible(true)}
                  className="row align-center metamask-container"
                  style={{ backgroundColor: blackBg ? "#373737" : "#dedede" }}
                >
                  <img className="right-5" src={metamask} alt="" />
                  <p className="lighter-grey">{account.substring(0, 9)}...</p>
                </div>
              ) : (
                <button onClick={() => setVisible(true)}>Connect</button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default withRouter(Header);
