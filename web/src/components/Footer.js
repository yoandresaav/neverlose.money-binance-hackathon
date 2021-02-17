import React from "react";
import logo from "assets/images/logo.svg";
import githubGrey from "assets/images/github-grey.svg";
import discordGrey from "assets/images/discord-grey.svg";
import telegramGrey from "assets/images/telegram-grey.svg";
import emailGrey from "assets/images/email-grey.svg";
import alchemyBadge from "assets/images/alchemy-badge.svg";

function Footer(props) {
  return (
    <footer className="row padded-horizontal">
      <div className="icon-container row align-start justify-between">
        <img className="footer-logo" src={logo} alt="" />
        <div className="link-icons row">
          <a
            href="https://github.com/Steemhunt/neverlose.money-contract"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={githubGrey} alt="" />
          </a>

          <a
            href="https://discord.gg/ywBqD74"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="left-20" src={discordGrey} alt="" />
          </a>

          <a
            href="https://t.me/steemhunt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="left-20" src={telegramGrey} alt="" />
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
          protocol. Even though the smart contract is{" "}
          <a
            className="underline"
            href="https://github.com/Steemhunt/neverlose.money-contract/tree/main/audits"
            target="_blank"
            rel="noopener noreferrer"
          >
            audited
          </a>{" "}
          and thoroughly unit tested, you may still encounter an unexpected
          issue. Please do your own research before you interact with the
          protocol and use it at your own{" "}
          <a
            href="https://docs.neverlose.money/getting-started/faq#is-neverlose-money-safe-has-it-been-audited"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            risk
          </a>
          . We are not liable for any financial loss.
        </div>
        <div className="link-icons top-20">
          <a
            className="top-15"
            href="https://docs.neverlose.money/getting-started/faq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>FAQ</button>
          </a>
          <a
            className="top-15"
            href="https://docs.neverlose.money/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="left-20">Docs</button>
          </a>
          <a
            className="top-15"
            href="https://docs.neverlose.money/others/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="left-20">Terms</button>
          </a>
        </div>
        <div className="grey top-30">
          © 2020 Bourbonshake Inc. All Rights Reserved.
        </div>
      </div>

      <div className="links left-90 col">
        <a
          href="https://github.com/Steemhunt/neverlose.money-contract"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          className="top-15"
          href="https://discord.gg/ywBqD74"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </a>
        <a
          className="top-15"
          href="https://t.me/steemhunt"
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram
        </a>
        <a
          className="top-15"
          href="mailto:admin@hunt.town"
          target="_blank"
          rel="noopener noreferrer"
        >
          Email
        </a>
        <a
          className="top-15"
          href="https://github.com/Steemhunt/neverlose.money-contract/tree/main/audits"
          target="_blank"
          rel="noopener noreferrer"
        >
          Security Audit
        </a>
      </div>

      <div className="links col left-60">
        <a
          href="https://docs.neverlose.money/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
        <a
          className="top-15"
          href="https://docs.neverlose.money/getting-started/user-guide"
          target="_blank"
          rel="noopener noreferrer"
        >
          User Guide{" "}
          <span role="img" aria-label="british flag">
            🇬🇧
          </span>
        </a>
        <a
          className="top-15"
          href="https://docs.neverlose.money/getting-started/user-guide/user-guide-kr"
          target="_blank"
          rel="noopener noreferrer"
        >
          User Guide{" "}
          <span role="img" aria-label="korean flag">
            🇰🇷
          </span>
        </a>
        <a
          className="top-15"
          href="https://docs.neverlose.money/getting-started/faq"
          target="_blank"
          rel="noopener noreferrer"
        >
          FAQ
        </a>
        <a
          className="top-15"
          href="https://docs.neverlose.money/others/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms
        </a>
      </div>
    </footer>
  );
}

export default Footer;
