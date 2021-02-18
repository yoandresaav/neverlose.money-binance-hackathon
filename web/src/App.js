import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useTokenPrices from "hooks/useTokenPrices";
import DiscordFAB from "components/DiscordFAB";
import Routes from "./routes";

import { RecoilRoot } from "recoil";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  window.library = library;
  return library;
}

function App() {
  global.tokenPrices = useTokenPrices();

  return (
    <>
      <RecoilRoot>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Router>
            <Routes />
          </Router>
        </Web3ReactProvider>
      </RecoilRoot>
      <ToastContainer />
      {/* <DiscordFAB /> */}
    </>
  );
}

export default App;
