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
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { LogLevel, useLogger } from "../../helpers/Logger";
import IProposal from "../../stores/interfaces/IProposal";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { AppPaper } from "../AppPaper/AppPaper";

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
                <TableRow>
                  <TableCell>Proposal Id Hash:</TableCell>
                  <TableCell>Title:</TableCell>
                  <TableCell>Status:</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proposeStore.fetchedProposals.map((proposal: IProposal) => (
                  <TableRow
                    key={proposal.proposalId}
                    sx={{ "&:last-child td, &:last-child td": { border: 0 } }}
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
                  </TableRow>
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
