import React, { useState, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import ADDRESSES from "constants/addresses";
import Web3 from "web3";
import { abi } from "abi/WRNRewardPool.json";
import { getSymbol, getEthersProvider } from "utils/Contract";
import DECIMALS from "constants/decimals";
import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import numeral from "numeral";
import ETHERSCAN from "constants/etherscan";
import { utils } from "ethers";
import { abi as WRNRewardPoolABI } from "abi/WRNRewardPool.json";
import { ALCHEMY_API_KEY } from "web3/connectors";
import { handleErrorMessage } from "utils/errors";

const EVENTS_PER_SCROLL = 30;
const GENESIS_BLOCK = 11469300;
const MAX_ATTEMPTS = 10;

function useEvents(symbol) {
  const lastFetchedInfo = useRef({
    numberOfEvents: 0,
    lastBlockFetched: null,
    attempts: 0,
  });

  const [fetching, setFetching] = useState(false);
  const [events, setEvents] = useState(null);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null);
  const { account } = useWeb3React();
  const chainId = 97;

  const ethersProvider = getEthersProvider(chainId);
  async function update() {
    try {
      if (fetching) return;
      else if (
        lastFetchedInfo.current.numberOfEvents >= EVENTS_PER_SCROLL ||
        lastFetchedInfo.current.attempts > MAX_ATTEMPTS ||
        (lastFetchedInfo.current.lastBlockFetched &&
          lastFetchedInfo.current.lastBlockFetched <= GENESIS_BLOCK)
      ) {
        //break condition
        lastFetchedInfo.current = {
          ...lastFetchedInfo.current,
          numberOfEvents: 0,
        };

        return;
      }

      lastFetchedInfo.current.attempts += 1;
      const currentBlock =
        lastFetchedInfo.current.lastBlockFetched ||
        (await ethersProvider.getBlockNumber());

      setFetching(true);

      //3 days worth of events per fetch
      const fromBlock = currentBlock - (3 * 86400) / 12;

      const filter = {
        address: ADDRESSES[chainId]?.WRNRewardPool,
        fromBlock,
        toBlock: currentBlock,
      };

      var iface = new utils.Interface(WRNRewardPoolABI);
      const logs = await ethersProvider.getLogs(filter);

      //format the object to match the object pattern retruned from web3
      let parsedEvents = logs
        .map((log, index) => {
          let { name: event, args } = iface.parseLog(log);
          let returnValues = {};

          Object.keys(args).forEach((key) => {
            // only take string keys into consideration
            if (Number.isNaN(+key)) {
              returnValues[key] = args[key].toString();
            }
          });

          return {
            transactionHash: log.transactionHash,
            event,
            returnValues,
          };
        })
        .filter(({ event }) =>
          ["LockedUp", "Exited", "BonusClaimed", "WRNClaimed"].includes(event)
        );

      const timestamp = new Date().getTime(); //random id for indexing
      parsedEvents = parsedEvents.reverse().map((log, index) => {
        return {
          ...log,
          animationIndex: `${timestamp}-${index}`,
        };
      });

      lastFetchedInfo.current = {
        ...lastFetchedInfo.current,
        numberOfEvents:
          lastFetchedInfo.current.numberOfEvents + parsedEvents.length,
        lastBlockFetched: fromBlock,
      };

      setEvents((prev) => (prev ? prev.concat(parsedEvents) : parsedEvents));
      setFetching(false);
      update(); //keep fetching until break condition is met
    } catch (e) {
      handleErrorMessage("Failed to fetch events. Please try again later.");
    }
  }

  useEffect(() => {
    const rewardPoolAddress = ADDRESSES[chainId]?.["WRNRewardPool"];
    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(
        `wss://eth-mainnet.ws.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
      )
    );
    const contract = new web3.eth.Contract(abi, rewardPoolAddress);

    async function listen() {
      try {
        const currentBlock = await ethersProvider.getBlockNumber();
        contract.events
          .allEvents({
            fromBlock: currentBlock,
          })
          .on("data", (data) => {
            const { event, returnValues } = data;
            const fabricatedData = {};

            Object.keys(returnValues).forEach((key) => {
              const val = returnValues[key];
              if (val.startsWith("0x")) fabricatedData[key] = val;
              else {
                //eslint-disable-next-line
                symbol = getSymbol(
                  chainId,
                  returnValues.token || returnValues.tokenAddress
                );

                fabricatedData[key] = new BigNumber(val)
                  .dividedBy(
                    event === "WRNClaimed"
                      ? Math.pow(10, DECIMALS["WRN"])
                      : Math.pow(10, DECIMALS[symbol])
                  )
                  .toString();
              }
            });

            if (
              ["LockedUp", "Exited", "BonusClaimed", "WRNClaimed"].includes(
                event
              )
            ) {
              setEvents((_events) => (_events ? [data, ..._events] : [data]));
              setLastUpdateTimestamp(new Date().getTime());
            }

            if (fabricatedData.account === account) return;

            let message = "";
            if (event === "LockedUp") {
              message = (
                <div>
                  A user (
                  {
                    <a
                      className="primary"
                      href={`${ETHERSCAN[chainId]}/address/${fabricatedData.account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fabricatedData.account?.substring(0, 5)}...
                    </a>
                  }
                  ) locked up{" "}
                  <span className="white">
                    {numeral(fabricatedData.amount).format("0,0.00[0000]")}{" "}
                    {symbol}
                  </span>{" "}
                  for{" "}
                  <span className="white">{returnValues.durationInMonths}</span>{" "}
                  months.
                </div>
              );
              toast.dark(message);
            } else if (event === "Exited") {
              if (+fabricatedData.penalty > 0) {
                message = (
                  <div>
                    A user (
                    {
                      <a
                        className="primary"
                        href={`${ETHERSCAN[chainId]}/address/${fabricatedData.account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fabricatedData.account?.substring(0, 5)}...
                      </a>
                    }
                    ) just broke{" "}
                    <span className="white">
                      {numeral(fabricatedData.amount).format("0,0.00[0000]")}{" "}
                      {symbol}
                    </span>{" "}
                    locked-up asset and{" "}
                    <span className="white">
                      {fabricatedData.penalty} {symbol}
                    </span>{" "}
                    bonus has been generated and distributed.
                  </div>
                );
              } else {
                message = (
                  <div>
                    A user (
                    {
                      <a
                        className="primary"
                        href={`${ETHERSCAN[chainId]}/address/${fabricatedData.account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fabricatedData.account?.substring(0, 5)}...
                      </a>
                    }
                    ) just unlocked{" "}
                    <span className="white">
                      {numeral(fabricatedData.amount).format("0,0.00[0000]")}{" "}
                      {symbol}
                    </span>{" "}
                    locked-up assets after{" "}
                    <span className="white">
                      {returnValues.durationInMonths} months
                    </span>{" "}
                    of successful lock-up period! 🎉
                  </div>
                );
              }
              toast.dark(message);
            } else if (event === "BonusClaimed") {
              message = (
                <div>
                  A user (
                  {
                    <a
                      className="primary"
                      href={`${ETHERSCAN[chainId]}/address/${fabricatedData.account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fabricatedData.account?.substring(0, 5)}...
                    </a>
                  }
                  ) just claimed a bonus of{" "}
                  <span className="white">
                    {numeral(fabricatedData.amount).format("0,0.00[0000]")}{" "}
                    {symbol}
                  </span>
                  ! 🤑
                </div>
              );
              toast.dark(message);
            } else if (event === "WRNClaimed") {
              message = (
                <div>
                  A user (
                  {
                    <a
                      className="primary"
                      href={`${ETHERSCAN[chainId]}/address/${fabricatedData.account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fabricatedData.account?.substring(0, 5)}...
                    </a>
                  }
                  ) just claimed{" "}
                  <span className="white">
                    {numeral(fabricatedData.amount).format("0,0.00[0000]")}{" "}
                  </span>
                  WRN! 🤑
                </div>
              );
            }
          })
          .on("error", console.error);
      } catch (e) {
        handleErrorMessage("Failed to attach events listener. Please try again later.");
      }
    }

    listen();
    update();
  }, []);

  return { update, events, fetching, lastUpdateTimestamp };
}

export default useEvents;
