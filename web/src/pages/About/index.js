import React from "react";
import explanation from "assets/images/explanation.png";
import buffett from "assets/images/buffett-bg.svg";
import Graph from "./Graph";
import playPrimary from "assets/images/play-primary.svg";

function Home(props) {
  return (
    <div className="page-home padded-horizontal">
      <Graph />
      <div className="home-content">
        <h1 className="slogan white">
          Gamified <span className="primary">HODL Protocol</span> <br /> for
          Long-term investors
        </h1>

        <h3 className="top-20 grey">
          A lock-up smart contract that pays losers' penalty <br />
          to the hodlers.
        </h3>

        <a
          className="row align-center top-20"
          target="_blank"
          href="https://www.youtube.com/watch?v=L4YjWxJHZpw"
          rel="noopener noreferrer"
        >
          <h6 className="primary">Watch the film</h6>
          <img className="left-5" src={playPrimary} alt="" />
        </a>

        <div className="col align-center">
          <div className="withstanding-slogan">
            <h2 className="white">
              Withstanding ups and downs make long-term HODL almost impossible
            </h2>
            <h3 className="top-20 grey">
              1 BNB price 3 years ago was about $1. Do you think you could earn
              12,900% profit if you bought BNB at that time? Probably NOT.
            </h3>
          </div>
        </div>

        <h1 className="slogan second white">
          First-ever <br />
          Social <span className="primary">HODL Contract </span>
          <br />
          on Binance Smart Chain
        </h1>

        <div className="explained-container row justify-between">
          <div className="explained-text grey right-80">
            <h3>
              HODLERS lock-up their long-term assets with a set period. If you
              fail and withdraw your fund before the due, you should pay 10%
              penalty that goes other HODLERS.*
              <br />
              <br />
              Vice versa, you will get others penalty money whenever they break
              their contract. Plus, you earn WARREN governance tokens.
            </h3>
            <p className="grey top-30">
              * An additional 3% will be deducted for the{" "}
              <a
                href="https://hunt-docs.gitbook.io/neverlose-money-bsc/faq#can-i-withdraw-my-asset-within-the-lock-up-period-and-what-is-the-penalty-and-platform-fee"
                target="_blank"
                rel="noopener noreferrer"
                className="underlined-link"
              >
                HUNT burning system.
              </a>
            </p>
          </div>
          <div className="col grow">
            <img className="explained-img" src={explanation} alt="" />
          </div>
        </div>

        <div className="col align-center">
          <div className="buffett-container">
            <img className="buffett-img" src={buffett} alt="" />
            <h3 className="white top-40">
              If you aren’t willing to own a stock for ten years, don’t even
              think about owning it for ten minutes.
            </h3>
            <h6 className="grey top-10">- Warren Buffett</h6>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
