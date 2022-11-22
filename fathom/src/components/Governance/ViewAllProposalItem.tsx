import React, { FC, memo, useMemo } from "react";
import { Box, Grid, Tooltip } from "@mui/material";
import IProposal from "stores/interfaces/IProposal";
import { styled } from "@mui/material/styles";
import { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";

import DefeatedSrc from "assets/svg/rejected.svg";
import SucceededSrc from "assets/svg/succeeded.svg";
import { Link } from "react-router-dom";

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
))(({ theme }) => ({
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
  color: #6379A1;
  margin-top: -4px;
  font-size: 14px;
  &.in-progress {
    color: #F5953D;
  }
`

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
  max-width: 110px;
  margin-top: 10px;

  background: rgba(99, 121, 161, 0.2);
  color: #43FFF1;

  &.succeeded {
    color: #8AF075;
  }

  &.defeated {
    background: rgba(143, 36, 36, 0.15);
    color: #F76E6E;
  }
`

export const ImageSrc: { [key: string]: string } = {
  Defeated: DefeatedSrc,
  Succeeded: SucceededSrc,
};

const ViewAllProposalItem: FC<ViewAllProposalItemProps> = ({
  proposal,
  index,
}) => {

  const proposalTitle = useMemo(() => {
    const title = proposal.description.split("----------------")[0];
    return title.substring(0, 50) + (title.length > 50 ? "... " : "");
  }, [proposal.description]);

  return (
    <Grid item xs={12} key={proposal.proposalId}>
      <ProposalItemWrapper to={`/proposal/${proposal.proposalId}`} key={proposal.proposalId}>
        <ProposalIdTooltip title={proposal.proposalId} placement="top">
          <ProposalItemProposalId>
            Proposal № {proposal.proposalId.substring(0, 4) +
              " ... " +
              proposal.proposalId.slice(-4)}
          </ProposalItemProposalId>
        </ProposalIdTooltip>

        <ProposalItemTitle>{proposalTitle}</ProposalItemTitle>
        <ProposalItemTimeLeft className={index === 1 ? "in-progress" : ""}>
          Vote ended at 2022-10-07 05:12 UAE
        </ProposalItemTimeLeft>
        <ProposalItemStatus className={proposal.status?.toLowerCase()}>
          {["Defeated", "Succeeded"].includes(proposal.status) ? (
            <img src={ImageSrc[proposal.status]} alt={proposal.status} />
          ) : null}
          {proposal.status}
        </ProposalItemStatus>
      </ProposalItemWrapper>
    </Grid>
  );
};

export default memo(ViewAllProposalItem);
