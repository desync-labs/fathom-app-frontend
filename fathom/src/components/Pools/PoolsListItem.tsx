import { TableRow, TableCell, Typography, Button } from "@mui/material";
import ICollatralPool from "../../stores/interfaces/ICollatralPool";

import {
  Dispatch,
  FC,
  SetStateAction
} from "react";

type PoolsListItemPropsType = {
  pool: ICollatralPool,
  setSelectedPool: Dispatch<SetStateAction<ICollatralPool | undefined>>
}

const PoolsListItem: FC<PoolsListItemPropsType> = ({ pool, setSelectedPool }) => {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell align="left" style={{ verticalAlign: "top" }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {pool.name}
        </Typography>
        <Typography variant="body2">
          Available : {pool.availableFathom}
        </Typography>
        <Typography variant="body2">
          Borrowed : {pool.borrowedFathom}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography color="text.secondary">Lending APR : 2.60%</Typography>
        <Typography color="text.secondary">Staking APR : 0.23%</Typography>
        <Typography color="text.secondary">Total APY : 1.04%</Typography>
      </TableCell>
      <TableCell align="left">
        <Button variant="outlined" color="primary" onClick={
          () => setSelectedPool(pool)}>
          Open New Position
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default PoolsListItem;
