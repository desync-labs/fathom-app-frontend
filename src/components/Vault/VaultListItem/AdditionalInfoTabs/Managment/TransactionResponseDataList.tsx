import { FC } from "react";
import { Box, ListItemText } from "@mui/material";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";

interface TransactionReceipt {
  to: string;
  from: string;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  cumulativeGasUsed: {
    type: string;
    hex: string;
  };
  gasUsed: {
    type: string;
    hex: string;
  };
  contractAddress?: string;
  logs: any[];
  status: boolean;
}

type TransactionResponseDataListProps = {
  transactionResponseData: TransactionReceipt;
};

const TransactionResponseDataList: FC<TransactionResponseDataListProps> = ({
  transactionResponseData,
}) => {
  const entries = Object.entries(transactionResponseData);

  const renderResponseItem = (key: string, res: any) => {
    if (typeof res === "string") {
      return res;
    } else if (typeof res === "number" || typeof res === "boolean") {
      return res.toString();
    } else if (key === "gasUsed" || key === "cumulativeGasUsed") {
      return res.toString();
    } else if (typeof res === "object") {
      return JSON.stringify(res);
    }

    return null;
  };

  return (
    <AppList>
      {entries.map(([key, value]) => (
        <AppListItem
          key={key}
          secondaryAction={<Box>{renderResponseItem(key, value)}</Box>}
          sx={{ "& .MuiListItemSecondaryAction-root": { maxWidth: "70%" } }}
        >
          <ListItemText primary={<Box>{key.toString()}</Box>} />
        </AppListItem>
      ))}
    </AppList>
  );
};

export default TransactionResponseDataList;
