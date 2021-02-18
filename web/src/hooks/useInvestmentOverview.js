import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import {
  TX_TYPE_LOCKUP,
  TX_TYPE_CLAIM_REWARD,
  TX_TYPE_CLAIM_BONUS,
} from "constants/index";
import ADDRESSES from "constants/addresses";
import DECIMALS from "constants/decimals";
import BigNumber from "bignumber.js";

function useInvestmentOverview() {
  const { account, chainId } = useWeb3React();
  const [data, setData] = useState([null, null, null]);
  const rewardPool = global.rewardPool;
  const { type, timestamp } = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    async function getValues(address) {
      let bonus = await rewardPool.methods.earnedBonus(address).call();
      bonus = new BigNumber(bonus.toString());
      const claimed = Object.values(await rewardPool.methods.userLockUps(address, account).call());
      let [total, , accTotal, bonusClaimed] = claimed.map(
        (bignum) => new BigNumber(bignum.toString())
      );

      return [total, bonus, accTotal, bonusClaimed];
    }

    (async () => {
      const nonNullCondition =
        rewardPool && account && chainId && allowedChainId(chainId);
      if (
        nonNullCondition ||
        (nonNullCondition &&
          (type === TX_TYPE_CLAIM_REWARD ||
            type === TX_TYPE_CLAIM_BONUS ||
            type === TX_TYPE_LOCKUP))
      ) {
        const [
          ethStaked,
          ethBonus,
          ethTotal,
          ethBonusClaimed,
        ] = await getValues(ADDRESSES[chainId]?.WETH);
        const [
          btcStaked,
          btcBonus,
          btcTotal,
          btcBonusClaimed,
        ] = await getValues(ADDRESSES[chainId]?.WBTC);
        const [
          huntStaked,
          huntBonus,
          huntTotal,
          huntBonusClaimed,
        ] = await getValues(ADDRESSES[chainId]?.HUNT);

        const totalInvested = {
          WETH: ethStaked.dividedBy(Math.pow(10, DECIMALS.WETH)),
          WBTC: btcStaked.dividedBy(Math.pow(10, DECIMALS.WBTC)),
          HUNT: huntStaked.dividedBy(Math.pow(10, DECIMALS.HUNT)),
        };

        const totalBonus = {
          WETH: ethBonus
            .plus(ethBonusClaimed)
            .dividedBy(Math.pow(10, DECIMALS.WETH)),
          WBTC: btcBonus
            .plus(btcBonusClaimed)
            .dividedBy(Math.pow(10, DECIMALS.WBTC)),
          HUNT: huntBonus
            .plus(huntBonusClaimed)
            .dividedBy(Math.pow(10, DECIMALS.HUNT)),
        };

        const cumulative = {
          WETH: ethTotal.dividedBy(Math.pow(10, DECIMALS.WETH)),
          WBTC: btcTotal.dividedBy(Math.pow(10, DECIMALS.WBTC)),
          HUNT: huntTotal.dividedBy(Math.pow(10, DECIMALS.HUNT)),
        };

        setData([totalInvested, totalBonus, cumulative]);
      }
    })();
  }, [rewardPool, account, chainId, type, timestamp]); //eslint-disable-line

  return data;
}

export default useInvestmentOverview;
