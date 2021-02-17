import { useMemo } from "react";
import { abi as ERC20TokenABI } from "abi/ERC20Token.json";
import { abi as WRNRewardPoolABI } from "abi/WRNRewardPool.json";
import WETH_ABI from "abi/WETH.json";
import { getContract, isAddress } from "utils/Contract";
import { useWeb3React } from "@web3-react/core";
import { allowedChainId } from "utils/chainId";
import ADDRESSES from "constants/addresses";
import { abi as IUniswapV2Router02ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";

// returns null on errors
function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useERC20Token(symbolOrAddress) {
  const { chainId } = useWeb3React();
  const arg = isAddress(symbolOrAddress)
    ? symbolOrAddress
    : ADDRESSES[chainId]?.[symbolOrAddress];
  return useContract(allowedChainId(chainId) && arg, ERC20TokenABI, true);
}

export function useWETH(address) {
  const { chainId } = useWeb3React();
  return useContract(allowedChainId(chainId) && address, WETH_ABI, true);
}

export function useWRNRewardPool() {
  const { chainId } = useWeb3React();
  console.log(chainId, WRNRewardPoolABI)
  return useContract(
    allowedChainId(chainId) && ADDRESSES[chainId]?.WRNRewardPool,
    WRNRewardPoolABI,
    true
  );
}

export function useRouterContract(chainId) {
  return useContract(
    ADDRESSES[chainId]?.UNISWAP_ROUTER,
    IUniswapV2Router02ABI,
    true
  );
}
