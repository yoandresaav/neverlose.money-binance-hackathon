import React, { useEffect, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import ethBlue from "assets/images/eth-blue.svg";
import wbtcBlue from "assets/images/wbtc-blue.svg";
import bnbLogo from "assets/images/bnb-logo.svg";
import { tabIndexAtom } from "atoms/dashboard";
import { useRecoilState } from "recoil";
import useResizeObserver from "use-resize-observer";
import PendingTransactions from "./PendingTransactions";

function TabHeader(props) {
  const [tabIndex, setTabIndex] = useRecoilState(tabIndexAtom);
  const ref = useRef(null);
  const { width } = useResizeObserver({ ref });
  const id = props?.match?.params?.id;

  useEffect(() => {
    if (id === "bnb") setTabIndex(0);
    else if (id === "btcb") setTabIndex(1);
    else if (id === "eth") setTabIndex(2);
    else props.history.push("/dashboard/bnb");
  }, [id]); //eslint-disable-line

  return (
    <div className="row tab-header relative">
      <div
        className="tab-selected"
        style={{ left: width ? tabIndex * width : 0, width: width }}
      />
      <Link to="/dashboard/bnb" className="history-tab centered">
        <img src={bnbLogo} alt="" />
        <h6 className="left-5">BNB</h6>
      </Link>
      <Link to="/dashboard/btcb" className="history-tab centered">
        <img src={wbtcBlue} alt="" />
        <h6 className="left-5">BTCB</h6>
      </Link>
      <Link ref={ref} to="/dashboard/eth" className="history-tab centered">
        <img src={ethBlue} alt="" />
        <h6 className="left-5">ETH</h6>
      </Link>
      <PendingTransactions />
    </div>
  );
}

export default withRouter(TabHeader);
