import { FC, memo } from "react";
import { useCopyClipboard } from "apps/charts/hooks";
import { Box, styled, Typography } from "@mui/material";
import { StyledIcon } from "apps/charts/components";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const CopyIcon = styled(Box)`
  color: #aeaeae;
  flex-shrink: 0;
  margin-right: 1rem;
  margin-left: 0.5rem;
  margin-bottom: 3px;
  text-decoration: none;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    opacity: 0.8;
    cursor: pointer;
  }
`;
const TransactionStatusText = styled(Typography)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: black;
`;

type CopyHelperProps = { toCopy: any };

const CopyHelper: FC<CopyHelperProps> = (props) => {
  const { toCopy } = props;
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <CopyIcon onClick={() => setCopied(toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <StyledIcon>
            <TaskAltIcon style={{ width: "15px", height: "15px" }} />
          </StyledIcon>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <StyledIcon>
            <ContentCopyIcon style={{ width: "15px", height: "15px" }} />
          </StyledIcon>
        </TransactionStatusText>
      )}
    </CopyIcon>
  );
};

export default memo(CopyHelper);
