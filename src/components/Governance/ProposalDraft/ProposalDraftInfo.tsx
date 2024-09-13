import { BasePaper } from "components/Base/Paper/StyledPaper";
import {
  Box,
  Divider,
  ListItem,
  styled,
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  ListItemLabel,
  ListItemValue,
  ProposalInfoList,
  ProposalTitle,
} from "components/Governance/Proposal/ProposalInfo";
import useProposalDraftItem from "hooks/Governance/useProposalDraftItem";

import { htmlToComponent, stripTags } from "utils/htmlToComponent";
import { ZERO_ADDRESS } from "utils/Constants";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "components/AppComponents/AppButton/AppButton";

import TrashIcon from "assets/svg/Trash.svg";
import { useNavigate } from "react-router-dom";
import ProposalDraftDelete from "./ProposalDraftDelete";

const ProposalTitleDraft = styled(ProposalTitle)`
  justify-content: space-between;
  display: flex;
  align-items: center;
  height: 28px;
`;

const ButtonsWrapper = styled(Box)`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SubmitProposalBtn = styled(ButtonPrimary)`
  height: 24px;
  border-radius: 4px;
  font-size: 12px;
`;

const EditProposalBtn = styled(ButtonSecondary)`
  height: 24px;
  padding: 8px;
  font-size: 12px;
`;

const ProposalDraftInfo = () => {
  const {
    _proposalId,
    draftProposal,
    onSubmit,
    isLoading,
    deleteProposal,
    setDeleteProposal,
  } = useProposalDraftItem();
  const navigate = useNavigate();

  return (
    <BasePaper>
      <ProposalTitleDraft>
        {draftProposal?.descriptionTitle}
        <ButtonsWrapper>
          <SubmitProposalBtn onClick={onSubmit}>
            {isLoading ? <CircularProgress size={20} /> : "Submit proposal"}
          </SubmitProposalBtn>
          <EditProposalBtn
            onClick={() =>
              navigate(`/dao/governance/proposal/create/${draftProposal?.id}`)
            }
          >
            Edit
          </EditProposalBtn>
          <IconButton
            sx={{ marginLeft: "-8px" }}
            onClick={() => setDeleteProposal(true)}
          >
            <img src={TrashIcon} width={16} height={20} alt={"Trash icon"} />
          </IconButton>
        </ButtonsWrapper>
      </ProposalTitleDraft>
      <Divider sx={{ borderColor: "#2C4066", marginY: "16px" }} />
      <ProposalInfoList>
        {stripTags(draftProposal?.description) && (
          <ListItem>
            <ListItemLabel>Description</ListItemLabel>
            <ListItemValue>
              {" "}
              {htmlToComponent(draftProposal?.description)}
            </ListItemValue>
          </ListItem>
        )}

        {draftProposal.actions &&
          draftProposal.actions.length &&
          draftProposal.actions[0].target !== ZERO_ADDRESS &&
          draftProposal.actions[0].target.trim() && (
            <>
              <ListItem>
                <ListItemLabel>Targets: </ListItemLabel>
                <ListItemValue>
                  {draftProposal.actions.map((item) => item.target).join(", ")}
                </ListItemValue>
              </ListItem>
              <ListItem>
                <ListItemLabel>Values: </ListItemLabel>
                <ListItemValue>
                  {draftProposal.actions.map((item) => item.value).join(", ")}
                </ListItemValue>
              </ListItem>
              <ListItem>
                <ListItemLabel>Call Data: </ListItemLabel>
                <ListItemValue>
                  {draftProposal.actions
                    .map((item) => item.callData)
                    .join(", ")}
                </ListItemValue>
              </ListItem>
            </>
          )}
      </ProposalInfoList>
      {deleteProposal && (
        <ProposalDraftDelete
          proposalId={_proposalId as string}
          draftProposal={draftProposal}
          onClose={() => setDeleteProposal(false)}
        />
      )}
    </BasePaper>
  );
};

export default ProposalDraftInfo;
