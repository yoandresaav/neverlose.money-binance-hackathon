import { ChainId } from "@uniswap/sdk";
import { CHAIN_ID_BSC_MAIN, CHAIN_ID_BSC_TESTNET } from "utils/chainId";

export default {
  [ChainId.MAINNET]: "https://etherscan.io",
  [ChainId.GÖRLI]: "https://goerli.etherscan.io",
  [CHAIN_ID_BSC_MAIN]: "https://bscscan.com",
  [CHAIN_ID_BSC_TESTNET]: "https://testnet.bscscan.com",
};
