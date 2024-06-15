import { FC, memo, useMemo } from "react";
import { Box, Grid, Tooltip } from "@mui/material";

import { styled } from "@mui/material/styles";
import { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";

import { Link } from "react-router-dom";

import StakingCountdown from "components/Staking/StakingCountdown";
import { secondsToTime } from "utils/secondsToTime";
import useViewProposalItem from "hooks/Governance/useViewProposalItem";
import { IProposal } from "fathom-sdk";

import DefeatedSrc from "assets/svg/rejected.svg";
import SucceededSrc from "assets/svg/succeeded.svg";

type ViewAllProposalItemProps = {
  proposal: IProposal;
  index: number;
};

const ProposalItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 20px;
  gap: 8px;
  background: #131f35;
  border-radius: 8px;
`;

const ProposalIdTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#0D1526",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#0D1526",
    border: "1px solid #1D2D49",
  },
}));

const ProposalItemTitle = styled(Box)`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
`;

const ProposalItemProposalId = styled(Box)`
  color: #9fadc6;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  text-decoration: none;
`;

const ProposalItemTimeLeft = styled(Box)`
  color: #6379a1;
  margin-top: -4px;
  font-size: 14px;
  &.in-progress {
    color: #f5953d;
  }
`;

export const ProposalItemStatus = styled(Box)`
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  font-size: 14px;
  font-weight: 400;
  max-width: 252px;
  margin-top: 10px;

  background: rgba(99, 121, 161, 0.2);
  color: #43fff1;

  &.succeeded {
    color: #8af075;
  }

  &.defeated {
    background: rgba(143, 36, 36, 0.15);
    color: #f76e6e;
  }
`;

export const ImageSrc: { [key: string]: string } = {
  Defeated: DefeatedSrc,
  Succeeded: SucceededSrc,
};

const ViewAllProposalItem: FC<ViewAllProposalItemProps> = ({ proposal }) => {
  const { proposalTitle, timestamp, seconds, status, quorumError } =
    useViewProposalItem(proposal);

  return (
    <Grid item xs={12} key={proposal.id}>
      <ProposalItemWrapper
        to={`/dao/governance/proposal/${proposal.id}`}
        key={proposal.id}
      >
        <ProposalIdTooltip title={proposal.proposalId} placement="top">
          <ProposalItemProposalId>
            Proposal №{" "}
            {proposal.proposalId.substring(0, 4) +
              " ... " +
              proposal.proposalId.slice(-4)}
          </ProposalItemProposalId>
        </ProposalIdTooltip>

        <ProposalItemTitle>{proposalTitle}</ProposalItemTitle>
        {useMemo(
          () =>
            seconds > 0 ? (
              <ProposalItemTimeLeft className={"in-progress"}>
                Voting end in{" "}
                <StakingCountdown timeObject={secondsToTime(seconds)} />
              </ProposalItemTimeLeft>
            ) : (
              <ProposalItemTimeLeft>
                Vote ended at {new Date(timestamp * 1000).toLocaleString()}
              </ProposalItemTimeLeft>
            ),
          [seconds, timestamp]
        )}
        {status && (
          <ProposalItemStatus className={status?.toLowerCase()}>
            {["Defeated", "Succeeded"].includes(status) ? (
              <img src={ImageSrc[status]} alt={status} />
            ) : null}
            {quorumError ? "Voting quorum was not reached" : status}
          </ProposalItemStatus>
        )}
      </ProposalItemWrapper>
    </Grid>
  );
};

export default memo(ViewAllProposalItem);
