import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { TX_TYPE_LOCKUP, TX_TYPE_EXIT } from "constants/index";
import { abi } from "abi/WRNRewardPool.json";
import { abi as ERC20TokenABI } from "abi/ERC20Token.json";
import Web3 from "web3";
import ADDRESSES from "constants/addresses";
import DECIMALS from "constants/decimals";
import BigNumber from "bignumber.js";
import { ALCHEMY_API_KEY } from "web3/connectors";

function useExplorerOverview() {
  const chainId = 97;
  const [chainData, setChainData] = useState(null);
  const [renderData, setRenderData] = useState([]);
  const { type, timestamp } = useRecoilValue(txTimestampAtom);
  const { WETH, WBTC, HUNT } = global.tokenPrices || {};
  const { lastUpdateTimestamp } = global.events;

  useEffect(() => {
    const rewardPoolAddress = ADDRESSES[chainId]?.["WRNRewardPool"];
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
      )
    );
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
        const weth = await getValues(ADDRESSES[chainId]?.WETH, "WETH");
        const wbtc = await getValues(ADDRESSES[chainId]?.WBTC, "WBTC");
        const hunt = await getValues(ADDRESSES[chainId]?.HUNT, "HUNT");

        setChainData([weth, wbtc, hunt]);
      }
    })();
  }, [rewardPool, type, timestamp, chainId, lastUpdateTimestamp]); //eslint-disable-line

  useEffect(() => {
    if (chainData && WETH && WBTC && HUNT) {
      const [weth, wbtc, hunt] = chainData;
      const [
        wethPenalty,
        wethActive,
        wethAcc,
        wethEffectiveTotal,
        wethLockUpCount,
        wethBrokenCount,
      ] = weth;
      const [
        wbtcPenalty,
        wbtcActive,
        wbtcAcc,
        wbtcEffectiveTotal,
        wbtcLockUpCount,
        wbtcBrokenCount,
      ] = wbtc;
      const [
        huntPenalty,
        huntActive,
        huntAcc,
        huntEffectiveTotal,
        huntLockUpCount,
        huntBrokenCount,
      ] = hunt;
      const penalties = [
        wethPenalty * WETH,
        wbtcPenalty * WBTC,
        huntPenalty * HUNT,
      ];

      const totalPenalty = penalties.reduce((a, b) => a + b, 0);

      const activeLockUps = [
        wethActive * WETH,
        wbtcActive * WBTC,
        huntActive * HUNT,
      ];

      const totalActiveLockUp = activeLockUps.reduce((a, b) => a + b, 0);

      const accLockUps = [wethAcc * WETH, wbtcAcc * WBTC, huntAcc * HUNT];

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
        wethEffectiveTotal,
        wbtcEffectiveTotal,
        huntEffectiveTotal,
      ];

      const lockUpCounts = [wethLockUpCount, wbtcLockUpCount, huntLockUpCount];
      const brokenCounts = [wethBrokenCount, wbtcBrokenCount, huntBrokenCount];

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
  }, [chainData, WETH, WBTC, HUNT]);

  return renderData;
}

export default useExplorerOverview;
