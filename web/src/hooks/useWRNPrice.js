import { useState, useEffect, useRef } from "react";
import ADDRESSES from "constants/addresses";
import BigNumber from "bignumber.js";
import DECIMALS from "constants/decimals";
import {
  Token,
  Percent,
  JSBI,
  WETH,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
} from "@uniswap/sdk";
import { getEthersProvider } from "utils/Contract";
import { BIPS_BASE } from "hooks/useSwap";
import { handleErrorMessage } from "utils/errors";

function useWRNPrice(props) {
  const chainId = 97;
  const out = useRef(null);
  const { WETH: ETH } = global.tokenPrices || {};
  // const [price, setPrice] = useState(null);
  const [price, setPrice] = useState(1);

  useEffect(() => {
    async function update() {
      try {
        if (!out.current) {
          const ethersProvider = getEthersProvider(chainId);
          const WRN = new Token(
            chainId,
            ADDRESSES[chainId]?.["WRN"],
            DECIMALS["WRN"],
            "WRN"
          );

          const inputToken = WRN;
          const outputToken = WETH[WRN.chainId];
          const pair = await Fetcher.fetchPairData(
            outputToken,
            inputToken,
            ethersProvider
          );
          const route = new Route([pair], inputToken);
          const amountIn = new BigNumber(1)
            .times(Math.pow(10, 18))
            .toString(10);
          const trade = new Trade(
            route,
            new TokenAmount(inputToken, amountIn),
            TradeType.EXACT_INPUT
          );

          const amountOut = new BigNumber(
            parseInt(
              trade
                .minimumAmountOut(new Percent(JSBI.BigInt(0), BIPS_BASE))
                .raw.toString(10)
            )
          )
            .dividedBy(Math.pow(10, 18))
            .toNumber();

          out.current = amountOut;
        }

        const WRNPrice = out.current * ETH;
        setPrice(WRNPrice);
      } catch (e) {
        handleErrorMessage(e);
      }
    }

    if (ETH) {
      // update();
    }
  }, [ETH]);

  return price;
}

export default useWRNPrice;
