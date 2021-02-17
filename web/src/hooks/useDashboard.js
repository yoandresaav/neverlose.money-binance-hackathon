import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { useERC20Token } from "hooks/useContract";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";
import DECIMALS from "constants/decimals";

function useDashboard(symbol) {
  const { account, chainId } = useWeb3React();
  const rewardPool = global.rewardPool;
  const { type, timestamp } = useRecoilValue(txTimestampAtom);
  const [data, setData] = useState({
    WETH: {},
    WBTC: {},
    HUNT: {},
  });
  const token = useERC20Token(symbol);

  useEffect(() => {
    (async () => {
      if (rewardPool && symbol && token) {
        setData((_data) => {
          return {
            ..._data,
            [symbol]: {},
          };
        });

        const bn = await rewardPool.userLockUps(
          ADDRESSES[chainId]?.[symbol],
          account
        );
        const [
          total,
          effectiveTotal,
          accTotal,
          bonusClaimed,
        ] = bn.map((bignum) =>
          new BigNumber(bignum.toString())
            .dividedBy(Math.pow(10, DECIMALS[symbol]))
            .toNumber()
        );

        const d = await rewardPool.tokenStats(ADDRESSES[chainId]?.[symbol]);
        const [, , effectiveTotalLockUp] = d.map((bignum) =>
          new BigNumber(bignum.toString())
            .dividedBy(Math.pow(10, DECIMALS[symbol]))
            .toNumber()
        );

        const _bonus = await rewardPool.earnedBonus(
          ADDRESSES[chainId]?.[symbol]
        );
        const bonus = new BigNumber(_bonus.toString())
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber();

        const [_claimedWRN] = await rewardPool.userWRNRewards(
          ADDRESSES[chainId]?.[symbol],
          account
        );

        const claimedWRN = new BigNumber(_claimedWRN.toString())
          .dividedBy(1e18)
          .toString();

        const _pendingWRN = await rewardPool.pendingWRN(
          ADDRESSES[chainId]?.[symbol]
        );

        const pendingWRN = new BigNumber(_pendingWRN.toString())
          .dividedBy(1e18)
          .toString();

        const allowance = (
          await token.allowance(account, ADDRESSES[chainId]?.WRNRewardPool)
        ).toString();

        const percentageLocked = effectiveTotal / effectiveTotalLockUp;
        const roi = (bonusClaimed + bonus) / accTotal;

        setData((_data) => {
          return {
            ..._data,
            [symbol]: {
              total,
              accTotal,
              bonusClaimed,
              bonus,
              claimedWRN,
              pendingWRN,
              allowance,
              percentageLocked,
              roi,
              symbol,
            },
          };
        });
      }
    })();
    //eslint-disable-next-line
  }, [rewardPool, symbol, token, type, timestamp]);

  return data;
}

export default useDashboard;
