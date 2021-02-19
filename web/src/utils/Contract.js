import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import ADDRESSES from "constants/addresses";
import { allowedChainId } from "utils/chainId";
import Web3 from "web3";
import random from "lodash/random";

// Array of available nodes to connect to
const nodes = [
  "https://data-seed-prebsc-2-s1.binance.org:8545",
  "https://data-seed-prebsc-1-s2.binance.org:8545",
  "https://data-seed-prebsc-2-s2.binance.org:8545",
  "https://data-seed-prebsc-1-s3.binance.org:8545",
  "https://data-seed-prebsc-2-s3.binance.org:8545",
];

function getRpc() {
  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex];
}

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getEthersProvider(chainId) {
  if (!allowedChainId(chainId) || !chainId) return null;

  const web3 = new Web3(getRpc());

  return web3;
}

// account is not optional
export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
  // return new web3.eth.Contract(ABI, address, {from: account});
}

export function getSymbol(chainId, address) {
  let foundKey = "";
  Object.keys(ADDRESSES[chainId]).some((symbol) => {
    if (ADDRESSES[chainId]?.[symbol].toLowerCase() === address.toLowerCase()) {
      foundKey = symbol;
      return true;
    }

    return false;
  });

  return foundKey;
}

// add 10%, code taken from uniswap.org
export function calculateGasMargin(value) {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}
