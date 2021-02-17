import { useState, useEffect } from "react";

function useDollarEstimate(symbol, amount) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (global.tokenPrices && amount && +amount > 0) {
      setResult(+amount * global.tokenPrices[symbol]);
    } else {
      setResult(0);
    }
  }, [amount, symbol]);

  return result;
}

export default useDollarEstimate;
