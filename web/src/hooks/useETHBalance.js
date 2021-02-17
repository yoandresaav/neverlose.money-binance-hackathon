import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import { txTimestampAtom } from "atoms";
import { useRecoilValue } from "recoil";
import {
  TX_TYPE_UNISWAP_APPROVE,
  TX_TYPE_UNISWAP_WRAP,
  TX_TYPE_UNISWAP_SWAP,
} from "constants/index";

function UseETHBalance(props) {
  const { account, library, chainId } = useWeb3React();
  const [balance, setBalance] = useState(null);
  const { type, timestamp } = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    const nonNullCondition = !!account && !!library;
    if (
      nonNullCondition ||
      (nonNullCondition &&
        (type === TX_TYPE_UNISWAP_APPROVE ||
          type === TX_TYPE_UNISWAP_WRAP ||
          type === TX_TYPE_UNISWAP_SWAP))
    ) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId, type, timestamp]); // ensures refresh if referential identity of library doesn't change across chainIds

  return balance ? formatEther(balance) : "-";
}

export default UseETHBalance;
