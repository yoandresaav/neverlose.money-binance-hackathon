import { useState, useEffect, useRef } from "react";

function useTokenPrices() {
  const callingAPI = useRef(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let interval;
    async function update() {
      try {
        if (callingAPI.current === true) return;
        callingAPI.current = true;

        const apiURL = `https://nomadtask.com/market_prices.json?timestamp=${new Date().getTime() /
          1000}`;

        const resp = await fetch(apiURL);

        const {
          prices: { BTC: wbtc, ETH: weth, BNB: bnb },
        } = await resp.json();

        const _prices = {
          ETH: weth,
          BTCB: wbtc,
          WBNB: bnb,
        };
        setData(_prices);
        callingAPI.current = false;
      } catch (e) {
        console.error("retrieving token prices from api.", e);
      }
    }

    (async () => {
      update();
      interval = setInterval(update, 1000 * 10);
    })();

    return () => interval && clearInterval(interval);
  }, []);

  return data;
}

export default useTokenPrices;
