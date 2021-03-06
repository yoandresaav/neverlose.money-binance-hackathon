export const CHAINID_MAINNET = 1;
export const CHAINID_ROPSTEN = 3;
export const CHAINID_GOERLI = 5;
export const CHAIN_ID_BSC_MAIN = 56;
export const CHAIN_ID_BSC_TESTNET = 97;

export function allowedChainId(id) {
  // return process.env.NODE_ENV === "production"
  //   ? [CHAINID_MAINNET].includes(id)
  //   : [CHAINID_MAINNET].includes(id);
  return [CHAIN_ID_BSC_TESTNET].includes(
    id
  );
}
