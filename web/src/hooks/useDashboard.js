import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { useERC20Token } from "hooks/useContract";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";
import DECIMALS from "constants/decimals";
import { call } from "utils/binance";

function useDashboard(symbol) {
  const { account, chainId } = useWeb3React();
  const rewardPool = global.rewardPool;
  const { type, timestamp } = useRecoilValue(txTimestampAtom);
  const [data, setData] = useState({
    ETH: {},
    BTCB: {},
    BNB: {},
  });
  const token = useERC20Token(symbol);

  useEffect(() => {
    (async () => {
      if (rewardPool && symbol && token) {
        console.log("attempting", token, rewardPool);
        setData((_data) => {
          return {
            ..._data,
            [symbol]: {},
          };
        });

        const bn = Object.values(
          await rewardPool.methods
            .userLockUps(ADDRESSES[chainId]?.[symbol], account)
            .call()
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

        const d = Object.values(
          await rewardPool.methods
            .tokenStats(ADDRESSES[chainId]?.[symbol])
            .call()
        );

        const [, , effectiveTotalLockUp] = d.map((bignum) =>
          new BigNumber(bignum.toString())
            .dividedBy(Math.pow(10, DECIMALS[symbol]))
            .toNumber()
        );

        const _bonus = await rewardPool.methods
          .earnedBonus(ADDRESSES[chainId]?.[symbol])
          .call();
        const bonus = new BigNumber(_bonus.toString())
          .dividedBy(Math.pow(10, DECIMALS[symbol]))
          .toNumber();

        const [_claimedWRN] = Object.values(await rewardPool.methods
          .userWRNRewards(ADDRESSES[chainId]?.[symbol], account)
          .call());

        const claimedWRN = new BigNumber(_claimedWRN.toString())
          .dividedBy(1e18)
          .toString();

        const _pendingWRN = await rewardPool.methods
          .pendingWRN(ADDRESSES[chainId]?.[symbol])
          .call();

        const pendingWRN = new BigNumber(_pendingWRN.toString())
          .dividedBy(1e18)
          .toString();

        const allowance = (
          await token.methods
            .allowance(account, ADDRESSES[chainId]?.WRNRewardPool)
            .call()
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
