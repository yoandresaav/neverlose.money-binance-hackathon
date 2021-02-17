import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Header from "components/Header";
import Footer from "components/Footer";
import ConnectWallet from "components/ConnectWallet";
import ChainChecker from "components/ChainChecker";
import Dashboard from "pages/Dashboard";
import Explorer from "pages/Explorer";
import About from "pages/About";
import useEvents from "hooks/useEvents";
import { useWRNRewardPool } from "hooks/useContract";
import useWRNPrice from "hooks/useWRNPrice";
import useExplorerOverview from "hooks/useExplorerOverview";
import HODLModal from "components/HODLModal";

function Routes(props) {
  global.rewardPool = useWRNRewardPool();
  global.events = useEvents();
  global.WRNPrice = useWRNPrice();
  global.explorerOverview = useExplorerOverview();

  return (
    <>
      <div id="app">
        <Header />
        <Switch>
          <Route exact path="/" component={Explorer} />
          <Route path="/dashboard/:id?" component={Dashboard} />
          <Route exact path="/about" component={About} />
        </Switch>
        <Footer />
        <ChainChecker />
        <ConnectWallet />
        <HODLModal />
      </div>
    </>
  );
}

export default withRouter(Routes);
