import React, { useMemo } from "react";
import lockWhite from "assets/images/lock-white.svg";
import numeral from "numeral";
import AnimatedNumber from "components/AnimatedNumber";
import { useWeb3React } from "@web3-react/core";
import { TX_TYPE_LOCKUP } from "constants/index";
import { useRecoilState, useRecoilValue } from "recoil";
import { handleNaN } from "utils/numbers";
import { handleErrorMessage } from "utils/errors";
import {
  lockUpModal,
  approveModal,
  connectWallet,
  pendingTx,
  openTx,
} from "atoms";
import { allowedChainId } from "utils/chainId";
import ClipLoader from "react-spinners/ClipLoader";
import DollarValue from "components/DollarValue";
import ToggleDollar from "components/ToggleDollar";
import useLockUpHistory from "hooks/useLockUpHistory";

function LockUpInformation({ symbol }) {
  const { chainId, account } = useWeb3React();
  const [, setConnectWalletVisible] = useRecoilState(connectWallet);
  const [, setApproveModalVisible] = useRecoilState(approveModal);
  const [, setLockUpModalVisible] = useRecoilState(lockUpModal);
  const pendingTransactions = useRecoilValue(pendingTx);
  const openTransactions = useRecoilValue(openTx);
  const lockups = useLockUpHistory(symbol);

  const {
    total,
    accTotal,
    bonusClaimed,
    claimedWRN,
    allowance,
    percentageLocked,
  } = global.dashboard[symbol];

  const netMarketGain = useMemo(() => {
    if (lockups?.[symbol] && global.tokenPrices?.[symbol]) {
      let profit = 0;
      lockups[symbol].forEach(async ({ amount, startPrice, exitedAt }) => {
        let currentPrice = global.tokenPrices?.[symbol] * +amount;
        if (exitedAt > 0) {
          try {
            const exitApiURL = `https://nomadtask.com/market_prices.json?timestamp=${exitedAt}`;
            const exitPrice = await fetch(exitApiURL);
            const exitPrices = await exitPrice.json();
            currentPrice = exitPrices.prices[symbol.replace("W", "")];
          } catch (e) {
            handleErrorMessage(e);
          }
        }
        const initialPrice = +amount * startPrice;
        profit += currentPrice - initialPrice;
      });
      return profit;
    }
    return 0;
  }, [lockups, symbol, global.tokenPrices]); // eslint-disable-line

  return (
    <div className="lockup-col grow col justify-between right-40">
      <div>
        <ToggleDollar />
        <h6 className="light-grey top-5">Active Locked-up</h6>
        <DollarValue
          className="font-32 bold"
          value={total}
          format={"0,0.[000000000000000000]"}
          symbol={symbol}
          suffix={<span className="font-18 bold"> {symbol}</span>}
        />
        <hr />

        <div className="light-grey font-16">
          Cumulative:{" "}
          <DollarValue
            value={accTotal}
            format="0,0.[000000000000000000]"
            symbol={symbol}
            suffix={" " + symbol}
          />
          <br />
          Bonus from losers:{" "}
          <span className="black">
            <DollarValue
              value={bonusClaimed}
              format="0,0.[000000000000000000]"
              symbol={symbol}
              suffix={" " + symbol}
            />
          </span>
          <br />
          Accrued WRN:{" "}
          <span className="black">
            <DollarValue
              value={claimedWRN}
              format="0,0.[000000000000000000]"
              symbol="WRN"
              suffix=" WRN"
            />
          </span>
          <br />
          Effective share ratio:{" "}
          <AnimatedNumber
            value={percentageLocked}
            format="0,0.00%"
            tooltip={handleNaN(
              percentageLocked,
              numeral(percentageLocked).format("0,0.00%"),
              true
            )}
          />{" "}
          <br />
          Net Market Gain:{" "}
          <span className="green">
            <AnimatedNumber value={netMarketGain} format="$0,0.00" />
          </span>
        </div>
      </div>

      {account ? (
        <button
          disabled={
            !allowance ||
            !allowedChainId(chainId) ||
            pendingTransactions.some(
              (tx) => tx.type === TX_TYPE_LOCKUP && tx.symbol === symbol
            ) ||
            openTransactions.some(
              (tx) => tx.type === TX_TYPE_LOCKUP && tx.symbol === symbol
            )
          }
          className="max-width big row align-center justify-center"
          onClick={() => {
            if (+allowance === 0) {
              setApproveModalVisible(true);
            } else {
              setLockUpModalVisible(true);
            }
          }}
        >
          {!allowance ? (
            <ClipLoader size={14} color="#fff" />
          ) : (
            <>
              <img className="right-5" src={lockWhite} alt="" /> Lock-up your{" "}
              {symbol}
            </>
          )}
        </button>
      ) : (
        <button
          disabled={!allowedChainId(chainId)}
          className="max-width big row align-center justify-center"
          onClick={() => setConnectWalletVisible(true)}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default LockUpInformation;
