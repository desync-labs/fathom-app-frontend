import {
  Button,
  Paper,
  Toolbar,
  Typography,
  LinearProgressProps,
  Container,
  ButtonGroup,
  Box,
  LinearProgress
} from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import { useStores } from "../../stores";
import useMetaMask from "../../hooks/metamask";
import { useParams } from "react-router-dom";
import { UnsupportedChainIdError } from "@web3-react/core";
import AlertMessages from "../Common/AlertMessages";
import TransactionStatus from "../Transaction/TransactionStatus";

const ProposalView = observer(() => {
  const { account, chainId, error } = useMetaMask()!;
  const unsupportedError = useMemo(
    () => (error as Error) instanceof UnsupportedChainIdError,
    [error]
  );

  const { _proposalId } = useParams();
  const proposeStore = useStores().proposalStore;

  const handleFor = useCallback(
    async (support: string) => {
      try {
        if (typeof _proposalId === "string") {
          await proposeStore.castVote(_proposalId, account, support, chainId);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [_proposalId, proposeStore, account, chainId]
  );

  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  useEffect(() => {
    if (chainId && (!error || !unsupportedError)) {
      setTimeout(() => {
        proposeStore.fetchProposals(account);
        if (typeof _proposalId === "string") {
          proposeStore.fetchProposal(_proposalId, account);
          proposeStore.fetchProposalState(_proposalId, account);
          proposeStore.fetchProposalVotes(_proposalId, account);
        }
      });
    }
  }, [_proposalId, account, chainId, error, unsupportedError, proposeStore]);

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
          {proposeStore.fetchedProposals.length === 0 ? (
            <Typography variant="h6">
              No proposals available Proposal: {_proposalId}
            </Typography>
          ) : (
            <>
              <Typography component="h2" color="primary" gutterBottom>
                Proposal Id:
              </Typography>
              <Typography gutterBottom>{_proposalId}</Typography>
              <Typography component="h2" color="primary" gutterBottom>
                Description:
              </Typography>

              <Typography gutterBottom>
                {proposeStore.fetchedProposal.description}
              </Typography>
            </>
          )}
        </Paper>

        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Typography component="h2" color="primary" gutterBottom>
            Proposal State:
          </Typography>
          <Typography gutterBottom>
            {proposeStore.fetchedProposalState}
          </Typography>

          <Box sx={{ width: "100%" }}>
            <Typography gutterBottom>For:</Typography>
            <LinearProgressWithLabel
              variant="determinate"
              value={
                (100 * proposeStore.fetchedVotes.forVotes) /
                proposeStore.fetchedTotalVotes
              }
            />

            <Typography gutterBottom>Against:</Typography>
            <LinearProgressWithLabel
              variant="determinate"
              value={
                (100 * proposeStore.fetchedVotes.againstVotes) /
                proposeStore.fetchedTotalVotes
              }
            />

            <Typography gutterBottom>Abstains:</Typography>
            <LinearProgressWithLabel
              variant="determinate"
              value={
                (100 * proposeStore.fetchedVotes.abstainVotes) /
                proposeStore.fetchedTotalVotes
              }
            />
          </Box>

          {proposeStore.fetchedProposalState !== "1" ? (
            <>
              <Typography variant="h6">Voting closed</Typography>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Button onClick={() => handleFor("1")} disabled={true}>
                  {" "}
                  For{" "}
                </Button>
                <Button onClick={() => handleFor("0")} disabled={true}>
                  Against
                </Button>
                <Button onClick={() => handleFor("2")} disabled={true}>
                  Abstain
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              <Typography variant="h6">Cast Vote:</Typography>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Button onClick={() => handleFor("1")}> For </Button>
                <Button onClick={() => handleFor("0")}>Against</Button>
                <Button onClick={() => handleFor("2")}>Abstain</Button>
              </ButtonGroup>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
});

export default ProposalView;
