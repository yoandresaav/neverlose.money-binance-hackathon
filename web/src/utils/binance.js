export const HTTP_PROVIDER = "https://data-seed-prebsc-1-s1.binance.org:8545";

export async function call(contract, ...args) {
  console.log("calling binance", contract);
  const data = contract.methods.totalMultiplier().encodeABI();
  // var result = web3.eth.call({
  //   to: "0x692a70d2e424a56d2c6c27aa97d1a86395877b3a",
  //   data: callData,
  // });
  //   var callData = contract.functionName.getData(functionParameters);
  //
  const params = [{
    to: contract._address,
    data,
  }];

  console.log(params);
  //
  console.log("calling eth_call");
  window.BinanceChain.request({
    method: "eth_call",
    params,
  })
    .then((result) => {
      console.log("result", result);
      // The result varies by by RPC method.
      // For example, this method will return a transaction hash hexadecimal string on success.
    })
    .catch((error) => {
      console.log("ERRRR", error);
      // If the request fails, the Promise will reject with an error.
    });
}
