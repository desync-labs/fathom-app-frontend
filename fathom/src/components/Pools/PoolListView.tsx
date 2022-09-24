//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import {observer} from 'mobx-react'
import { Paper, Typography } from '@mui/material';
import CustomizedDialogs from '../Positions/OpenNewPositionDialog';
import ICollatralPool from '../../stores/interfaces/ICollatralPool';

 
interface PoolProps {
  pool: ICollatralPool;
}

const PoolListView = observer((props: PoolProps) => {
  return (
      <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        {props.pool.name} Pool
        </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
          Available FXD  
      </Typography>
      <Typography component="p" variant="h4">
        {props.pool.availableFathom}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
         Borrowed FXD
      </Typography>
      <Typography component="p" variant="h4">
        {props.pool.borrowedFathom}
      </Typography >
      <CustomizedDialogs pool={props.pool} />
</Paper>
  );
})

export default PoolListView;
