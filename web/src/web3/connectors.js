import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { LedgerConnector } from "@web3-react/ledger-connector";
import { BscConnector } from '@binance-chain/bsc-connector'

const POLLING_INTERVAL = 12000;

export const ALCHEMY_API_KEY = "pIsSDYko10jWKs8jDVY9nTihQYgvg_Fi";

//TODO: move rpc urls to env
const RPC_URLS = {
  1: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
  5: "https://goerli.infura.io/v3/88c638b39c3f4ed984739797ec348f53",
  56: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
};

export const bsc = new BscConnector({
  supportedChainIds: [56, 97] // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
})

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1337, 56, 97],
});

export const dcent = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1337],
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: "Neverlose.money",
});

export const ledger = new LedgerConnector({
  chainId: 1,
  url: RPC_URLS[1],
  pollingInterval: POLLING_INTERVAL,
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
