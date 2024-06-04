import { Box, Grid, Typography } from "@mui/material";
import { secondsToTime } from "utils/secondsToTime";
import { getAccountUrl } from "utils/explorer";
import useProposalContext from "context/proposal";
import { ChainId } from "connectors/networks";
import { styled } from "@mui/material/styles";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import StakingCountdown from "components/Staking/StakingCountdown";
import useConnector from "context/connector";
import { ZERO_ADDRESS } from "utils/Constants";
import useSharedContext from "context/shared";

const ProposalTitle = styled(Typography)`
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  margin-bottom: 20px;
`;

const TimeslotContainer = styled(Grid)`
  border-bottom: 1px solid #253656;
  padding: 20px 24px 30px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 12px 12px 20px;
  }
`;

const TimeslotTitle = styled(Typography)`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
  color: #7d91b5;
`;

const TimeslotValue = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
`;

const TimeslotBlock = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  color: #9fadc6;
`;

const ActionLabel = styled(Box)`
  color: #7d91b5;
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
`;

const ActionWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
  justify-content: start;
  margin-bottom: 10px;
`;

const CallDataWrapper = styled("div")`
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-word;
  word-break: break-word;
`;

const TimeslotInProgress = styled(Box, {
  shouldForwardProp: (prop) => prop !== "lessTimeLeft" && prop !== "isDone",
})<{ lessTimeLeft?: boolean; isDone?: boolean }>(({ lessTimeLeft, isDone }) => {
  const styles = {
    color: "#3DA329",
    fontSize: "14px",
  };

  if (lessTimeLeft) {
    styles.color = "#C37022";
  } else if (isDone) {
    styles.color = "#fff";
  }

  return styles;
});

const ProposalLabel = styled(Box)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const ProposalDescription = styled(Box)`
  color: #9fadc6;
  font-size: 14px;
  line-height: 20px;
  padding: 10px 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    line-break: anywhere;
  }
`;

const ProposalInfo = () => {
  const {
    getTitleDescription,
    fetchedProposal,
    submitTime,
    votingStartsTime,
    votingEndTime,
    secondsLeft,
  } = useProposalContext();

  const { chainId } = useConnector();
  const { isMobile } = useSharedContext();

  return (
    <Grid item xs={12} md={8} lg={8}>
      <AppPaper>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{ padding: isMobile ? "20px 12px 0" : "24px 24px 0" }}
          >
            <ProposalTitle>
              {getTitleDescription(fetchedProposal.description, 0)}
            </ProposalTitle>
          </Grid>
          <Grid item xs={12}>
            <TimeslotContainer container gap={2}>
              <Grid item xs={12} sm={3}>
                <TimeslotTitle>Submit time:</TimeslotTitle>
                <TimeslotValue>{submitTime}</TimeslotValue>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TimeslotTitle>Exp. Voting starts:</TimeslotTitle>
                <TimeslotValue>{votingStartsTime}</TimeslotValue>
                <TimeslotBlock>
                  Start block: {fetchedProposal.startBlock}
                </TimeslotBlock>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TimeslotTitle>Exp. Voting ends:</TimeslotTitle>
                <TimeslotValue>
                  {secondsLeft ? "in " : null}
                  <TimeslotInProgress
                    isDone={secondsLeft <= 0}
                    lessTimeLeft={secondsLeft > 0 && secondsLeft < 15 * 60}
                    component="span"
                  >
                    {secondsLeft > 0 ? (
                      <StakingCountdown
                        timeObject={secondsToTime(secondsLeft)}
                      />
                    ) : (
                      votingEndTime
                    )}
                  </TimeslotInProgress>
                </TimeslotValue>
                <TimeslotBlock>
                  End block: {fetchedProposal.endBlock}
                </TimeslotBlock>
              </Grid>
            </TimeslotContainer>
          </Grid>
          {!!getTitleDescription(fetchedProposal.description, 1) && (
            <Grid
              item
              xs={12}
              sx={{ padding: isMobile ? "20px 12px" : "24px 24px 12px 24px" }}
            >
              <ProposalLabel>Description</ProposalLabel>
              <ProposalDescription>
                {getTitleDescription(fetchedProposal.description, 1)}
              </ProposalDescription>
            </Grid>
          )}
          {fetchedProposal.targets &&
            fetchedProposal.targets.length &&
            fetchedProposal.targets[0] !== ZERO_ADDRESS && (
              <Grid
                item
                xs={12}
                sx={{ padding: isMobile ? "12px" : "12px 24px" }}
              >
                <ProposalLabel>Action</ProposalLabel>
                <ProposalDescription>
                  <ActionWrapper>
                    <ActionLabel>Targets: </ActionLabel>
                    {fetchedProposal.targets.join(", ")}
                  </ActionWrapper>
                  <ActionWrapper>
                    <ActionLabel>Values: </ActionLabel>
                    {fetchedProposal.values.join(", ")}
                  </ActionWrapper>
                  <ActionWrapper>
                    <ActionLabel>Call Data:</ActionLabel>{" "}
                    <CallDataWrapper>
                      {fetchedProposal.calldatas.join(", ")}
                    </CallDataWrapper>
                  </ActionWrapper>
                </ProposalDescription>
              </Grid>
            )}
          {/*<Grid item xs={12} sx={{ padding: "12px 24px" }}>*/}
          {/*  <ProposalLabel>Discussion</ProposalLabel>*/}
          {/*  <ProposalDescription>*/}
          {/*    <a href="/">Discord / Forum / Medium / etc...</a>*/}
          {/*  </ProposalDescription>*/}
          {/*</Grid>*/}
          <Grid
            item
            xs={12}
            sx={{
              padding: isMobile ? "12px 12px 20px" : "12px 24px 24px 24px",
            }}
          >
            <ProposalLabel>Proposer</ProposalLabel>
            <ProposalDescription>
              {chainId && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={getAccountUrl(
                    fetchedProposal.proposer,
                    chainId as ChainId
                  )}
                >
                  {fetchedProposal.proposer}
                </a>
              )}
              {!chainId && <span>{fetchedProposal.proposer}</span>}
            </ProposalDescription>
          </Grid>
        </Grid>
      </AppPaper>
    </Grid>
  );
};

export default ProposalInfo;
