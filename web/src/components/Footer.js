import React from "react";
import logo from "assets/images/logo.svg";
import githubGrey from "assets/images/github-grey.svg";
import discordGrey from "assets/images/discord-grey.svg";
import telegramGrey from "assets/images/telegram-grey.svg";
import emailGrey from "assets/images/email-grey.svg";

function Footer(props) {
  return (
    <footer className="row padded-horizontal">
      <div className="icon-container row align-start justify-between">
        <img className="footer-logo" src={logo} alt="" />
        <div className="link-icons row">
          <a
            href="https://github.com/Steemhunt/neverlose.money-binance-hackathon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={githubGrey} alt="" />
          </a>

          <a
            href="mailto:admin@hunt.town"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="left-20" src={emailGrey} alt="" />
          </a>
        </div>
      </div>

      <div className="warning left-40">
        <div className="grey">
          Neverlose.money is a web user interface using a smart contract
          protocol. You may encounter an unexpected issue.
          Please do your own research before you interact with the
          protocol and use it at your own risk. We are not liable for any financial loss.
        </div>
        <div className="link-icons top-20">
          <a
            className="top-15"
            href="https://hunt-docs.gitbook.io/neverlose-money-bsc/faq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>FAQ</button>
          </a>
          <a
            className="top-15"
            href="https://hunt-docs.gitbook.io/neverlose-money-bsc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="left-20">Docs</button>
          </a>
        </div>
        <div className="grey top-30">
          Made with ❤️ from LA 🇺🇸, Seoul 🇰🇷, and Sligo 🇮🇪
        </div>
      </div>

      <div className="links left-90 col">
        <a
          href="https://github.com/Steemhunt/neverlose.money-binance-hackathon"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          className="top-15"
          href="mailto:admin@hunt.town"
          target="_blank"
          rel="noopener noreferrer"
        >
          Email
        </a>
      </div>

      <div className="links col left-60">
        <a
          href="https://hunt-docs.gitbook.io/neverlose-money-bsc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
        <a
          className="top-15"
          href="https://hunt-docs.gitbook.io/neverlose-money-bsc/user-guide"
          target="_blank"
          rel="noopener noreferrer"
        >
          User Guide{" "}
        </a>
        <a
          className="top-15"
          href="https://hunt-docs.gitbook.io/neverlose-money-bsc/faq"
          target="_blank"
          rel="noopener noreferrer"
        >
          FAQ
        </a>
      </div>
    </footer>
  );
}

export default Footer;
