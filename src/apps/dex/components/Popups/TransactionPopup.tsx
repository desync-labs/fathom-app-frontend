import { FC } from "react";
import { styled } from "@mui/material";

import { useActiveWeb3React } from "apps/dex/hooks";
import { TYPE } from "apps/dex/theme";
import { ExternalLink } from "apps/dex/theme/components";
import { getBlockScanLink } from "apps/dex/utils";
import { AutoColumn } from "apps/dex/components/Column";
import { AutoRow } from "apps/dex/components/Row";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`;

type TransactionPopupProps = {
  hash: string;
  success?: boolean;
  summary?: string;
};

const TransactionPopup: FC<TransactionPopupProps> = ({
  hash,
  success,
  summary,
}) => {
  const { chainId } = useActiveWeb3React();

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <TaskAltIcon
            sx={{ color: "#27AE60", width: "24px", height: "24px" }}
          />
        ) : (
          <ErrorOutlineIcon
            sx={{ color: "#FD4040", width: "24px", height: "24px" }}
          />
        )}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>
          {summary ?? "Hash: " + hash.slice(0, 8) + "..." + hash.slice(58, 65)}
        </TYPE.body>
        {chainId && (
          <ExternalLink href={getBlockScanLink(chainId, hash, "transaction")}>
            View on Blocksscan
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  );
};

export default TransactionPopup;
