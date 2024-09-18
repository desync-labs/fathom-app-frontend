import { FC, useCallback } from "react";
import { DialogContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import useSharedContext from "context/shared";
import { ButtonsWrapper } from "components/Staking/Dialog/ClaimRewardsDialog";
import { BaseDialogTitle } from "components/Base/Dialog/BaseDialogTitle";
import {
  BaseDialogDescription,
  BaseDialogWrapperLight,
} from "components/Base/Dialog/StyledDialog";
import {
  BaseButtonPrimary,
  BaseCancelButton,
} from "components/Base/Buttons/StyledButtons";
import { deleteDraftProposal, getDraftProposals } from "utils/draftProposal";
import { useNavigate } from "react-router-dom";
import useAlertAndTransactionContext from "context/alertAndTransaction";
import { CreateProposalType } from "hooks/Governance/useCreateProposal";

const ConfirmButton = styled(BaseButtonPrimary)`
  font-size: 17px;
`;

type ProposalDraftDeleteProps = {
  proposalId: string;
  draftProposal: CreateProposalType;
  onClose: () => void;
};

const ProposalDraftDelete: FC<ProposalDraftDeleteProps> = ({
  proposalId,
  draftProposal,
  onClose,
}) => {
  const { isMobile } = useSharedContext();
  const navigate = useNavigate();
  const { setShowSuccessAlertHandler } = useAlertAndTransactionContext();

  const onDelete = useCallback(() => {
    deleteDraftProposal(proposalId);
    const draftProposals = getDraftProposals();
    setShowSuccessAlertHandler(
      true,
      `Draft proposal ${draftProposal.descriptionTitle} deleted successfully.`
    );
    navigate(
      draftProposals.length ? "/dao/governance/drafts" : "/dao/governance"
    );
  }, []);

  return (
    <BaseDialogWrapperLight
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="sm"
    >
      <BaseDialogTitle id="customized-dialog-title" onClose={onClose}>
        Delete Draft Proposal
      </BaseDialogTitle>

      <DialogContent>
        <BaseDialogDescription>
          Delete draft proposal {draftProposal?.descriptionTitle}?
        </BaseDialogDescription>
        <ButtonsWrapper>
          {!isMobile && (
            <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
          )}
          <ConfirmButton onClick={onDelete}>Delete</ConfirmButton>
          {isMobile && (
            <BaseCancelButton onClick={onClose}>Cancel</BaseCancelButton>
          )}
        </ButtonsWrapper>
      </DialogContent>
    </BaseDialogWrapperLight>
  );
};

export default ProposalDraftDelete;
