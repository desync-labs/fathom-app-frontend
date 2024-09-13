import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const useProposalDraftItem = () => {
  const { _proposalId } = useParams();
  const [draftProposal, setDraftProposal] = useState<any>({});

  useEffect(() => {
    const drafts = localStorage.getItem("draftProposals") || "[]";
    const draftProposal =
      JSON.parse(drafts).find((proposal: any) => proposal.id === _proposalId) ||
      {};

    setDraftProposal(draftProposal);
  }, [setDraftProposal, _proposalId]);

  return {
    _proposalId,
    draftProposal,
  };
};

export default useProposalDraftItem;
