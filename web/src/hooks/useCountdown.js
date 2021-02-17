import { useState, useEffect } from "react";

export default function useCountdown(date) {
  const [time, setTime] = useState(null);
  const [cleared, setCleared] = useState(false);

  // Update the count down every 1 second
  useEffect(() => {
    let x;
    if (date && !cleared) {
      let countDownDate;

      if (date instanceof Date) {
        countDownDate = date.getTime();
      }

      function tick() {
        // Get today's date and time
        const now = new Date().getTime();

        // Find the distance between now and the count down date
        // could be date object or milliseconds;
        const distance = date instanceof Date ? countDownDate - now : date;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const outputString =
          days + "d " + hours + "h " + minutes + "m " + seconds + "s";

        setTime(outputString);

        if (distance < 0) {
          //set time to null if already passed
          setTime(null);
          setCleared(true);
          clearInterval(x);
        }
      }
      x = setInterval(tick, 1000);
      tick();
    }
    return () => x && clearInterval(x);
  }, [date, cleared]);

  return time;
}
