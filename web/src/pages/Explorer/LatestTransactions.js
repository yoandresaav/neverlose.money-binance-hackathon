import React, { useEffect } from "react";
import TransactionCard from "./TransactionCard";
import PacmanLoader from "react-spinners/PacmanLoader";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useWeb3React } from "@web3-react/core";
import useVisibility from "hooks/useVisibility";
import ToggleDollar from "components/ToggleDollar";

function LatestTransactions(props) {
  const { chainId } = useWeb3React();
  const { events, update, fetching } = global.events;

  const [isVisible, elem] = useVisibility(100);

  useEffect(() => {
    if (isVisible) update();
  }, [isVisible]); //eslint-disable-line

  const items = events?.map((event, index) => {
    return <TransactionCard {...event} key={index} chainId={chainId} />;
  });
  return (
    <div className="latest-transactions top-60">
      <div className="row align-end justify-between">
        <h4>Latest transactions</h4>
        <ToggleDollar />
      </div>
      <TransitionGroup className="row wrap justify-between">
        {items}
        <CSSTransition
          key={"placeholder-1"}
          timeout={{ enter: 500, exit: 300 }}
          classNames="card"
        >
          <div className="transaction-card-empty" />
        </CSSTransition>
        <CSSTransition
          key={"placeholder-2"}
          timeout={{ enter: 500, exit: 300 }}
          classNames="card"
        >
          <div className="transaction-card-empty" />
        </CSSTransition>
        <CSSTransition
          key={"placeholder-3"}
          timeout={{ enter: 500, exit: 300 }}
          classNames="card"
        >
          <div className="transaction-card-empty" />
        </CSSTransition>
        <CSSTransition
          key={"placeholder-4"}
          timeout={{ enter: 500, exit: 300 }}
          classNames="card"
        >
          <div className="transaction-card-empty" />
        </CSSTransition>
      </TransitionGroup>
      {fetching && (
        <div className="top-60 bottom-100 col">
          <PacmanLoader size={25} color={"#f0b90b"} loading={true} />
        </div>
      )}

      <div id="end-reached" ref={elem} />
    </div>
  );
}

export default LatestTransactions;
