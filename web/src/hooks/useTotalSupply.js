import { useState, useEffect } from "react";
import { useERC20Token } from "hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import { useRecoilValue } from "recoil";
import { txTimestampAtom } from "atoms";
import { allowedChainId } from "utils/chainId";
import BigNumber from "bignumber.js";

function useTotalSupply(symbol) {
  const { account, chainId } = useWeb3React();
  const [totalSupply, setTotalSupply] = useState(0);
  const token = useERC20Token(symbol);
  const txTimestamp = useRecoilValue(txTimestampAtom);

  useEffect(() => {
    (async () => {
      if (token && allowedChainId(chainId)) {
        const bn = await token.totalSupply();
        setTotalSupply(bn.toString());
      }
    })();
  }, [token, symbol, account, txTimestamp]); //eslint-disable-line

  return new BigNumber(totalSupply).dividedBy(1e18).toString();
}

export default useTotalSupply;
