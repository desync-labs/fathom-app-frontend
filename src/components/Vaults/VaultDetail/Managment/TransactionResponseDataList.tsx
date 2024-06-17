import { FC } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItemText,
  styled,
} from "@mui/material";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const EventsListAccordion = styled(Accordion)`
  padding-right: 0 !important;

  & .MuiAccordionSummary-root {
    min-height: 40px;
  }
`;
const EventsListItem = styled(AppListItem)`
  & .MuiListItemSecondaryAction-root {
    max-width: 70%;
  }
`;

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
    } else if (res === null) {
      return "null";
    } else if (key === "events" || key === "logs") {
      return renderLogsEvents(res);
    } else if (typeof res === "object") {
      return JSON.stringify(res);
    }

    return null;
  };

  const renderLogsEvents = (eventList: any) => {
    return eventList.map((event: any, index: number) => {
      return (
        <EventsListAccordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {event.logIndex}
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(event).map(([key, value]) => (
              <AppList key={key}>
                <EventsListItem
                  secondaryAction={<Box>{renderResponseItem(key, value)}</Box>}
                >
                  <ListItemText primary={<Box>{key.toString()}</Box>} />
                </EventsListItem>
              </AppList>
            ))}
          </AccordionDetails>
        </EventsListAccordion>
      );
    });
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
