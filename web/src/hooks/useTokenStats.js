import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import { useWeb3React } from "@web3-react/core";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";
import DECIMALS from "constants/decimals";

function useTokenStats(symbol) {
  const { chainId } = useWeb3React();
  const [data, setData] = useState({
    maxLockUpLimit: null,
    totalLockUp: null,
    effectiveTotalLockUp: null,
    accBonusPerShare: null,
    totalPenalty: null,
  });
  const rewardPool = global.rewardPool;
  const txTimestamp = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    (async () => {
      if (symbol && rewardPool && allowedChainId(chainId)) {
        setData({
          maxLockUpLimit: null,
          totalLockUp: null,
          effectiveTotalLockUp: null,
          accBonusPerShare: null,
          totalPenalty: null,
        });
        const d = await rewardPool.tokenStats(ADDRESSES[chainId]?.[symbol]);
        const [
          maxLockUpLimit,
          totalLockUp,
          effectiveTotalLockUp,
          accBonusPerShare,
          totalPenalty,
        ] = d.map((bignum) => bignum.toString());

        setData({
          maxLockUpLimit,
          totalLockUp: new BigNumber(totalLockUp)
            .dividedBy(Math.pow(10, DECIMALS[symbol]))
            .toNumber(),
          effectiveTotalLockUp: new BigNumber(effectiveTotalLockUp)
            .dividedBy(Math.pow(10, DECIMALS[symbol]))
            .toNumber(),
          accBonusPerShare,
          totalPenalty: new BigNumber(totalPenalty)
            .dividedBy(Math.pow(10, DECIMALS[symbol]))
            .toNumber(),
        });
      }
    })();
  }, [rewardPool, symbol, txTimestamp]); //eslint-disable-line

  return data;
}

export default useTokenStats;
