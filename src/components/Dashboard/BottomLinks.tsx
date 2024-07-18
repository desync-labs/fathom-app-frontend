import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import LinkedInSrc from "assets/svg/socials/linkedln.svg";
import TelegramSrc from "assets/svg/socials/telegram.svg";
import TwitterSrc from "assets/svg/socials/twitter.svg";

const BottomMenu = styled(Box)`
  position: absolute;
  bottom: 25px;
`;

const LinksWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0;

  a {
    font-size: 14px;
    font-weight: 600;
    color: #b7c8e5;
    opacity: 0.8;
    display: flex;
    justify-content: start;
    padding: 8px 16px;

    &:hover {
      opacity: 1;
    }
  }
`;

const SocialLinksWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 8px 16px;

  & a {
    height: 24px;
  }
`;

const BottomLinks: FC = () => {
  return (
    <BottomMenu>
      <LinksWrapper>
        <a href={"https://fathom.fi/"} rel="noreferrer" target={"_blank"}>
          Fathom.fi
        </a>
        <a href={"https://docs.fathom.fi"} rel="noreferrer" target={"_blank"}>
          Docs
        </a>
        <a
          href={"https://docs.fathom.fi/privacy-policy"}
          rel="noreferrer"
          target={"_blank"}
        >
          Privacy Policy
        </a>
        <a
          href={"https://docs.fathom.fi/terms-of-service"}
          rel="noreferrer"
          target={"_blank"}
        >
          Terms of Service
        </a>
        <a
          href={"https://docs.fathom.fi/fxd-deployments"}
          target={"_blank"}
          rel="noreferrer"
        >
          FXD
        </a>
        <a
          href={"https://docs.fathom.fi/fthm-deployments"}
          target={"_blank"}
          rel="noreferrer"
        >
          FTHM
        </a>
      </LinksWrapper>
      <SocialLinksWrapper>
        <a href={"https://t.me/fathom_fi"} rel="noreferrer" target={"_blank"}>
          <img src={TelegramSrc} alt={"telegram"} />
        </a>
        <a
          href={"https://twitter.com/Fathom_fi"}
          rel="noreferrer"
          target={"_blank"}
        >
          <img src={TwitterSrc} alt={"twitter"} />
        </a>
        <a
          href={"https://www.linkedin.com/company/fathom-protocol/"}
          rel="noreferrer"
          target={"_blank"}
        >
          <img src={LinkedInSrc} alt={"linked-in"} />
        </a>
      </SocialLinksWrapper>
    </BottomMenu>
  );
};

export default BottomLinks;
