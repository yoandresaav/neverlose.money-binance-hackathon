import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import fullLogo from "assets/images/logo-full.svg";
import fullLogoBlack from "assets/images/logo-full-black.svg";
import menu from "assets/images/menu-toggle.svg";
import close from "assets/images/close.svg";
import metamask from "assets/images/metamask.svg";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { useRecoilState } from "recoil";
import { connectWallet } from "atoms";

function MobileHeader(props) {
  const [, setVisible] = useRecoilState(connectWallet);
  const { pathname } = props.location;
  const isDashboard = pathname.includes("/dashboard");
  const isHome = pathname === "/";
  const isAbout = pathname.includes("/about");
  const blackBg = isAbout || isHome;
  const isVote = pathname.includes("/vote");

  const [menuVisible, setMenuVisible] = useState(false);
  const { account } = useWeb3React();

  const navigateTo = (route) => {
    if (!account && route === "/dashboard") setVisible(true);
    else props.history.push(route);
    setMenuVisible(false);
  };

  return (
    <div className="mobile-header">
      <div
        className="max-width"
      >
        <div className="logo-container max-width row justify-between">
          <div className="link" onClick={() => props.history.push("/")}>
            <img
              className="logo link"
              src={blackBg ? fullLogo : fullLogoBlack}
              alt=""
            />
          </div>
          <img
            className="menu link"
            src={menuVisible ? close : menu}
            alt=""
            onClick={() => {
              setMenuVisible(!menuVisible);
            }}
          />
        </div>
      </div>
      <div
        className={`mobile-menu col justify-end ${menuVisible &&
          "visible"} ${isAbout && "home"}`}
        style={{ backgroundColor: blackBg ? "#030304" : "#f2f2f2" }}
      >
        <h6
          onClick={() => navigateTo("/")}
          className={`header-link ${isHome && "active"}`}
        >
          Home
        </h6>
        <h6
          onClick={() => navigateTo("/dashboard")}
          className={`header-link ${isDashboard && "active"}`}
        >
          Dashboard
        </h6>
        <h6
          onClick={() => toast("The governance page will launch soon.")}
          className={`header-link ${isVote && "active"}`}
        >
          Governance
        </h6>
        <h6
          onClick={() => navigateTo("/about")}
          className={`header-link ${isAbout && "active"}`}
        >
          About
        </h6>

        <div className="row top-15">
          {account ? (
            <div
              onClick={() => setVisible(true)}
              className="row align-center metamask-container"
              style={{ backgroundColor: isAbout ? "#373737" : "#dedede" }}
            >
              <img className="right-5" src={metamask} alt="" />
              <p className="lighter-grey">{account.substring(0, 9)}...</p>
            </div>
          ) : (
            <button
              onClick={() => setVisible(true)}
              style={{
                backgroundColor: blackBg ? "#030304" : "#f2f2f2",
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(MobileHeader);
