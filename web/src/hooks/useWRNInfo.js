import { useState, useEffect } from "react";
import ERC20TokenABI from "abi/ERC20Token.json";
import Web3 from "web3";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";
import { handleErrorMessage } from "utils/errors";
import { getEthersProvider } from "utils/Contract";

function useWRNInfo(props) {
  const chainId = 97;
  const [data, setData] = useState({});
  const WRNPrice = global.WRNPrice;
  const { lastUpdateTimestamp } = global.events;

  useEffect(() => {
    (async () => {
      try {
        const web3 = getEthersProvider(chainId);
        const token = new web3.eth.Contract(
          ERC20TokenABI,
          ADDRESSES[chainId].WRN
        );
        const _ts = await token.methods.totalSupply().call();
        const totalSupply = new BigNumber(_ts.toString())
          .dividedBy(1e18)
          .toNumber();

        setData((_data) => {
          return { ..._data, totalSupply };
        });
      } catch (e) {
        handleErrorMessage(e);
      }
    })();
  }, [lastUpdateTimestamp]);

  useEffect(() => {
    if (WRNPrice) {
      setData((_data) => {
        return { ..._data, WRNPrice };
      });
    }
  }, [WRNPrice]);

  return data;
}

export default useWRNInfo;
