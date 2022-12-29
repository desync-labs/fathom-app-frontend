import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";

const Footer = styled(Typography) `
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 4px;
  padding-bottom: 10px;
`


const Copyright = function Copyright(props: any) {
  return (
    <Footer color="text.secondary" {...props}>
      {'Copyright©'}
      <Link color="inherit" href="https://fathom.fi/">
        Fathom App
      </Link>{new Date().getFullYear()}.
    </Footer>
  );
}

export default Copyright;