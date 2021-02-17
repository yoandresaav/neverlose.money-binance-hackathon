import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";

function usePendingWRN(symbol) {
  const { account, chainId } = useWeb3React();
  const [pending, setPending] = useState(null);
  const rewardPool = global.rewardPool;
  const txTimestamp = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    let interval;
    async function tick() {
      const bn = await rewardPool.pendingWRN(ADDRESSES[chainId]?.[symbol]);
      setPending(bn.toString());
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
  }, [rewardPool, account, symbol, chainId, txTimestamp]); //eslint-disable-line

  return pending && new BigNumber(pending).dividedBy(1e18).toString();
}

export default usePendingWRN;
