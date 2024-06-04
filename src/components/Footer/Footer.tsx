import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Box, Divider } from "@mui/material";

const Footer = styled(Typography)`
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 4px;
  padding-bottom: 10px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TokensWrapper = styled("div")`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  line-height: 18px;
  a {
    font-size: 1rem;
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
    <Box>
      <TokensWrapper>
        <a
          href={"https://docs.fathom.fi/fxd-deployments"}
          target={"_blank"}
          rel="noreferrer"
        >
          FXD
        </a>
        <FooterDivider orientation="vertical" flexItem />
        <a
          href={"https://docs.fathom.fi/fthm-deployments"}
          target={"_blank"}
          rel="noreferrer"
        >
          FTHM
        </a>
      </TokensWrapper>
      <Footer {...props}>
        {"Copyright©"}
        <Link color="inherit" fontSize="inherit" href="https://fathom.fi/">
          Fathom App
        </Link>
        {new Date().getFullYear()}.
      </Footer>
    </Box>
  );
};

export default Copyright;
