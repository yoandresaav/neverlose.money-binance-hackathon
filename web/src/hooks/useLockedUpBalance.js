import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";
import DECIMALS from "constants/decimals";

function useLockedUpBalance(symbol) {
  const { account, chainId } = useWeb3React();
  const [balance, setBalance] = useState({
    total: null,
    effectiveTotal: null,
    accTotal: null,
    bonusClaimed: null,
    bonusDebt: null,
    lockedUpCount: null,
  });
  const rewardPool = global.rewardPool;
  const txTimestamp = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    let interval;
    async function tick() {
      const bn = await rewardPool.userLockUps(
        ADDRESSES[chainId]?.[symbol],
        account
      );
      const [
        total,
        effectiveTotal,
        accTotal,
        bonusClaimed,
        bonusDebt,
        lockedUpCount,
      ] = bn.map((bignum) => bignum.toString());

      setBalance({
        total: new BigNumber(total)
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        effectiveTotal: new BigNumber(effectiveTotal)
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        accTotal: new BigNumber(accTotal)
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        bonusClaimed: new BigNumber(bonusClaimed)
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        bonusDebt: new BigNumber(bonusDebt)
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber(),
        lockedUpCount,
      });
    }

    (async () => {
      if (
        account &&
        symbol &&
        rewardPool &&
        chainId &&
        allowedChainId(chainId)
      ) {
        setBalance({
          total: null,
          effectiveTotal: null,
          accTotal: null,
          bonusClaimed: null,
          bonusDebt: null,
          lockedUpCount: null,
        });
        tick();
        interval = setInterval(tick, 1000 * 10);
      }
    })();

    return () => interval && clearInterval(interval);
  }, [rewardPool, account, symbol, txTimestamp, chainId]); //eslint-disable-line

  return balance;
}

export default useLockedUpBalance;
