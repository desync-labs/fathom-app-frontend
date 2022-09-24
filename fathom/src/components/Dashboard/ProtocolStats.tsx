import { Paper } from '@mui/material';
// import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


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
      <Typography variant="h6" gutterBottom>
          FXD
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
          The reliable stablecoin that earns you extra passive income
      </Typography>
      <Typography variant="body2" gutterBottom>
            FXD is an auto-farming stablecoin that earns passive yields for you in the background.
            Now, instead of paying for loans,you can get loans while earning on your collateral.
      </Typography>
      </Paper>

    );
  }

  export default ProtocolStats;