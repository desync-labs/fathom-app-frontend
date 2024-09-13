import { FC } from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import useProposalContext from "context/proposal";

import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import { BasePaper } from "components/Base/Paper/StyledPaper";
import StakingCountdown from "components/Staking/StakingCountdown";

import useConnector from "context/connector";

import { ChainId } from "connectors/networks";

import { getAccountUrl } from "utils/explorer";
import { ZERO_ADDRESS } from "utils/Constants";
import { secondsToTime } from "utils/secondsToTime";
import useSharedContext from "context/shared";

export const ProposalTitle = styled(Typography)`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  margin-bottom: 20px;
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

export const ProposalInfoList = styled(List)`
  list-style: none;

  & .MuiListItem-root {
    flex-direction: column;
    align-items: flex-start;
    padding-left: 0;
    padding-right: 0;
  }
`;

export const ListItemLabel = styled(ListItemText)`
  span {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }
`;

export const ListItemValue = styled(ListItemText)`
  span {
    color: #b7c8e5;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
`;

const TimeLabel = styled("div")`
  color: #8ea4cc;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  text-transform: uppercase;
  padding-bottom: 2px;
`;

const TimeValue = styled("div")`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
`;

const TimeBlock = styled("div")`
  font-size: 14px;
  line-height: 20px;
  color: #9fadc6;
`;

const ProposalInfo: FC = () => {
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
    <BasePaper>
      <ProposalTitle>
        {getTitleDescription(fetchedProposal.description, 0)}
      </ProposalTitle>
      <BaseFlexBox sx={{ justifyContent: "flex-start", alignItems: "start" }}>
        <Box width={isMobile ? "35%" : "25%"}>
          <TimeLabel>Submit time</TimeLabel>
          <TimeValue>{submitTime}</TimeValue>
        </Box>

        <Box width={isMobile ? "35%" : "25%"}>
          <TimeLabel>Exp. Voting starts:</TimeLabel>
          <TimeValue>{votingStartsTime}</TimeValue>
          <TimeBlock>Start block: {fetchedProposal.startBlock}</TimeBlock>
        </Box>

        <Box width={"30%"}>
          <TimeLabel>Exp. Voting ends:</TimeLabel>
          <TimeValue>
            {secondsLeft ? "in " : null}
            <TimeslotInProgress
              isDone={secondsLeft <= 0}
              lessTimeLeft={secondsLeft > 0 && secondsLeft < 15 * 60}
              component="span"
            >
              {secondsLeft > 0 ? (
                <StakingCountdown timeObject={secondsToTime(secondsLeft)} />
              ) : (
                votingEndTime
              )}
            </TimeslotInProgress>
          </TimeValue>
          <TimeBlock>End block: {fetchedProposal.endBlock}</TimeBlock>
        </Box>
      </BaseFlexBox>
      <Divider sx={{ borderColor: "#2C4066", marginY: "16px" }} />
      <ProposalInfoList>
        {!!getTitleDescription(fetchedProposal.description, 1) && (
          <ListItem>
            <ListItemLabel>Description</ListItemLabel>
            <ListItemValue>
              {" "}
              {getTitleDescription(fetchedProposal.description, 1)}
            </ListItemValue>
          </ListItem>
        )}

        {fetchedProposal.targets &&
          fetchedProposal.targets.length &&
          fetchedProposal.targets[0] !== ZERO_ADDRESS && (
            <>
              <ListItem>
                <ListItemLabel>Targets: </ListItemLabel>
                <ListItemValue>
                  {fetchedProposal.targets.join(", ")}
                </ListItemValue>
              </ListItem>
              <ListItem>
                <ListItemLabel>Values: </ListItemLabel>
                <ListItemValue>
                  {fetchedProposal.values.join(", ")}
                </ListItemValue>
              </ListItem>
              <ListItem>
                <ListItemLabel>Call Data: </ListItemLabel>
                <ListItemValue>
                  {fetchedProposal.calldatas.join(", ")}
                </ListItemValue>
              </ListItem>
            </>
          )}

        <ListItem>
          <ListItemLabel>Proposer</ListItemLabel>
          <ListItemValue>
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
          </ListItemValue>
        </ListItem>
      </ProposalInfoList>
    </BasePaper>
  );
};

export default ProposalInfo;
