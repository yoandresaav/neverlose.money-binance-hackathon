import React, { useState, useEffect } from "react";

const Slider = (props) => {
  const {
    className,
    value = 50,
    onChange,
    min = 3,
    max = 120,
    step = 3,
    tooltipVisible = true,
  } = props;
  const [style, setStyle] = useState({});
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const percentage = ((+value - min) / (max - min)) * 100;
    setStyle({
      background:
        "linear-gradient(to right, #f0b90b 0%, #f0b90b " +
        percentage +
        "%, #f5f5f5 " +
        percentage +
        "%, #f5f5f5 100%)",
    });
  }, [value]); //eslint-disable-line

  const _onChange = (e) => {
    const _value = e.target.value;
    setPercentage(((_value - min) / (max - min)) * 100);
    onChange(_value);
  };

  const offset = (-16 * percentage) / 100;

  return (
    <div className={`slider-container ${className}`}>
      {tooltipVisible && (
        <div
          className="tooltip-container col"
          style={{
            left: `calc(${percentage}% - 2px)`,
            transform: `translateX(${offset}px)`,
          }}
        >
          <span className="tooltip row centered">{value} months</span>
          <div className="tooltip-pointer" />
        </div>
      )}
      <input
        type="range"
        className="slider"
        style={style}
        value={value}
        onChange={_onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default Slider;
