import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useRecoilState } from "recoil";
import {
  txTimestampAtom,
  transactionPendingModal,
  pendingTx,
  openTx,
} from "atoms";
import { SECONDS_IN_MONTH, TX_TYPE_LOCKUP } from "constants/index";
import DECIMALS from "constants/decimals";
import { allowedChainId } from "utils/chainId";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";
import { handleErrorMessage } from "utils/errors";
import { TX_TYPE_EXIT } from "constants/index";
import { toast } from "react-toastify";

function useLockUpHistory(symbol) {
  const { account, chainId } = useWeb3React();
  const [lockUps, setLockUps] = useState(null);
  const [lastTx, setTxTimestamp] = useRecoilState(txTimestampAtom);
  const rewardPool = global.rewardPool;
  const [, setPendingModalVisible] = useRecoilState(transactionPendingModal);
  const [, setOpenTx] = useRecoilState(openTx);
  const [, setPendingTx] = useRecoilState(pendingTx);

  useEffect(() => {
    setLockUps((prev) => {
      return { ...prev, [symbol]: null };
    });

    (async () => {
      const nonNullCondition =
        account && rewardPool && chainId && allowedChainId(chainId);
      if (
        nonNullCondition ||
        (nonNullCondition && lastTx.type === TX_TYPE_LOCKUP)
      ) {
        const bn = Object.values(
          await rewardPool.methods
            .userLockUps(ADDRESSES[chainId]?.[symbol], account)
            .call()
        );
        const [, , , , , lockedUpCount] = bn.map((bignum) => bignum.toString());

        if (+lockedUpCount > 0) {
          const history = [];

          async function fabricate(id, data) {
            const [
              durationInMonths,
              unlockedAt,
              amount,
              effectiveAmount,
              exitedAt,
            ] = data.map((bn) => bn.toString());

            let startedAt = new Date(
              (+unlockedAt - SECONDS_IN_MONTH * +durationInMonths) * 1000
            );

            let coinID = "hunt-token";

            if (symbol === "WBTC") {
              coinID = "wrapped-bitcoin";
            } else if (symbol === "WETH") {
              coinID = "weth";
            }

            const timestamp = startedAt.getTime() / 1000;

            const storageKey = `${coinID}-${timestamp}`;
            let startPrice = +window.localStorage.getItem(storageKey);
            const apiURL = `https://nomadtask.com/market_prices.json?timestamp=${timestamp}`;

            try {
              if (!startPrice) {
                const resp = await fetch(apiURL);
                const json = await resp.json();
                const _startPrice = json.prices[symbol.replace("W", "")];
                startPrice = _startPrice;
                window.localStorage.setItem(storageKey, _startPrice);
              }
            } catch (e) {
              console.error(
                `Fetching price error for API: ${apiURL} - Message: ${e.message}`
              );
              startPrice = null;
            }

            const exit = async (_id, closeModal, onFinish, action) => {
              const actionTimestamp = new Date().getTime();

              try {
                setOpenTx((txArr) =>
                  txArr.concat({
                    timestamp: actionTimestamp,
                    type: TX_TYPE_EXIT,
                    symbol,
                    _id,
                  })
                );

                const tx = await rewardPool.exit(
                  ADDRESSES[chainId]?.[symbol],
                  id,
                  new Date().getTime() < unlockedAt * 1000
                );
                closeModal();

                setPendingTx((txArr) =>
                  txArr.concat({
                    action,
                    timestamp: actionTimestamp,
                    type: TX_TYPE_EXIT,
                    symbol,
                    tx,
                    _id,
                  })
                );

                setPendingModalVisible(tx);
                await tx.wait();
                const _data = await rewardPool.methods
                  .getLockUp(ADDRESSES[chainId]?.[symbol], account, id)
                  .call();
                const fabricated = await fabricate(id, _data);

                setLockUps((_lockUps) => {
                  const merged = _lockUps?.[symbol]?.map((l) => {
                    if (l.id === id) return fabricated;
                    return l;
                  });

                  return { ..._lockUps, [symbol]: merged };
                });

                setTxTimestamp({
                  type: TX_TYPE_EXIT,
                  timestamp: new Date().getTime(),
                });

                if (action.includes("Break")) {
                  toast.success(
                    "You have successfully broken your lock-up. 💔"
                  );
                } else {
                  toast.success(
                    "You have successfully unlocked your asset. 🎉"
                  );
                }
              } catch (e) {
                handleErrorMessage(e);
              } finally {
                onFinish();
                setPendingModalVisible(false);
                setOpenTx((txArr) =>
                  txArr.filter((item) => item.timestamp !== actionTimestamp)
                );
                setPendingTx((txArr) =>
                  txArr.filter((item) => item.timestamp !== actionTimestamp)
                );
              }
            };

            return {
              id,
              durationInMonths,
              unlockedAt,
              startedAt,
              startPrice,
              effectiveAmount,
              exit,
              exitedAt,
              amount: new BigNumber(amount)
                .dividedBy(Math.pow(10, DECIMALS[symbol]))
                .toString(),
            };
          }

          for (const id in new Array(+lockedUpCount).fill(undefined)) {
            const data = await rewardPool.getLockUp(
              ADDRESSES[chainId]?.[symbol],
              account,
              id
            );

            history.push(await fabricate(id, data));
          }

          setLockUps((prev) => {
            return { ...prev, [symbol]: history };
          });
        } else {
          setLockUps((prev) => {
            return { ...prev, [symbol]: [] };
          });
        }
      }
    })();
  }, [account, rewardPool, symbol, chainId, lastTx]); //eslint-disable-line

  return lockUps;
}

export default useLockUpHistory;
