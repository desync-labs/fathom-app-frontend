import React, { useMemo } from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead
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
    closingType,
    setType,
    approveBtn,
    approvalPending,
    positions,
    approve,
    selectedPosition,
    setSelectedPosition,
    loading,
  } = useOpenPositionList();

  return (
    <>
      <TitleSecondary>Your Positions</TitleSecondary>
      {useMemo(
        () =>
          positions.length === 0 ? (
            <NoResults variant="h6">
              { loading ? <CircularProgress size={30} /> : 'You have not opened any position' }
            </NoResults>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <AppTableHeaderRow
                    sx={{
                      th: { textAlign: "left", paddingLeft: "10px" },
                    }}
                  >
                    <TableCell>Id</TableCell>
                    <TableCell>Asset</TableCell>
                    <TableCell>Liquidation price</TableCell>
                    <TableCell>Borrowed</TableCell>
                    <TableCell>Collateral</TableCell>
                    <TableCell>Safety buffer</TableCell>
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
                      setType={setType}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ),
        [
          loading,
          positions,
          approve,
          approvalPending,
          approveBtn,
          setSelectedPosition,
          setType,
        ]
      )}
      {selectedPosition && (
        <ClosePositionDialog
          position={selectedPosition}
          onClose={() => setSelectedPosition(undefined)}
          closingType={closingType}
          setType={setType}
        />
      )}
    </>
  );
});

export default OpenPositionsList;
