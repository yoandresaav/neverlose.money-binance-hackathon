import React, { useRef, useEffect, useMemo, useState } from "react";
import { withRouter } from "react-router-dom";
import { useRecoilState } from "recoil";
import { connectWallet, bonusCalculatorModal } from "atoms";
import { useWeb3React } from "@web3-react/core";
import btcColored from "assets/images/btc-colored.svg";
import ethColored from "assets/images/eth-colored.svg";
import bnbColored from "assets/images/bnb-colored.svg";

const REFRESH_RATE = 5 * 1000;

const config = {
  particleNumber: 1000,
  maxParticleSize: 10,
  maxSpeed: 20,
  colorVariation: 100,
};

const COINS = [
  {
    symbol: "BTC",
    color: "#f7931a",
    image: btcColored,
  },
  {
    symbol: "ETH",
    color: "#0091ff",
    image: ethColored,
  },
  {
    symbol: "BNB",
    color: "#f0b90b",
    image: bnbColored,
  },
];

function MainBanner(props) {
  const imgRef = useRef(null);
  const focused = useRef(true);

  const { account } = useWeb3React();
  const [coin, setCoin] = useState(COINS[0]);
  const [, setVisible] = useRecoilState(connectWallet);
  const [, setCalculatorVisible] = useRecoilState(bonusCalculatorModal);

  useEffect(() => {
    let startIndex = 0;
    const interval = setInterval(() => {
      startIndex++;
      if (focused.current === true) setCoin(COINS[startIndex % 3]);
    }, REFRESH_RATE);

    function setFocused(bool) {
      focused.current = bool;
    }

    window.addEventListener("focus", () => setFocused(true));
    window.addEventListener("blur", () => setFocused(false));

    return () => {
      interval && clearInterval(interval);
      window.removeEventListener("focus", setFocused);
      window.removeEventListener("blur", setFocused);
    };
  }, []);

  useEffect(() => {
    if (imgRef.current) {
      const { x, y, width, height } = imgRef.current.getBoundingClientRect();
      const midX = x + width - width / 2;
      const midY = y + height - height / 2 + window.scrollY;
      window.cleanUpArray();
      window.initParticles(200, midX, midY, coin.color);
    }
  }, [coin]);

  const canvasComponent = useMemo(() => <Canvas />, []);
  return (
    <div className="main-banner relative">
      {canvasComponent}

      <div className="banner-content col align-center">
        <img ref={imgRef} className="main-banner-coin" src={coin.image} alt="" />
        <h2 className="white top-30 text-center">
          HODL <span style={{ color: coin.color }}>{coin.symbol}</span>
          <br />
          Earn Bonus from Losers
        </h2>
        <h4 className="top-15 grey text-center">
          First-ever social HODL contract on Binance Smart Chain
        </h4>
        <div className="row top-40">
          <button
            className="right-10"
            onClick={() => {
              if (!account) setVisible(true);
              else props.history.push("/dashboard");
            }}
          >
            Get started
          </button>
          <button
            className="left-10 black-bg white"
            onClick={() => setCalculatorVisible(true)}
          >
            Calculate bonus
          </button>
        </div>
      </div>
    </div>
  );
}

function Canvas() {
  useEffect(() => {
    var canvas = document.getElementById("particle-canvas"),
      ctx = canvas.getContext("2d");

    const particleContainer = document.getElementById("particle-container");

    canvas.width = particleContainer.offsetWidth;
    canvas.height = particleContainer.offsetHeight;

    var colorPalette = {
      bg: { r: 0, g: 0, b: 0 },
      matter: [{ r: 0, g: 145, b: 255 }],
    };

    // Some Variables hanging out
    var particles = [],
      drawBg = function(ctx, color) {
        ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

    var Particle = function(x, y, color) {
      this.x = x || Math.round(Math.random() * canvas.width);
      this.y = y || Math.round(Math.random() * canvas.height);
      this.r = Math.ceil(Math.random() * config.maxParticleSize);
      this.c =
        color ||
        colorVariation(
          colorPalette.matter[
            Math.floor(Math.random() * colorPalette.matter.length)
          ],
          true
        );
      this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), 0.7);
      this.d = Math.round(Math.random() * 360);
    };

    var colorVariation = function(color, returnString) {
      var r, g, b, a;
      r = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.r
      );
      g = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.g
      );
      b = Math.round(
        Math.random() * config.colorVariation -
          config.colorVariation / 2 +
          color.b
      );
      a = Math.random() + 0.1;
      if (returnString) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      } else {
        return { r, g, b, a };
      }
    };

    var updateParticleModel = function(p) {
      var a = 180 - (p.d + 90);
      p.d > 0 && p.d < 180
        ? (p.x += (p.s * Math.sin(p.d)) / Math.sin(p.s))
        : (p.x -= (p.s * Math.sin(p.d)) / Math.sin(p.s));
      p.d > 90 && p.d < 270
        ? (p.y += (p.s * Math.sin(a)) / Math.sin(p.s))
        : (p.y -= (p.s * Math.sin(a)) / Math.sin(p.s));
      return p;
    };

    var drawParticle = function(x, y, r, c) {
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();
    };

    window.cleanUpArray = function() {
      particles = particles.filter((p) => {
        return p.x > -100 && p.y > -100;
      });
    };

    window.initParticles = function(numParticles, x, y, color) {
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(x, y, color));
      }

      particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
      });
    };

    window.addEventListener("resize", (e) => {
      canvas.width = particleContainer.offsetWidth;
      canvas.height = particleContainer.offsetHeight;
    });

    window.requestAnimFrame = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    var frame = function() {
      drawBg(ctx, colorPalette.bg);
      particles.map((p) => {
        return updateParticleModel(p);
      });
      particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
      });
      window.requestAnimFrame(frame);
    };

    // First Frame
    frame();
  });

  return (
    <div id="particle-container" className="banner-bg">
      <canvas id="particle-canvas" />
    </div>
  );
}

export default withRouter(MainBanner);
