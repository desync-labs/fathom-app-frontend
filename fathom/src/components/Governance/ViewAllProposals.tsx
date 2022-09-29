import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import IProposal from "../../stores/interfaces/IProposal";
import { useEffect } from "react";
import { observer } from "mobx-react";

const AllProposalsView = observer(() => {
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const proposeStore = useStores().proposalStore;

  useEffect(() => {
    if (chainId) {
      logger.log(LogLevel.info, "fetching proposal information.");
      proposeStore.fetchProposals(account); // where is this being used?
    } else {
      proposeStore.setProposals([]);
    }

  }, [account, logger, proposeStore, chainId]);

  return (
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Proposals
      </Typography>
      {proposeStore.fetchedProposals.length === 0 ? (
        <Typography variant="h6">No proposals available</Typography>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Proposal Id Hash:</TableCell>
                <TableCell>Description:</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposeStore.fetchedProposals.map((proposal: IProposal) => (
                <TableRow
                  key={proposal.proposalId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link href={`/proposal/${proposal.proposalId}`}>
                      {proposal.proposalId.substring(0, 4) +
                        " ... " +
                        proposal.proposalId.slice(-4)}
                    </Link>
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {proposal.description.substring(0, 50) + " ... "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
});

export default AllProposalsView;
