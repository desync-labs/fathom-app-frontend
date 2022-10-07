//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import { observer } from "mobx-react";
import { Paper, Typography } from "@mui/material";
import CustomizedDialogs from "../Positions/OpenNewPositionDialog";
import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import { Grid  } from '@mui/material';

//Deprecated: This component is deprecated, use PoolsListView instead
//TODO: Remove component if ont required
interface PoolProps {
  pool: ICollatralPool;
}

const PoolListView = observer((props: PoolProps) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: 240,
      }}
    >
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        {props.pool.name} Pool
      </Typography>

      <Grid container>
        <Typography sx={{ flex: 1 }}>
          Available FXD
        </Typography>
        <Typography component="p">
          {props.pool.availableFathom}
        </Typography>
      </Grid>

      <Grid container>
        <Typography  sx={{ flex: 1 }}>
          Borrowed FXD
        </Typography>
        <Typography component="p">
          {props.pool.borrowedFathom}
        </Typography>
      </Grid>

      <Grid container>
        <Typography color="text.secondary" sx={{ flex: 1 }} >
          Lending APR 
        </Typography>
        <Typography component="p">
          2.60%
        </Typography>
      </Grid>

      <Grid container >
        <Typography color="text.secondary" sx={{ flex: 1 }} >
          Staking APR
        </Typography>
        <Typography component="p"  >
          0.23%
        </Typography>
      </Grid>

      <Grid container sx={{marginBottom: 2}} >
        <Typography color="text.secondary" sx={{ flex: 1 }} >
          Total APY
        </Typography>
        <Typography component="p"  >
          1.04%
        </Typography>
      </Grid>

      <CustomizedDialogs pool={props.pool} />
      
    </Paper>
  );
});

export default PoolListView;
