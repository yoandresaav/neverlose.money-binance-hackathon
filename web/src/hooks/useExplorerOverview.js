import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { TX_TYPE_LOCKUP, TX_TYPE_EXIT } from "constants/index";
import { abi } from "abi/WRNRewardPool.json";
import ERC20TokenABI from "abi/ERC20Token.json";
import ADDRESSES from "constants/addresses";
import DECIMALS from "constants/decimals";
import BigNumber from "bignumber.js";
import { getEthersProvider } from "utils/Contract";

function useExplorerOverview() {
  const chainId = 97;
  const [chainData, setChainData] = useState(null);
  const [renderData, setRenderData] = useState([]);
  const { type, timestamp } = useRecoilValue(txTimestampAtom);
  const { ETH, BTCB, WBNB } = global.tokenPrices || {};
  const { lastUpdateTimestamp } = global.events;

  useEffect(() => {
    const rewardPoolAddress = ADDRESSES[chainId]?.["WRNRewardPool"];
    const web3 = getEthersProvider(chainId);
    const token = new web3.eth.Contract(ERC20TokenABI, ADDRESSES[chainId].WRN);
    const rewardPool = new web3.eth.Contract(abi, rewardPoolAddress);

    async function getValues(tokenAddress, symbol) {
      let values = await rewardPool.methods.tokenStats(tokenAddress).call();
      const activeLockUp = values[1];
      const penalty = values[4];
      const accTotalLockUp = values[5];
      const effectiveTotalLockUp = values[2];
      const accTotalLockUpCount = values[6];
      const brokenCount = values[9];

      return [
        new BigNumber(penalty.toString())
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        new BigNumber(activeLockUp.toString())
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        new BigNumber(accTotalLockUp.toString())
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        new BigNumber(effectiveTotalLockUp.toString())
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        new BigNumber(accTotalLockUpCount.toString())
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        new BigNumber(brokenCount.toString())
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
      ];
    }

    (async () => {
      if (
        (rewardPool && token) ||
        type === TX_TYPE_EXIT ||
        type === TX_TYPE_LOCKUP
      ) {
        const wbnb = await getValues(ADDRESSES[chainId]?.WBNB, "WBNB");
        const btcb = await getValues(ADDRESSES[chainId]?.BTCB, "BTCB");
        const eth = await getValues(ADDRESSES[chainId]?.ETH, "ETH");

        setChainData([wbnb, btcb, eth]);
      }
    })();
  }, [rewardPool, type, timestamp, chainId, lastUpdateTimestamp]); //eslint-disable-line

  useEffect(() => {
    if (chainData && ETH && BTCB && WBNB) {
      const [wbnb, btcb, eth] = chainData;
      const [
        wbnbPenalty,
        wbnbActive,
        wbnbAcc,
        wbnbEffectiveTotal,
        wbnbLockUpCount,
        wbnbBrokenCount,
      ] = wbnb;
      const [
        btcbPenalty,
        btcbActive,
        btcbAcc,
        btcbEffectiveTotal,
        btcbLockUpCount,
        btcbBrokenCount,
      ] = btcb;
      const [
        ethPenalty,
        ethActive,
        ethAcc,
        ethEffectiveTotal,
        ethLockUpCount,
        ethBrokenCount,
      ] = eth;
      const penalties = [
        wbnbPenalty * WBNB,
        btcbPenalty * BTCB,
        ethPenalty * ETH,
      ];

      const totalPenalty = penalties.reduce((a, b) => a + b, 0);

      const activeLockUps = [
        wbnbActive * WBNB,
        btcbActive * BTCB,
        ethActive * ETH,
      ];

      const totalActiveLockUp = activeLockUps.reduce((a, b) => a + b, 0);

      const accLockUps = [wbnbAcc * WBNB, btcbAcc * BTCB, ethAcc * ETH];

      const totalAccLockUp = accLockUps.reduce((a, b) => a + b, 0);

      // DEPRECATED, maybe for future use?
      const rate = totalAccLockUp === 0 ? 0 : totalPenalty / totalAccLockUp;

      // separate rates for each token
      const rates = [
        penalties[0] / accLockUps[0],
        penalties[1] / accLockUps[1],
        penalties[2] / accLockUps[2],
      ];

      const effectiveTotal = [
        wbnbEffectiveTotal,
        btcbEffectiveTotal,
        ethEffectiveTotal,
      ];

      const lockUpCounts = [wbnbLockUpCount, btcbLockUpCount, ethLockUpCount];
      const brokenCounts = [wbnbBrokenCount, btcbBrokenCount, ethBrokenCount];

      setRenderData([
        penalties,
        activeLockUps,
        accLockUps,
        totalPenalty,
        totalActiveLockUp,
        totalAccLockUp,
        rate,
        rates,
        effectiveTotal,
        lockUpCounts,
        brokenCounts,
      ]);
    }
  }, [chainData, WBNB, BTCB, ETH]);

  return renderData;
}

export default useExplorerOverview;
