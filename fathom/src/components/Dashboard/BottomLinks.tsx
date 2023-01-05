import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const LinksWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-left: 14px;
  position: absolute;
  bottom: 50px;
  a {
    font-size: 0.825rem;
    font-weight: 500;
    color: rgb(255, 255, 255);
    opacity: 0.8;
    display: flex;
    justify-content: start;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const BottomLinks: FC = () => {
  return (
    <LinksWrapper>
      <a href={"https://fathom.fi/"} rel="noreferrer" target={"_blank"}>
        Fathom.fi
      </a>
      <a
        href={"https://hackmd.io/@fathomlite/BkIabl5fs"}
        rel="noreferrer"
        target={"_blank"}
      >
        Docs
      </a>
      <a href={"https://t.me/fathom_fi"} rel="noreferrer" target={"_blank"}>
        Telegram
      </a>
      <a
        href={"https://twitter.com/Fathom_fi"}
        rel="noreferrer"
        target={"_blank"}
      >
        Twitter
      </a>
      <a
        href={"https://twitter.com/Fathom_fi"}
        rel="noreferrer"
        target={"_blank"}
      >
        LinkedIn
      </a>
    </LinksWrapper>
  );
};

export default BottomLinks;
