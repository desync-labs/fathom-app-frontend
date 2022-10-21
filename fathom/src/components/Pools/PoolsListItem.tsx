import { Icon, TableCell, Box, Stack } from "@mui/material";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import React, { Dispatch, FC, SetStateAction } from "react";
import { AppTableRow } from "../AppComponents/AppTable/AppTable";
import { styled } from "@mui/material/styles";
import { OpenPositionButton } from "../AppComponents/AppButton/AppButton";
import RedUrl from "assets/svg/combo-shape.svg";
import GreenUrl from "assets/svg/hart-arrow-up.svg";
import { getTokenLogoURL } from "../../utils/tokenLogo";
import { PoolLogoStack } from "../AppComponents/AppStack/AppStack";
import {
  Fee,
  PoolName
} from "../AppComponents/AppTypography/AppTypography";

type PoolsListItemPropsType = {
  pool: ICollateralPool;
  setSelectedPool: Dispatch<SetStateAction<ICollateralPool | undefined>>;
};

const PoolsListItemTableRow = styled(AppTableRow)(({ theme }) => ({
  td: {
    background: "#1D2D49",
    borderColor: "#121212",
    padding: "9px 0",
  },
  "td:first-child": {
    borderRadius: "8px 0 0 8px",
    textAlign: "center",
  },

  "td:last-child": {
    borderRadius: "0 8px 8px 0",
  },
}));

const TextBox = styled(Box)(({ theme }) => ({
  float: "left",
  paddingTop: "2px",
  marginRight: "7px",
}));

const IconRed = () => {
  return (
    <Icon>
      <img src={RedUrl} alt="borrow-icon" />
    </Icon>
  );
};

const GreenIcon = () => {
  return (
    <Icon>
      <img src={GreenUrl} alt="borrow-icon" />
    </Icon>
  );
};

const PoolsListItem: FC<PoolsListItemPropsType> = ({
  pool,
  setSelectedPool,
}) => {
  return (
    <PoolsListItemTableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell>
        <PoolLogoStack direction="row" spacing={2}>
          <Box>
            <img src={getTokenLogoURL(pool.name)} alt={pool.name} width={32} />
          </Box>
          <Box>
            <PoolName>{pool.name}</PoolName>
            <Fee>Sta. Fee 0.13%</Fee>
          </Box>
        </PoolLogoStack>
      </TableCell>
      <TableCell>{pool.borrowedFathom} FXD</TableCell>
      <TableCell></TableCell>
      <TableCell>{pool.availableFathom} FXD</TableCell>
      <TableCell>
        <TextBox>2.60%</TextBox> <IconRed />
      </TableCell>
      <TableCell>
        <TextBox>0.23%</TextBox> <GreenIcon />
      </TableCell>
      <TableCell>
        <TextBox>1.04%</TextBox> <GreenIcon />
      </TableCell>
      <TableCell align="right">
        <OpenPositionButton onClick={() => setSelectedPool(pool)}>
          <AddCircleIcon
            sx={{ color: "#005C55", fontSize: "16px", marginRight: "7px" }}
          />
          Open Position
        </OpenPositionButton>
      </TableCell>
    </PoolsListItemTableRow>
  );
};

export default PoolsListItem;
