import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Divider } from "@mui/material";

const Footer = styled(Typography)`
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 4px;
  padding-bottom: 10px;
`;

const TokensWrapper = styled("div")`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  line-height: 18px;
  a {
    color: rgba(255, 255, 255, 0.7);
    :hover {
      text-decoration: underline;
    }
  }
`;

export const FooterDivider = styled(Divider)`
  border: 1px solid #9fadc6;
`;

const Copyright = function Copyright(props: any) {
  return (
    <>
      <TokensWrapper>
        <a
          href={
            "https://explorer.xinfin.network/tokens/xdc49d3f7543335cf38Fa10889CCFF10207e22110B5"
          }
          target={"_blank"}
          rel="noreferrer"
        >
          FXD
        </a>
        <FooterDivider orientation="vertical" flexItem />
        <a
          href={
            "https://explorer.xinfin.network/tokens/xdc3279dBEfABF3C6ac29d7ff24A6c46645f3F4403c"
          }
          target={"_blank"}
          rel="noreferrer"
        >
          FTHM
        </a>
      </TokensWrapper>
      <Footer color="text.secondary" {...props}>
        {"Copyright©"}
        <Link color="inherit" href="https://fathom.fi/">
          Fathom App
        </Link>
        {new Date().getFullYear()}.
      </Footer>
    </>
  );
};

export default Copyright;
