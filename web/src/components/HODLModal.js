import React, { useEffect, useState, useMemo } from "react";
import Modal from "components/Modal";
import ProgressBar from "components/ProgressBar";
import btcColored from "assets/images/btc-colored.svg";
import ethColored from "assets/images/eth-colored.svg";
import bnbLogo from "assets/images/bnb-logo.svg";
import { Line } from "react-chartjs-2";
import { handleErrorMessage } from "utils/errors";
import { useRecoilState } from "recoil";
import { hodlModal } from "atoms";
import { toShortFormat } from "utils/date";
import wrnBlue from "assets/images/warren-blue-black.svg";
import numeral from "numeral";
import Chart from "chart.js";
import * as ChartAnnotation from "chartjs-plugin-annotation";

Chart.plugins.register([ChartAnnotation]); // Global

const startDate = new Date("2020-12-15");

function HODLModal() {
  const [modalData, setModalData] = useRecoilState(hodlModal);
  const [graphData, setGraphData] = useState({});
  const [hideBalance, setHideBalance] = useState(false);

  let {
    amount,
    durationInMonths,
    symbol,
    unlockedAt,
    startedAt,
    exitedAt,
    startPrice = 0,
    currentPrice = 0,
    mine = false,
    txLink,
  } = modalData || {};

  const [_startPrice, setStartPrice] = useState(startPrice);
  const [_exitPrice, setExitPrice] = useState(null);

  const years = useMemo(() => {
    const mo = +durationInMonths % 12;
    const years = parseInt(+durationInMonths / 12);
    return `
                  ${years > 0 ? `${years} year${years > 1 ? "s" : ""}` : ""}
                  ${years > 0 && mo > 0 ? " and " : ""}
                  ${mo > 0 ? `${mo} months` : ""}`;
  }, [durationInMonths]);

  let src = btcColored;
  let color = "rgba(247, 147, 26, 1.00)";
  let coinToFetch = "bitcoin";
  let modalMessage = null;
  let daysPassed,
    percentComplete,
    roi,
    diff = 0;

  const isExit = exitedAt !== "0" && exitedAt < unlockedAt;
  const isUnlock = exitedAt !== "0" && exitedAt >= unlockedAt;

  if (modalData) {
    const startTime = startedAt.getTime();
    let daysDiff = new Date().getTime() - startTime;

    currentPrice = currentPrice || global.tokenPrices[symbol];

    let startAmount = _startPrice * amount;
    let exitAmount = currentPrice * amount;

    if ((isExit || isUnlock) && _exitPrice) {
      daysDiff = +exitedAt * 1000 - startTime;
      exitAmount = _exitPrice * amount;
    }

    roi = _startPrice ? exitAmount - startAmount : 0;
    diff = _startPrice ? ((exitAmount - startAmount) / startAmount) * 100 : 0;

    daysPassed = Math.floor(daysDiff / 1000 / 86400);
    percentComplete = daysDiff / (durationInMonths * 30 * 86400 * 1000);

    if (symbol === "ETH") {
      src = ethColored;
      color = "#0091ff";
      coinToFetch = "ethereum";
    } else if (symbol === "WBNB") {
      src = bnbLogo;
      color = "#f0b90b";
      coinToFetch = "binancecoin";
    }

    modalMessage = (
      <h3 className="white">
        {mine ? "I am" : ""} HODLING
        <br />
        <span className="bold" style={{ color }}>
          {hideBalance ? "******" : numeral(amount).format("0,0.00[000000]")}
        </span>{" "}
        {symbol} (
        {hideBalance
          ? "$******"
          : numeral(currentPrice * amount).format("$0,0.00")}
        )
        <br />
        for{" "}
        <span className="bold" style={{ color }}>
          {years}
        </span>
        <br />
        starting {toShortFormat(startedAt)}.
      </h3>
    );

    if (isExit) {
      modalMessage = (
        <h3 className="white">
          I failed to HODL
          <br />
          <span className="bold" style={{ color }}>
            {hideBalance ? "******" : numeral(amount).format("0,0.00[000000]")}
          </span>{" "}
          {symbol} (
          {hideBalance
            ? "$******"
            : numeral(_exitPrice * amount).format("$0,0.00")}
          )
          <br />
          for{" "}
          <span className="bold" style={{ color }}>
            {years}
          </span>
          <br />
          and broke on {toShortFormat(new Date(exitedAt * 1000))}.
        </h3>
      );
    } else if (isUnlock) {
      modalMessage = (
        <h3 className="white">
          I successfully HODLED
          <br />
          <span className="bold" style={{ color }}>
            {hideBalance ? "******" : numeral(amount).format("0,0.00[000000]")}
          </span>{" "}
          {symbol} (
          {hideBalance
            ? "$******"
            : numeral(_exitPrice * amount).format("$0,0.00")}
          )
          <br />
          for{" "}
          <span className="bold" style={{ color }}>
            {years}
          </span>
          <br />
          since {toShortFormat(startedAt)}!
        </h3>
      );
    }
  }

  useEffect(() => {
    if (modalData) {
      (async () => {
        try {
          const timeDiff = new Date().getTime() - startDate.getTime();
          const days = Math.floor(timeDiff / 1000 / 86400);
          const endpoint = `https://api.coingecko.com/api/v3/coins/${coinToFetch}/market_chart?vs_currency=usd&days=${days}`;
          const result = await fetch(endpoint);
          const json = await result.json();

          const data = [];
          const labels = [];
          json.prices.forEach((pair, index) => {
            labels.push(index);
            data.push(pair[1]);
          });

          if (!_startPrice) {
            const apiURL = `https://nomadtask.com/market_prices.json?timestamp=${startedAt.getTime() /
              1000}`;
            const prices = await fetch(apiURL);
            const pricesJSON = await prices.json();
            setStartPrice(pricesJSON.prices[symbol.replace("W", "")]);
          }

          if (isExit || isUnlock) {
            const exitApiURL = `https://nomadtask.com/market_prices.json?timestamp=${exitedAt}`;
            const exitPrice = await fetch(exitApiURL);
            const exitPrices = await exitPrice.json();
            setExitPrice(exitPrices.prices[symbol.replace("W", "")]);
          }

          setGraphData({
            labels,
            datasets: [
              {
                data,
                borderColor: color,
                backgroundColor: "transparent",
                borderWidth: 2,
                showLine: true,
                lineTension: 0.1,
                borderDash: [],
                pointRadius: 0,
                pointHitRadius: 0,
              },
            ],
          });
        } catch (e) {
          handleErrorMessage(e);
        }
      })();
    } else {
      setGraphData({});
      setStartPrice(0);
      setExitPrice(null);
    }
  }, [modalData]); //eslint-disable-line

  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          display: false,
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          display: false,
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
    },
    annotation: {
      annotations: [
        {
          type: "line",
          mode: "horizontal",
          scaleID: "y-axis-0",
          borderDash: [4, 4],
          value: _startPrice,
          borderColor: "rgba(255, 255, 255, 0.35)",
          borderWidth: 1,
          label: {
            color: "#fff",
            enabled: true,
            content: `Initial price: ${numeral(_startPrice).format("$0,0.00")}`,
            position: "left",
            fontSize: 12,
            fontStyle: 400,
            fontFamily: "Roboto Slab, sans-serif",
            yAdjust: -10,
            xAdjust: -5,
            backgroundColor: "transparent",
          },
        },
        {
          type: "line",
          mode: "horizontal",
          scaleID: "y-axis-0",
          borderDash: [4, 4],
          value: currentPrice,
          borderColor: "rgba(255, 255, 255, 0.35)",
          borderWidth: 1,
          label: {
            color: "#fff",
            enabled: true,
            content: `Current price: ${numeral(currentPrice).format(
              "$0,0.00"
            )}`,
            position: "right",
            fontSize: 12,
            fontStyle: 400,
            fontFamily: "Roboto Slab, sans-serif",
            yAdjust: -10,
            xAdjust: -5,
            backgroundColor: "transparent",
          },
        },
      ],
    },
  };

  if (isExit || isUnlock) {
    options.annotation.annotations = [
      ...options.annotation.annotations,
      {
        type: "line",
        mode: "horizontal",
        scaleID: "y-axis-0",
        borderDash: [4, 4],
        value: _exitPrice,
        borderColor: isExit ? "#e02020" : "#a8acb0",
        borderWidth: 1,
        label: {
          color: isExit ? "#e02020" : "#a8acb0",
          enabled: true,
          content: `Exit price: ${numeral(_exitPrice).format("$0,0.00")}`,
          position: "center",
          fontSize: 12,
          fontStyle: 400,
          fontFamily: "Roboto Slab, sans-serif",
          yAdjust: -10,
          xAdjust: -5,
          backgroundColor: "transparent",
        },
      },
    ];
  }

  return (
    <Modal
      visible={modalData !== null}
      onClose={() => setModalData(null)}
      contentStyle={{ backgroundColor: "#030304" }}
    >
      {modalData && (
        <div className="col grow hodl-modal align-start">
          <img className="coin-img" src={src} alt="" />
          <div className="top-50">{modalMessage}</div>

          <h6
            className={`top-50 ${
              roi === 0 ? "grey" : roi > 0 ? "green" : "red"
            }`}
          >
            {roi === 0 ? "" : roi > 0 ? "+" : "-"}$
            {hideBalance
              ? "******"
              : numeral(roi)
                  .format("0,0.00")
                  .replace("-", "")}{" "}
            ({diff.toFixed(2)}%)
          </h6>

          <div className="top-5 max-width">
            <Line className="max-width" data={graphData} options={options} />
          </div>
          <div className="top-20 max-width">
            <h6 className="white">
              HODLED for {daysPassed} {daysPassed === 1 ? "day" : "days"}
            </h6>
            <ProgressBar
              className="top-10 max-width"
              height={16}
              filledColor={color}
              progress={percentComplete * 100}
            />
            <div className="row justify-between align-center top-5">
              <div className="font-11" style={{ color }}>
                {numeral(percentComplete).format("0,0.00%")} complete
              </div>
              <div className="font-11 white">
                Unlocked at {toShortFormat(new Date(unlockedAt * 1000))}
              </div>
            </div>
          </div>

          <div className="top-50 row align-center justify-between max-width">
            <div className="row">
              <div
                className="hide-balance font-11 white link"
                onClick={() => setHideBalance(!hideBalance)}
              >
                {hideBalance ? "Show" : "Hide"} balance
              </div>
              {txLink && (
                <a
                  className="hide-balance font-11 white link left-10"
                  href={txLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Show TX
                </a>
              )}
            </div>
            <div className="row align-center">
              <img className="right-5 nvlm-logo" src={wrnBlue} alt="" />
              <small className="bold primary">NEVERLOSE.MONEY</small>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default HODLModal;
