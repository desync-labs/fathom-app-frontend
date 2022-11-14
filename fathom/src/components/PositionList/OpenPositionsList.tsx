import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { observer } from "mobx-react";
import ClosePositionDialog from "components/Positions/ClosePositionDialog";
import { AppTableHeaderRow } from "components/AppComponents/AppTable/AppTable";
import {
  TitleSecondary,
  NoResults,
} from "components/AppComponents/AppBox/AppBox";
import PositionListItem from "components/PositionList/PositionListItem";
import useOpenPositionList from "hooks/useOpenPositionList";

const OpenPositionsList = observer(() => {
  const {
    approveBtn,
    approvalPending,
    positions,
    approve,
    selectedPosition,
    setSelectedPosition,
  } = useOpenPositionList();

  return (
    <>
      <TitleSecondary>Your Positions</TitleSecondary>
      {useMemo(
        () =>
          positions.length === 0 ? (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <AppTableHeaderRow
                      sx={{
                        th: { textAlign: "left", paddingLeft: "10px" },
                      }}
                    >
                      <TableCell>Position Id</TableCell>
                      <TableCell>Pool</TableCell>
                      <TableCell>FXD Borrowed</TableCell>
                      <TableCell>Locked Collateral</TableCell>
                      <TableCell>Locked Value</TableCell>
                      <TableCell>LTV</TableCell>
                      <TableCell></TableCell>
                    </AppTableHeaderRow>
                  </TableHead>
                </Table>
              </TableContainer>
              <NoResults variant="h6">
                You have not opened any position
              </NoResults>
            </>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <AppTableHeaderRow
                    sx={{
                      th: { textAlign: "left", paddingLeft: "10px" },
                    }}
                  >
                    <TableCell>Position Id</TableCell>
                    <TableCell>Pool</TableCell>
                    <TableCell>FXD Borrowed</TableCell>
                    <TableCell>Locked Collateral</TableCell>
                    <TableCell>Locked Value</TableCell>
                    <TableCell>LTV</TableCell>
                    <TableCell></TableCell>
                  </AppTableHeaderRow>
                </TableHead>
                <TableBody>
                  {positions.map((position: IOpenPosition) => (
                    <PositionListItem
                      approve={approve}
                      approvalPending={approvalPending}
                      approveBtn={approveBtn}
                      key={position.id}
                      position={position}
                      setSelectedPosition={setSelectedPosition}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ),
        [positions]
      )}
      {useMemo(
        () =>
          selectedPosition && (
            <ClosePositionDialog
              position={selectedPosition}
              onClose={() => setSelectedPosition(undefined)}
            />
          ),
        [selectedPosition]
      )}
    </>
  );
});

export default OpenPositionsList;
