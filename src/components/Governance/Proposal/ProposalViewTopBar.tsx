import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Breadcrumbs, Chip, IconButton } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import { useNavigate } from "react-router-dom";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import useProposalContext from "context/proposal";

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

const ProposalViewTopBar: FC = () => {
  const navigate = useNavigate();
  const { fetchedProposal } = useProposalContext();

  return (
    <BaseFlexBox sx={{ marginBottom: "25px" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ color: "#6D86B2" }}
      >
        <StyledBreadcrumb
          label="Proposals"
          onClick={() => navigate("/dao/governance/")}
        />
        <StyledBreadcrumb
          label={`Proposal #${fetchedProposal?.proposalId}`}
          className="disabled"
        />
      </Breadcrumbs>
      <ButtonGroup>
        <IconButton>
          <StarOutlineRoundedIcon sx={{ color: "#6D86B2", width: "22px" }} />
        </IconButton>
        <IconButton>
          <OpenInNewRoundedIcon sx={{ color: "#6D86B2", width: "18px" }} />
        </IconButton>
      </ButtonGroup>
    </BaseFlexBox>
  );
};

export default ProposalViewTopBar;
