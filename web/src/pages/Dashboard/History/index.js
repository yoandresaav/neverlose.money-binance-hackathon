import React from "react";
import TabHeader from "./TabHeader";
import TabContent from "./TabContent";
import { tabIndexAtom } from "atoms/dashboard";
import { useRecoilState } from "recoil";
import useDashboard from "hooks/useDashboard";

function History(props) {
  const [tabIndex] = useRecoilState(tabIndexAtom);

  let symbol = "WETH";

  if (tabIndex === 1) {
    symbol = "WBTC";
  } else if (tabIndex === 2) {
    symbol = "HUNT";
  }

  global.dashboard = useDashboard(symbol);

  return (
    <div className="history top-60">
      <TabHeader />
      <TabContent symbol={symbol} />
    </div>
  );
}

export default History;
