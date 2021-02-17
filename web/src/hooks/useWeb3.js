import { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "web3/connectors";

function useWeb3(props) {
  const attempts = useRef(0);
  const connectorRef = useRef({});
  const context = useWeb3React();
  const { account, connector, active, activate, deactivate, error } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const activateInjector = async (injector, bruteForce = false) => {
    if (injector === connector && active) {
      deactivate();
      return;
    } else if (
      (bruteForce && connectorRef.current.active) ||
      attempts.current > 10
    ) {
      return;
    }

    setActivatingConnector(injector);
    await activate(injector);
    if (bruteForce === true) {
      attempts.current += 1;
      await activateInjector(injector, true);
    }
  };

  useEffect(() => {
    if (account) {
      attempts.current = 0;
    }

    connectorRef.current = {
      account,
      active,
      connector,
    };
  }, [active, connector, account]);

  //try to connect if already authorized
  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activateInjector(injected, true);
      }
    });
  }, []); //eslint-disable-line

  return [
    activateInjector,
    deactivate,
    connector,
    !error && !activatingConnector && active, //connected status
  ];
}

export default useWeb3;
