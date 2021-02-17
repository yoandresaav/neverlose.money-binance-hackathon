import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import ADDRESSES from "constants/addresses";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import BigNumber from "bignumber.js";

function useClaimedWRN(symbol) {
  const { account, chainId } = useWeb3React();
  const [pending, setPending] = useState(null);
  const rewardPool = global.rewardPool;
  const txTimestamp = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    let interval;
    async function tick() {
      const [claimed] = await rewardPool.userWRNRewards(
        ADDRESSES[chainId]?.[symbol],
        account
      );
      setPending(claimed.toString());
    }

    (async () => {
      if (
        account &&
        rewardPool &&
        symbol &&
        chainId &&
        allowedChainId(chainId)
      ) {
        setPending(null);
        tick();
        interval = setInterval(tick, 1000 * 10);
      }
    })();

    return () => interval && clearInterval(interval);
  }, [rewardPool, account, symbol, txTimestamp, chainId]); //eslint-disable-line

  return pending && new BigNumber(pending).dividedBy(1e18).toString();
}

export default useClaimedWRN;
