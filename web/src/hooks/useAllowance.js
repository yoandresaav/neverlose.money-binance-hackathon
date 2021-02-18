import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useERC20Token } from "hooks/useContract";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import { TX_TYPE_APPROVE } from "constants/index";
import ADDRESSES from "constants/addresses";

function useAllowance(symbol) {
  const { account, chainId } = useWeb3React();
  const [allowance, setAllowance] = useState(0);
  const token = useERC20Token(symbol);
  const { type, timestamp } = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    (async () => {
      if (
        (token && chainId && allowedChainId(chainId)) ||
        type === TX_TYPE_APPROVE
      ) {
        setAllowance(0);
        const bn = await token.allowance(
          account,
          ADDRESSES[chainId]?.WRNRewardPool
        );
        setAllowance(bn.toString());
      }
    })();
  }, [token, symbol, account, chainId, type, timestamp]); //eslint-disable-line

  return allowance;
}

export default useAllowance;
