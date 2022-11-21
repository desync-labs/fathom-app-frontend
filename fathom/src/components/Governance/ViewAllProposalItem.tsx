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

const ProposalItemWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 20px;
  gap: 15px;
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
`;

const ProposalItemProposalId = styled(Link)`
  color: #9fadc6;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  text-decoration: none;
`;

const ProposalItemTimeLeft = styled(Box)(({ theme }) => ({
  color: "#6379A1",
  marginTop: "-12px",
  fontSize: "14px",
  "&.in-progress": {
    color: "#F5953D",
  },
}));

export const ProposalItemStatus = styled(Box)(({ theme }) => ({
  borderRadius: "6px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "4px 8px",
  gap: "4px",
  fontSize: "14px",
  fontWeight: 400,
  maxWidth: "110px",

  background: "rgba(99, 121, 161, 0.2)",
  color: "#43FFF1",

  "&.succeeded": {
    color: "#8AF075",
  },

  "&.defeated": {
    background: "rgba(143, 36, 36, 0.15)",
    color: "#F76E6E",
  },
}));

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
      <ProposalItemWrapper key={proposal.proposalId}>
        <ProposalIdTooltip title={proposal.proposalId} placement="top">
          <ProposalItemProposalId to={`/proposal/${proposal.proposalId}`}>
            {proposal.proposalId.substring(0, 4) +
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
