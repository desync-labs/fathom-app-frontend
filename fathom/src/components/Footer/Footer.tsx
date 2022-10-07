import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const CopyrightStyles = {
  position: "fixed",
  bottom: "0",
  width: '100%',
  my: 4,
  ml: "-100px"
}


const Copyright = function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} sx={CopyrightStyles}>
      {'Copyright © '}
      <Link color="inherit" href="https://fathom.com/">
        Fathom App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;