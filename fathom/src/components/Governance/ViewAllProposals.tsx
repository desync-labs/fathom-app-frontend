import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import IProposal from "stores/interfaces/IProposal";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  AppTableHeaderRow,
  AppTableRow
} from "../AppComponents/AppTable/AppTable";

const AllProposalsView = observer(() => {
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const proposeStore = useStores().proposalStore;

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        logger.log(LogLevel.info, "fetching proposal information.");
        proposeStore.fetchProposals(account);
      });
    } else {
      proposeStore.setProposals([]);
    }
  }, [account, logger, proposeStore, chainId]);

  return (
    <>
      <AppPaper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Proposals
        </Typography>
        {proposeStore.fetchedProposals.length === 0 ? (
          <Typography variant="h6">Loading all proposals</Typography>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <AppTableHeaderRow>
                  <TableCell>Proposal Id Hash:</TableCell>
                  <TableCell>Title:</TableCell>
                  <TableCell>Status:</TableCell>
                  <TableCell align="right"></TableCell>
                </AppTableHeaderRow>
              </TableHead>
              <TableBody>
                {proposeStore.fetchedProposals.map((proposal: IProposal) => (
                  <AppTableRow
                    key={proposal.proposalId}
                    sx={{ "&:last-child td, &:last-child td": { border: 0 }, td: { textAlign: 'center' } }}
                  >
                    <TableCell component="td" scope="row" color="primary">
                      <Link
                        style={{ color: "#fff" }}
                        to={`/proposal/${proposal.proposalId}`}
                      >
                        {proposal.proposalId.substring(0, 4) +
                          " ... " +
                          proposal.proposalId.slice(-4)}
                      </Link>
                    </TableCell>

                    <TableCell component="td" scope="row">
                      {proposal.description
                        .split("----------------")[0]
                        .substring(0, 50) + " ... "}
                    </TableCell>

                    <TableCell component="td" scope="row">
                      {proposal.status}
                    </TableCell>
                  </AppTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AppPaper>
    </>
  );
});

export default AllProposalsView;
