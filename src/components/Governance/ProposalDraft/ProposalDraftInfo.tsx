import { BasePaper } from "components/Base/Paper/StyledPaper";
import { Divider, ListItem } from "@mui/material";

import {
  ListItemLabel,
  ListItemValue,
  ProposalInfoList,
  ProposalTitle,
} from "components/Governance/Proposal/ProposalInfo";
import useProposalDraftItem from "hooks/Governance/useProposalDraftItem";

import { htmlToComponent, stripTags } from "utils/htmlToComponent";
import { ZERO_ADDRESS } from "utils/Constants";

const ProposalDraftInfo = () => {
  const { draftProposal } = useProposalDraftItem();

  return (
    <BasePaper>
      <ProposalTitle>{draftProposal?.descriptionTitle}</ProposalTitle>
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

        {draftProposal.targets &&
          draftProposal.targets.length &&
          draftProposal.targets[0] !== ZERO_ADDRESS && (
            <>
              <ListItem>
                <ListItemLabel>Targets: </ListItemLabel>
                <ListItemValue>
                  {draftProposal.targets.join(", ")}
                </ListItemValue>
              </ListItem>
              <ListItem>
                <ListItemLabel>Values: </ListItemLabel>
                <ListItemValue>{draftProposal.values.join(", ")}</ListItemValue>
              </ListItem>
              <ListItem>
                <ListItemLabel>Call Data: </ListItemLabel>
                <ListItemValue>
                  {draftProposal.calldatas.join(", ")}
                </ListItemValue>
              </ListItem>
            </>
          )}
      </ProposalInfoList>
    </BasePaper>
  );
};

export default ProposalDraftInfo;
