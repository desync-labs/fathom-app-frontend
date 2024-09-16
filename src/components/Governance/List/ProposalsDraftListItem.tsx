import { FC } from "react";
import { BaseTableItemRow } from "components/Base/Table/StyledTable";
import { Stack, TableCell } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProposalsDraftListItem: FC<{ proposal: any }> = ({ proposal }) => {
  const navigate = useNavigate();
  return (
    <BaseTableItemRow
      onClick={() => navigate(`/dao/governance/drafts/${proposal.id}`)}
      sx={{ cursor: "pointer" }}
    >
      <TableCell>
        <Stack direction="row" spacing={2}>
          <div>{proposal.descriptionTitle}</div>
        </Stack>
      </TableCell>
      <TableCell>{new Date(proposal.created).toLocaleString()}</TableCell>
    </BaseTableItemRow>
  );
};

export default ProposalsDraftListItem;
