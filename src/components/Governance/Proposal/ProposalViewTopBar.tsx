import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Breadcrumbs, Chip } from "@mui/material";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import { useNavigate } from "react-router-dom";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useProposalContext from "context/proposal";
import useSharedContext from "context/shared";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

const StyledBreadcrumb = styled(Chip)(() => {
  return {
    fontFamily: "Inter",
    backgroundColor: "transparent",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
    color: "#fff",
    cursor: "pointer",
    "&.disabled": {
      color: "#6D86B2",
      cursor: "default",
    },
    "&:active": {
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
    span: {
      padding: 0,
    },
  };
}) as typeof Chip;

export enum ProposalViewTopBarVariant {
  Proposal = "Proposal",
  DraftProposal = "DraftProposal",
}

const ProposalViewTopBar: FC<{
  variant?: ProposalViewTopBarVariant;
  isLoading?: boolean;
}> = ({ variant = ProposalViewTopBarVariant.Proposal, isLoading = false }) => {
  const navigate = useNavigate();
  const { fetchedProposal } = useProposalContext();
  const { isMobile } = useSharedContext();

  return (
    <BaseFlexBox sx={{ marginBottom: "25px" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ color: "#6D86B2" }}
      >
        {variant === ProposalViewTopBarVariant.Proposal ? (
          <StyledBreadcrumb
            label="Proposals"
            onClick={() => navigate("/dao/governance")}
          />
        ) : (
          <StyledBreadcrumb
            label="Drafts"
            onClick={() => navigate("/dao/governance/drafts")}
          />
        )}
        {variant === ProposalViewTopBarVariant.Proposal ? (
          isLoading ? (
            <CustomSkeleton animation={"wave"} width={300} height={20} />
          ) : (
            <StyledBreadcrumb
              label={`Proposal #${
                isMobile
                  ? fetchedProposal.proposalId?.substring(0, 4) +
                    " ... " +
                    fetchedProposal.proposalId?.slice(-4)
                  : fetchedProposal?.proposalId
              }`}
              className="disabled"
            />
          )
        ) : (
          <StyledBreadcrumb label={"Overview"} className="disabled" />
        )}
      </Breadcrumbs>
    </BaseFlexBox>
  );
};

export default ProposalViewTopBar;
