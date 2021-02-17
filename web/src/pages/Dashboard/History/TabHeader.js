import React, { useEffect, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import ethBlue from "assets/images/eth-blue.svg";
import wbtcBlue from "assets/images/wbtc-blue.svg";
import huntBlue from "assets/images/hunt-blue.svg";
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
    if (id === "weth") setTabIndex(0);
    else if (id === "wbtc") setTabIndex(1);
    else if (id === "hunt") setTabIndex(2);
    else props.history.push("/dashboard/weth");
  }, [id]); //eslint-disable-line

  return (
    <div className="row tab-header relative">
      <div
        className="tab-selected"
        style={{ left: width ? tabIndex * width : 0, width: width }}
      />
      <Link ref={ref} to="/dashboard/weth" className="history-tab centered">
        <img src={ethBlue} alt="" />
        <h6 className="left-5">WETH</h6>
      </Link>
      <Link to="/dashboard/wbtc" className="history-tab centered">
        <img src={wbtcBlue} alt="" />
        <h6 className="left-5">WBTC</h6>
      </Link>
      <Link to="/dashboard/hunt" className="history-tab centered">
        <img src={huntBlue} alt="" />
        <h6 className="left-5">HUNT</h6>
      </Link>
      <PendingTransactions />
    </div>
  );
}

export default withRouter(TabHeader);
