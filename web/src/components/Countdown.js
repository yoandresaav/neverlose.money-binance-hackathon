import React from "react";
import useCountdown from "hooks/useCountdown";

function Countdown(props) {
  const countdown = useCountdown(new Date(props.timestamp * 1000));
  return <span>{countdown}</span>;
}

export default Countdown;
