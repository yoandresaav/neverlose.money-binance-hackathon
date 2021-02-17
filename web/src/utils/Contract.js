import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import ADDRESSES from "constants/addresses";
import ethers from "ethers";
import { ALCHEMY_API_KEY } from "web3/connectors";

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getEthersProvider(chainId) {
  if (!chainId) return null;

  const provider = new ethers.providers.AlchemyProvider(
    chainId,
    ALCHEMY_API_KEY
  );

  return provider;
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
