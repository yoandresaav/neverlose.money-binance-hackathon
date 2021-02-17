import React, { useState, useEffect, useMemo } from "react";
import Modal from "components/Modal";
import { useRecoilState } from "recoil";
import { bonusCalculatorModal } from "atoms";
import Dropdown from "components/Dropdown";
import Slider from "components/Slider";
import Loading from "components/Loading";
import numeral from "numeral";

function bonusAfterMonths(pool, effectivePool, myLockUp, duration, brokenRate) {
  const MONTHLY_GROWTH_RATE = 0.147; // Assume that TLV will constantly grow by 10% every month
  const multiplier = duration / 3;
  const myEffectiveLockUp = myLockUp * multiplier;

  pool += +myLockUp;
  effectivePool += +myEffectiveLockUp;

  let bonusGenerated = 0;
  for (let i = 0; i < duration; i++) {
    const brokenAmount = (pool - myLockUp) * brokenRate;
    const effectiveBrokenAmount =
      (effectivePool - myEffectiveLockUp) * brokenRate;

    pool = pool - brokenAmount + pool * MONTHLY_GROWTH_RATE;
    // Assume breakers have an average lock-up duration everytime
    effectivePool = effectivePool - effectiveBrokenAmount + effectivePool * MONTHLY_GROWTH_RATE;

    bonusGenerated += brokenAmount * 0.1 * (myEffectiveLockUp / effectivePool);
  }

  return bonusGenerated;
}

function BonusCalculatorModal() {
  const [symbol, setSymbol] = useState("WBTC");
  const [months, setMonths] = useState(120);
  const [amount, setAmount] = useState(1);
  const [brokenRate, setBrokenRate] = useState(6.88);
  const [visible, setVisible] = useRecoilState(bonusCalculatorModal);
  const [
    ,
    activeLockUps,
    ,
    ,
    ,
    ,
    ,
    ,
    effectiveTotal,
    lockUpCounts,
    brokenCounts,
  ] = global.explorerOverview;

  let idx = 0;
  if (symbol === "WBTC") idx = 1;
  else if (symbol === "HUNT") idx = 2;

  let bonus,
    roi,
    apr,
    loading = true;

  if (effectiveTotal && global.tokenPrices && visible) {
    const lockedUp = activeLockUps[idx] / global.tokenPrices[symbol];
    const effectiveTotalLockUp = effectiveTotal[idx];
    const rate = brokenRate / 100;

    bonus = bonusAfterMonths(
      lockedUp,
      effectiveTotalLockUp,
      amount,
      months,
      rate
    );

    roi = bonus / amount;
    apr = roi / (months / 12);

    loading = false;
  }

  const onClose = () => setVisible(false);
  const monthsOptions = useMemo(
    () => new Array(40).fill(undefined).map((_, index) => (index + 1) * 3),
    []
  );

  useEffect(() => {
    if (lockUpCounts?.[idx] && brokenCounts?.[idx])
      setBrokenRate((brokenCounts[idx] / lockUpCounts[idx]) * 100);
  }, [lockUpCounts, brokenCounts, idx]);

  if (!visible) return null;

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="col grow calculator-modal">
        <h3>Bonus calculator</h3>
        <p className="top-20 lighter-grey">
          Neverlose.money is a HODL game protocol. While you continue your
          lock-up, you will get bonuses whenever other users fail to HODL
          according to their own lock-up terms.
        </p>
        <p className="top-40 lighter-grey">Choose your asset</p>
        <Dropdown
          className="top-10"
          options={["WBTC", "WETH", "HUNT"]}
          onChange={(e) => setSymbol(e.target.value)}
          value={symbol}
        />
        <div className="row justify-between wrap">
          <div>
            <p className="top-20 lighter-grey">Amount</p>
            <div className="amount-input top-10 row justify-between">
              <input
                type="number"
                className="grow"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="lighter-grey">{symbol.replace("W", "")}</p>
            </div>
          </div>
          <div>
            <p className="top-20 lighter-grey">HODL target period</p>
            <Dropdown
              className="top-10"
              options={monthsOptions}
              formatter={(value) => {
                const mo = value % 12;
                const years = parseInt(value / 12);
                return `
                  ${years > 0 ? `${years} year${years > 1 ? "s" : ""}` : ""}
                  ${years > 0 && mo > 0 ? " and " : ""}
                  ${mo > 0 ? `${mo} months` : ""}`;
              }}
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
          </div>
        </div>

        <p className="top-40 lighter-grey">
          Monthly break/fail rate:{" "}
          <span className="black bold">
            {numeral(brokenRate / 100).format("0,0.00%")}
          </span>
        </p>
        <Slider
          className="top-5"
          tooltipVisible={false}
          min={0}
          max={99.99}
          step={0.01}
          value={brokenRate}
          onChange={(e) => setBrokenRate(e)}
        />

        <h6 className="top-40">Expected HODL incomes</h6>

        <div className="bonus-summary top-20 col centered text-center">
          <p className="lighter-grey">Expected Bonus</p>
          {loading ? (
            <Loading className="top-10" />
          ) : (
            <>
              <h3 className="top-5 black bold">
                {numeral(bonus).format("0,0.00[000000]")} {symbol}
              </h3>
              <p className="top-15 lighter-grey">
                ROI:{" "}
                <span className="bold green">
                  {roi < 1e-6
                    ? `${roi.toPrecision(2)}%`
                    : numeral(roi).format("0,0.00%")}
                </span>{" "}
                | APR:{" "}
                <span className="bold green">
                  {apr < 1e-6
                    ? `${apr.toPrecision(2)}%`
                    : numeral(apr).format("0,0.00%")}
                </span>
              </p>
            </>
          )}
        </div>

        <hr />

        <p className="lighter-grey font-12">
          The bonus amount is calculated based on the current total active
          lock-ups and the average monthly broken rate. This is merely a projection. The actual income may vary.
          <br/><br/>
          <i>Assumptions:</i><br/>
          <i>1. TVL monthly growth rate is 14.7%</i><br/>
          <i>2. Same average lock-up duration is used for all broken events</i><br/>
        </p>
      </div>
    </Modal>
  );
}

export default BonusCalculatorModal;
