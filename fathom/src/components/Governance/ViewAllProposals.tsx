import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Container,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import IProposal from "../../stores/interfaces/IProposal";
import { useEffect } from "react";
import { observer } from "mobx-react";
import AlertMessages from "../Common/AlertMessages";
import TransactionStatus from "../Transaction/TransactionStatus";

const AllProposalsView = observer(() => {
  const { account } = useMetaMask()!;
  const logger = useLogger();
  const proposeStore = useStores().proposalStore;

  useEffect(() => {
    logger.log(LogLevel.info, "fetching proposal information.");
    proposeStore.fetchProposals(account); // where is this being used?
  }, [account, logger, proposeStore]);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "#000",
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <AlertMessages />
      <TransactionStatus />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
      </Container>
    </Box>
  );
});

export default AllProposalsView;
