import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";
import DECIMALS from "constants/decimals";

function useEarnedBonus(symbol) {
  const { account, chainId } = useWeb3React();
  const [earned, setEarned] = useState(null);
  const rewardPool = global.rewardPool;
  const txTimestamp = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    let interval;
    async function tick() {
      const bn = await rewardPool.earnedBonus(ADDRESSES[chainId]?.[symbol]);
      const _earned = new BigNumber(bn.toString())
        .dividedBy(Math.pow(10, DECIMALS[symbol]))
        .toNumber();

      setEarned(_earned);
    }
    (async () => {
      if (
        symbol &&
        account &&
        rewardPool &&
        chainId &&
        allowedChainId(chainId)
      ) {
        setEarned(null);
        tick();
        interval = setInterval(tick, 1000 * 10);
      }
    })();

    return () => interval && clearInterval(interval);
  }, [rewardPool, account, symbol, txTimestamp, chainId]); //eslint-disable-line

  return earned;
}

export default useEarnedBonus;
