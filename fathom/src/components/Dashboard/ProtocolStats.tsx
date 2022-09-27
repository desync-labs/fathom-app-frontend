import { Box, CardMedia, Grid, Paper } from '@mui/material';
// import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import logo from '../../assets/images/fxd-logo.jpg';


const ProtocolStats = function ProtocolStats(props: any) {
    return (
        <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 240,
        }}
      >
      {/* <Typography variant="h6" gutterBottom>
          FXD
      </Typography> */}
      {/* <CardMedia
        component="img"
        width="80"
        height="40"
        image={logo}
        alt="Fathom Stablecoin"
      /> */}
      <img src={logo} alt="Fathom Stablecoin"  height="40" width="80"></img>
      <Typography variant="subtitle1" gutterBottom>
          The reliable stablecoin that earns you extra passive income
      </Typography>
      <Typography variant="body2" gutterBottom>
            FXD is an auto-farming stablecoin that earns passive yields for you in the background.
            Now, instead of paying for loans,you can get loans while earning on your collateral.
      </Typography>
      <Grid container>
      <Box
        sx={{
          boxShadow: 2,
          width: '7rem',
          height: '4rem',
          bgcolor: '#000000',
          p: 1,
          m: 1,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
       <Typography variant="subtitle1" color="text.secondary">
          Total Supply
       </Typography>
       <Typography variant="body2" gutterBottom>
          1000000000
       </Typography>
      </Box>
      <Box
        sx={{
          boxShadow: 2,
          width: '7rem',
          height: '4rem',
          bgcolor: '#000000',
          p: 1,
          m: 1,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
      <Typography variant="subtitle1" color="text.secondary">
          TVL
      </Typography>
      <Typography variant="body2" gutterBottom>
          1000000000
      </Typography>
      </Box>
      <Box
        sx={{
          boxShadow: 2,
          width: '7rem',
          height: '4rem',
          bgcolor: '#000000',
          p: 1,
          m: 1,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
      <Typography variant="subtitle1" color="text.secondary">
          FXD Price
      </Typography>
      <Typography variant="body2" gutterBottom>
          $ 1.00
      </Typography>
      </Box>
      <Box
        sx={{
          boxShadow: 2,
          width: '7rem',
          height: '4rem',
          bgcolor: '#000000',
          p: 1,
          m: 1,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
      <Typography variant="subtitle1" color="text.secondary">
          Stability Fee
      </Typography>
      <Typography variant="body2" gutterBottom>
          5%
      </Typography>
      </Box>
    </Grid>

      </Paper>

    );
  }

  export default ProtocolStats;