import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { observer } from "mobx-react";
import ClosePositionDialog from "components/Positions/ClosePositionDialog";
import {
  AppTableHeaderRow,
} from "components/AppComponents/AppTable/AppTable";
import {
  TitleSecondary,
  NoResults,
} from "components/AppComponents/AppBox/AppBox";
import PositionListItem from "components/PositionList/PositionListItem";

const OpenPositionsList = observer(() => {
  const { positionStore, poolStore } = useStores();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const [selectedPosition, setSelectedPosition] = useState<IOpenPosition>();

  const [approveBtn, setApproveBtn] = useState(true);
  const [approvalPending, setApprovalPending] = useState(false);

  const approvalStatus = useCallback(async () => {
    const approved = await positionStore.approvalStatusStableCoin(account);
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionStore, account]);

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        // Update the document title using the browser API
        logger.log(LogLevel.info, `fetching open positions. ${account}`);
        approvalStatus();
      });
    } else {
      positionStore.setPositions([]);
    }
  }, [positionStore, account, chainId, approvalStatus, logger]);

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionStore.approveStableCoin(account);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [positionStore, account, setApprovalPending, setApproveBtn]);

  return (
    <>
      <TitleSecondary>Your Positions</TitleSecondary>
      {positionStore.positions.length === 0 ? (
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
          <NoResults variant="h6">You have not opened any position</NoResults>
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
              {positionStore.positions.map((position: IOpenPosition) => (
                <PositionListItem
                  approve={approve}
                  approvalPending={approvalPending}
                  approveBtn={approveBtn}
                  key={position.id}
                  position={position}
                  poolStore={poolStore}
                  setSelectedPosition={setSelectedPosition}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedPosition && (
        <ClosePositionDialog
          position={selectedPosition}
          onClose={() => setSelectedPosition(undefined)}
        />
      )}
    </>
  );
});

export default OpenPositionsList;
