import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import {
  Box,
  Container,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import useSharedContext from "context/shared";
import usePositionsTransactionList from "hooks/usePositionsTransactionList";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import PositionsTransactionFilters from "components/PositionsTxList/PositionsTransactionFilters";
import {
  ButtonSecondary,
  ExtLinkIcon,
} from "components/AppComponents/AppButton/AppButton";

const PageHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px;
  margin-top: 48px;
  margin-bottom: 48px;
`;

const TxListWrapper = styled(AppPaper)`
  border: 1px solid rgb(29, 45, 73);
  background: rgb(19, 31, 53);
  padding: 16px 24px;
`;

const PositionsTransactionList = () => {
  const {
    userTxList,
    filterByType,
    handleFilterByType,
    serachValue,
    setSearchValue,
  } = usePositionsTransactionList();
  const { isMobile } = useSharedContext();

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <PageHeader>
        <Typography variant="h1">Transaction history</Typography>
      </PageHeader>
      <TxListWrapper>
        <Typography variant="h3">Transactions</Typography>
        {userTxList && userTxList.length > 0 && (
          <>
            <PositionsTransactionFilters
              filterByType={filterByType}
              handleFilterByType={handleFilterByType}
              searchValue={serachValue}
              setSearchValue={setSearchValue}
            />
            <AppList>
              {userTxList.map((transaction) => (
                <AppListItem
                  key={transaction.id}
                  secondaryAction={
                    <ButtonSecondary>
                      View
                      <ExtLinkIcon />
                    </ButtonSecondary>
                  }
                  sx={{ borderTop: "1px solid #1d2d49" }}
                >
                  <ListItemText
                    primary={transaction.type}
                    secondary={dayjs(transaction.timestamp * 1000).format(
                      "DD/MM/YYYY HH:mm:ss"
                    )}
                  />
                  <ListItemText
                    primary={
                      transaction.amount
                        ? new BigNumber(transaction.amount)
                            .dividedBy(10 ** 18)
                            .toFormat(2) + " FXD"
                        : "-"
                    }
                  />
                </AppListItem>
              ))}
            </AppList>
          </>
        )}
      </TxListWrapper>
    </Container>
  );
};

export default PositionsTransactionList;
