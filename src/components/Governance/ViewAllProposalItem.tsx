import { FC, memo, useMemo } from "react";
import { Box, Tooltip } from "@mui/material";

import { styled } from "@mui/material/styles";
import { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";

import StakingCountdown from "components/Staking/StakingCountdown";
import { secondsToTime } from "utils/secondsToTime";
import useViewProposalItem from "hooks/Governance/useViewProposalItem";
import { IProposal } from "fathom-sdk";

import { ProposalStatus } from "utils/Constants";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RecommendIcon from "@mui/icons-material/Recommend";
import { BasePaper } from "components/Base/Paper/StyledPaper";
import { useNavigate } from "react-router-dom";
import useSharedContext from "../../context/shared";

type ViewAllProposalItemProps = {
  proposal: IProposal;
  index: number;
};

const ProposalItemWrapper = styled(BasePaper)`
  cursor: pointer;
  padding: 16px 18px;
  & .MuiListItemButton-root {
    padding: 8px 16px;
  }

  &:hover {
    background: #2a3e5a;
  }
`;

const ProposalIdTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#2a3e5a",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    background: "#2a3e5a",
    boxShadow: "0 12px 32px 0 rgba(0, 7, 21, 0.5)",
    color: "#fff",
  },
}));

const ProposalLabel = styled(Box)`
  color: #b7c8e5;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  margin-top: 10px;
`;

const ProposalValue = styled(Box)`
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;

const ProposalItemProposalId = styled(Box)`
  color: #b7c8e5;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;

const ProposalItemTimeLeft = styled(Box)`
  color: #6379a1;
  margin-top: -4px;
  font-size: 14px;
  padding-top: 4px;
  &.in-progress {
    color: #f5953d;
  }
`;

export const ProposalItemStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status",
})<{
  status: ProposalStatus;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  background: rgba(79, 101, 140, 0.2);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  padding: 4px 8px;

  ${({ status }) =>
    status === ProposalStatus.Executed &&
    `background: rgba(79, 101, 140, 0.20); color: #8AF075;`}
  ${({ status }) =>
    (status === ProposalStatus.OpenToVote ||
      status === ProposalStatus.Pending) &&
    "color:  #F0EB75; background: rgba(240, 235, 117, 0.25);"}
  ${({ status }) =>
    status === ProposalStatus.Succeeded && "color: rgb(138, 240, 117);"}
  ${({ status }) =>
    (status === ProposalStatus.Expired || status === ProposalStatus.Defeated) &&
    "background: rgba(143, 36, 36, 0.25); color: #F76E6E;"}
`;

export const StatusIcon: FC<{ status: ProposalStatus }> = ({ status }) => {
  switch (status) {
    case ProposalStatus.Succeeded:
      return <CheckCircleIcon sx={{ width: "16px" }} />;
    case ProposalStatus.Defeated:
      return <CancelRoundedIcon sx={{ width: "16px" }} />;
    case ProposalStatus.OpenToVote:
      return <RecommendIcon sx={{ width: "16px" }} />;
    default:
      return null;
  }
};

const ViewAllProposalItem: FC<ViewAllProposalItemProps> = ({ proposal }) => {
  const {
    proposalTitle,
    proposalDescription,
    timestamp,
    seconds,
    status,
    quorumError,
  } = useViewProposalItem(proposal);
  const { isMobile } = useSharedContext();

  const navigate = useNavigate();

  return (
    <ProposalItemWrapper
      key={proposal.id}
      onClick={() => navigate(`/dao/governance/proposal/${proposal.id}`)}
    >
      <BaseFlexBox width={"100%"}>
        <ProposalIdTooltip title={proposal.proposalId} placement="top">
          <ProposalItemProposalId>
            #
            {proposal.proposalId.substring(0, 4) +
              " ... " +
              proposal.proposalId.slice(-4)}
          </ProposalItemProposalId>
        </ProposalIdTooltip>
        <BaseFlexBox>
          {status && (
            <ProposalItemStatus status={status}>
              <StatusIcon status={status} />
              {quorumError && !isMobile
                ? "Voting quorum was not reached"
                : status}
            </ProposalItemStatus>
          )}
          {useMemo(
            () =>
              seconds > 0 ? (
                <ProposalItemTimeLeft className={"in-progress"}>
                  Voting end in{" "}
                  <StakingCountdown timeObject={secondsToTime(seconds)} />
                </ProposalItemTimeLeft>
              ) : null,
            [seconds, timestamp]
          )}
        </BaseFlexBox>
      </BaseFlexBox>
      <ProposalLabel>Title</ProposalLabel>
      <ProposalValue>{proposalTitle}</ProposalValue>
      <ProposalLabel>Description</ProposalLabel>
      <ProposalValue>{proposalDescription}</ProposalValue>
    </ProposalItemWrapper>
  );
};

export default memo(ViewAllProposalItem);
