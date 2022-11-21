import { Icon, TableCell, Box, Stack } from "@mui/material";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import React, { Dispatch, FC, SetStateAction } from "react";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import { styled } from "@mui/material/styles";
import { OpenPositionButton } from "components/AppComponents/AppButton/AppButton";
import { getTokenLogoURL } from "utils/tokenLogo";
import { TVL, PoolName } from "components/AppComponents/AppBox/AppBox";
import TokenLogo from "components/Common/TokenLogo";

import ComboShapeSrc from "assets/svg/combo-shape.svg";
import GreenSrc from "assets/svg/hart-arrow-up.svg";

type PoolsListItemPropsType = {
  pool: ICollateralPool;
  setSelectedPool: Dispatch<SetStateAction<ICollateralPool | undefined>>;
};

const PoolsListItemTableRow = styled(AppTableRow)`
  td {
    background: #1d2d49;
    bordercolor: #121212;
    padding: 9px 0;
  }

  td:first-of-type {
    border-radius: 8px 0 0 8px;
    text-align: center;
  }

  td:last-of-type {
    border-radius: 0 8px 8px 0;
  }
`;

const TextBox = styled(Box)`
  float: left;
  padding-top: 2px;
  margin-right: 7px;
`;

const ComboShareIcon = () => {
  return (
    <Icon>
      <img src={ComboShapeSrc} alt="borrow-icon" width={24} />
    </Icon>
  );
};

const GreenIcon = () => {
  return (
    <Icon>
      <img src={GreenSrc} alt="borrow-icon" />
    </Icon>
  );
};

const PoolsListItem: FC<PoolsListItemPropsType> = ({
  pool,
  setSelectedPool,
}) => {
  console.log(pool);

  return (
    <PoolsListItemTableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell>
        <Stack direction="row" spacing={2}>
          <TokenLogo src={getTokenLogoURL(pool.name)} alt={pool.name} />
          <Box>
            <PoolName>{pool.name}</PoolName>
            <TVL>TVL: $1.607M</TVL>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>{pool.borrowedFathom} FXD</TableCell>
      <TableCell></TableCell>
      <TableCell>{pool.availableFathom} FXD</TableCell>
      <TableCell>
        <TextBox>2.60%</TextBox> <ComboShareIcon />
      </TableCell>
      <TableCell>
        <TextBox>0.23%</TextBox> <GreenIcon />
      </TableCell>
      <TableCell>
        <TextBox>1.04%</TextBox> <GreenIcon />
      </TableCell>
      <TableCell align="right">
        <OpenPositionButton onClick={() => setSelectedPool(pool)}>
          <AddCircleIcon sx={{ fontSize: "16px", marginRight: "7px" }} />
          Open Position
        </OpenPositionButton>
      </TableCell>
    </PoolsListItemTableRow>
  );
};

export default PoolsListItem;
