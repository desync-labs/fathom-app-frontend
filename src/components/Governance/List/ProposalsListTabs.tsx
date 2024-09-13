import { FC, memo } from "react";
import { Box, styled } from "@mui/material";
import {
  AppNavItem,
  AppNavWrapper,
} from "components/AppComponents/AppTabs/AppTabs";
import { ProposalsTabs } from "hooks/Governance/useAllProposals";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import { useNavigate } from "react-router-dom";

const ViewAllProposalsTabsWrapper = styled(AppNavWrapper)`
  width: 100%;
  padding-bottom: 10px;
  justify-content: space-between;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding-bottom: 3px;
  }
`;

const ViewAllProposalsTabsItem = styled(AppNavItem)`
  &.active {
    color: #fff;
    border: none;
    border-radius: 8px;
    background: #3d5580;
    padding: 8px 16px;
    ${({ theme }) => theme.breakpoints.down("sm")} {
      padding: 6px 12px;
    }
  }
`;

const AddProposalButton = styled(ButtonPrimary)`
  float: right;
  padding: 8px 40px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 8px 10px;
    height: 32px;
  }
`;

const TabWrapper = styled(Box)`
  display: flex;
`;

export const AddProposalBtnComponent = () => {
  const navigate = useNavigate();
  return (
    <AddProposalButton
      onClick={() => navigate("/dao/governance/proposal/create")}
    >
      <AddCircleIcon
        sx={{
          color: "#005C55",
          fontSize: "16px",
          marginRight: "7px",
        }}
      />
      Create a proposal
    </AddProposalButton>
  );
};

const ProposalsListTabs: FC<{
  tab: ProposalsTabs;
}> = ({ tab }) => {
  const navigate = useNavigate();

  return (
    <ViewAllProposalsTabsWrapper>
      <TabWrapper>
        <ViewAllProposalsTabsItem
          onClick={() => navigate("/dao/governance")}
          className={tab === ProposalsTabs.PROPOSALS ? "active" : ""}
        >
          Proposals
        </ViewAllProposalsTabsItem>
        <ViewAllProposalsTabsItem
          onClick={() => navigate("/dao/governance/drafts")}
          className={tab === ProposalsTabs.DRAFTS ? "active" : ""}
        >
          Drafts
        </ViewAllProposalsTabsItem>
      </TabWrapper>
      {tab !== ProposalsTabs.DRAFTS && <AddProposalBtnComponent />}
    </ViewAllProposalsTabsWrapper>
  );
};

export default memo(ProposalsListTabs);
