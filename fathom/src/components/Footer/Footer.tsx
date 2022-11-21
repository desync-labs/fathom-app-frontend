import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";

const Footer = styled(Typography) `
  margin: 40px 0 40px -80px;
`


const Copyright = function Copyright(props: any) {
  return (
    <Footer color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://fathom.com/">
        Fathom App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Footer>
  );
}

export default Copyright;