import { useState, useEffect, FC, useMemo, memo } from "react";
import {
  Box,
  ButtonBase,
  Pagination,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { formatTime, formattedNum, urls } from "apps/charts/utils";
import { useCurrentCurrency } from "apps/charts/contexts/Application";
import { RowFixed, RowBetween } from "apps/charts/components/Row";
import LocalLoader from "apps/charts/components/LocalLoader";
import Link from "apps/charts/components/Link";
import { Divider, EmptyCard } from "..";
import DropdownSelect from "apps/charts/components/DropdownSelect";
import FormattedName from "apps/charts/components/FormattedName";
import { TableHeaderBox } from "apps/charts/components/Row";

dayjs.extend(utc);

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`;

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`;

export const DashGrid = styled(Box)`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 80px 0.8fr 1.1fr 1.1fr;
  grid-template-areas: "type value txn  time";

  > * {
    &:first-of-type {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 500px) {
    > * {
      &:first-of-type {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 780px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "type value amountToken amountOther txn time";

    > * {
      &:first-of-type {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    max-width: 1320px;
    grid-template-columns: 1fr 1.2fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "type txn value amountToken amountOther account time";
  }
`;

const HeaderWrapper = styled(DashGrid)`
  background: #2c4066;
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

const ClickableText = styled(Typography)`
  color: #fafafa;
  user-select: none;
  text-align: end;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`;

const Flex = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DataText = styled(Flex)`
  align-items: center;
  text-align: right;
  color: #fafafa;
  font-size: 14px;

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const SortText = styled(ButtonBase)<{ active?: boolean }>`
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 500 : 400)};
  margin-right: 0.75rem !important;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  padding: 0;
  color: ${({ active }) => (active ? "#43FFF6" : "#fafafa")};
  outline: none;

  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`;

const SORT_FIELD = {
  VALUE: "amountUSD",
  AMOUNT0: "token0Amount",
  AMOUNT1: "token1Amount",
  TIMESTAMP: "timestamp",
};

export const TXN_TYPE = {
  ALL: "All",
  SWAP: "Swaps",
  ADD: "Adds",
  REMOVE: "Removes",
};

const ITEMS_PER_PAGE = 10;

export function getTransactionType(
  event: any,
  symbol0: string,
  symbol1: string,
  amount0 = "",
  amount1 = "",
  time = ""
) {
  const formattedS0 =
    symbol0?.length > 8 ? symbol0.slice(0, 7) + "..." : symbol0;
  const formattedS1 =
    symbol1?.length > 8 ? symbol1.slice(0, 7) + "..." : symbol1;
  switch (event) {
    case TXN_TYPE.ADD:
      return (
        "Add %amount0 " +
        formattedS0 +
        " and %amount1 " +
        formattedS1 +
        ` ${time}`
      )
        .replace(/%amount0/g, amount0)
        .replace(/%amount1/g, amount1);
    case TXN_TYPE.REMOVE:
      return (
        "Remove %amount0 " +
        formattedS0 +
        " and %amount1 " +
        formattedS1 +
        ` ${time}`
      )
        .replace(/%amount0/g, amount0)
        .replace(/%amount1/g, amount1);
    case TXN_TYPE.SWAP:
      return (
        "Swap %amount0 " +
        formattedS0 +
        " for  %amount1 " +
        formattedS1 +
        ` ${time}`
      )
        .replace(/%amount0/g, amount0)
        .replace(/%amount1/g, amount1);
    default:
      return "";
  }
}

type TxnListProps = {
  transactions: any;
  symbol0Override?: any;
  symbol1Override?: any;
  color?: any;
};

type ListItemProps = { item: any };

const ListItem: FC<ListItemProps> = memo((props) => {
  const { item } = props;
  const [currency] = useCurrentCurrency();
  const below1080 = useMediaQuery("(max-width: 1080px)");
  const below780 = useMediaQuery("(max-width: 780px)");

  return (
    <DashGrid style={{ height: "48px", padding: "0px 1.125rem" }}>
      <DataText fontWeight="500">
        <Link external href={urls.showTransaction(item.hash)}>
          {getTransactionType(item.type, item.token1Symbol, item.token0Symbol)}
        </Link>
      </DataText>
      <DataText justifyContent={"center"}>
        {currency === "XDC"
          ? "Ξ " + formattedNum(item.valueETH)
          : formattedNum(item.amountUSD, true)}
      </DataText>
      {!below780 && (
        <>
          <DataText justifyContent={"center"}>
            {formattedNum(item.token1Amount) + " "}{" "}
            <FormattedName
              text={item.token1Symbol}
              maxCharacters={5}
              margin="0 4px"
            />
          </DataText>
          <DataText justifyContent={"center"}>
            {formattedNum(item.token0Amount) + " "}{" "}
            <FormattedName
              text={item.token0Symbol}
              maxCharacters={5}
              margin="0 4px"
            />
          </DataText>
        </>
      )}
      {!below1080 && (
        <DataText justifyContent={"center"}>
          <Link
            external
            href={"https://xdc.blocksscan.io/address/" + item.account}
          >
            {item.account &&
              item.account.slice(0, 6) + "..." + item.account.slice(38, 42)}
          </Link>
        </DataText>
      )}
      <DataText justifyContent={"center"}>
        <Link external href={"https://xdc.blocksscan.io/txs/" + item.hash}>
          {item.hash && item.hash.slice(0, 6) + "..." + item.hash.slice(38, 42)}
        </Link>
      </DataText>
      <DataText justifyContent={"end"} textAlign={"end"}>
        {formatTime(item.timestamp)}
      </DataText>
    </DashGrid>
  );
});

const TxnList: FC<TxnListProps> = (props) => {
  const { transactions, symbol0Override, symbol1Override } = props;
  // page state
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  // sorting
  const [sortDirection, setSortDirection] = useState(true);
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.TIMESTAMP);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [txFilter, setTxFilter] = useState(TXN_TYPE.ALL);

  useEffect(() => {
    setMaxPage(1); // edit this to do modular
    setPage(1);
  }, [transactions]);

  // parse the txns and format for UI
  useEffect(() => {
    if (
      transactions &&
      transactions.mints &&
      transactions.burns &&
      transactions.swaps
    ) {
      const newTxns: any[] = [];
      if (transactions.mints.length > 0) {
        transactions.mints.map(
          (mint: {
            transaction: { id: any; timestamp: any };
            amount0: any;
            amount1: any;
            to: any;
            pair: any;
            amountUSD: any;
          }) => {
            const newTxn = {
              hash: mint.transaction.id,
              timestamp: mint.transaction.timestamp,
              type: TXN_TYPE.ADD,
              token0Amount: mint.amount0,
              token1Amount: mint.amount1,
              account: mint.to,
              token0Symbol: mint.pair.token0.symbol,
              token1Symbol: mint.pair.token1.symbol,
              amountUSD: mint.amountUSD,
            };
            return newTxns.push(newTxn);
          }
        );
      }
      if (transactions.burns.length > 0) {
        transactions.burns.map(
          (burn: {
            transaction: { id: any; timestamp: any };
            amount0: any;
            amount1: any;
            sender: any;
            pair: { token0: { symbol: any }; token1: { symbol: any } };
            amountUSD: any;
          }) => {
            const newTxn = {
              hash: burn.transaction.id,
              timestamp: burn.transaction.timestamp,
              type: TXN_TYPE.REMOVE,
              token0Amount: burn.amount0,
              token1Amount: burn.amount1,
              account: burn.sender,
              token0Symbol: burn.pair.token0.symbol,
              token1Symbol: burn.pair.token1.symbol,
              amountUSD: burn.amountUSD,
            };
            return newTxns.push(newTxn);
          }
        );
      }
      if (transactions.swaps.length > 0) {
        transactions.swaps.map(
          (swap: {
            amount0In: number;
            amount0Out: number;
            amount1In: number;
            amount1Out: number;
            pair: any;
            transaction: { id: any; timestamp: any };
            amountUSD: any;
            to: any;
          }) => {
            const netToken0 = swap.amount0In - swap.amount0Out;
            const netToken1 = swap.amount1In - swap.amount1Out;

            const newTxn = {
              token0Symbol: "",
              token1Symbol: "",
              token0Amount: 0,
              token1Amount: 0,
              hash: undefined,
              timestamp: undefined,
              type: "",
              amountUSD: undefined,
              account: "",
            };

            if (netToken0 < 0) {
              newTxn.token0Symbol = swap.pair.token0.symbol;
              newTxn.token1Symbol = swap.pair.token1.symbol;
              newTxn.token0Amount = Math.abs(netToken0);
              newTxn.token1Amount = Math.abs(netToken1);
            } else if (netToken1 < 0) {
              newTxn.token0Symbol = swap.pair.token1.symbol;
              newTxn.token1Symbol = swap.pair.token0.symbol;
              newTxn.token0Amount = Math.abs(netToken1);
              newTxn.token1Amount = Math.abs(netToken0);
            }

            newTxn.hash = swap.transaction.id;
            newTxn.timestamp = swap.transaction.timestamp;
            newTxn.type = TXN_TYPE.SWAP;

            newTxn.amountUSD = swap.amountUSD;
            newTxn.account = swap.to;
            return newTxns.push(newTxn);
          }
        );
      }

      const filtered = newTxns.filter((item) => {
        if (txFilter !== TXN_TYPE.ALL) {
          return item.type === txFilter;
        }
        return true;
      });
      setFilteredItems(filtered);
      let extraPages = 1;
      if (filtered.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0;
      }
      if (filtered.length === 0) {
        setMaxPage(1);
      } else {
        setMaxPage(Math.floor(filtered.length / ITEMS_PER_PAGE) + extraPages);
      }
    }
  }, [transactions, txFilter]);

  useEffect(() => {
    setPage(1);
  }, [txFilter]);

  const filteredList = useMemo(
    () =>
      filteredItems &&
      filteredItems
        .sort((a, b) => {
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1;
        })
        .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE),
    [filteredItems, sortDirection, page, sortedColumn]
  );

  const below1080 = useMediaQuery("(max-width: 1080px)");
  const below780 = useMediaQuery("(max-width: 780px)");

  return (
    <>
      <Box mb={4}>
        {below780 ? (
          <RowBetween>
            <DropdownSelect
              options={TXN_TYPE}
              active={txFilter}
              setActive={setTxFilter}
              color={"#5a81ff"}
              shadow={"0 0 8px #003cff"}
            />
          </RowBetween>
        ) : (
          <RowFixed pl={4}>
            <SortText
              onClick={() => {
                setTxFilter(TXN_TYPE.ALL);
              }}
              active={txFilter === TXN_TYPE.ALL}
            >
              All
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TXN_TYPE.SWAP);
              }}
              active={txFilter === TXN_TYPE.SWAP}
            >
              Swaps
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TXN_TYPE.ADD);
              }}
              active={txFilter === TXN_TYPE.ADD}
            >
              Adds
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TXN_TYPE.REMOVE);
              }}
              active={txFilter === TXN_TYPE.REMOVE}
            >
              Removes
            </SortText>
          </RowFixed>
        )}
      </Box>
      <HeaderWrapper
        style={{ height: "fit-content", padding: "0 1.125rem 1rem" }}
      >
        <Flex justifyContent={"flex-start"}>
          <TableHeaderBox>Type</TableHeaderBox>
        </Flex>
        <Flex>
          <ClickableText
            color="textDim"
            onClick={() => {
              setSortedColumn(SORT_FIELD.VALUE);
              setSortDirection(
                sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection
              );
            }}
          >
            <TableHeaderBox>
              Value{" "}
              {sortedColumn === SORT_FIELD.VALUE
                ? !sortDirection
                  ? "↑"
                  : "↓"
                : ""}
            </TableHeaderBox>
          </ClickableText>
        </Flex>
        {!below780 && (
          <Flex>
            <ClickableText
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.AMOUNT0);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.AMOUNT0 ? true : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                {symbol0Override ? symbol0Override + " Amount" : "Token Amount"}{" "}
                {sortedColumn === SORT_FIELD.AMOUNT0
                  ? sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHeaderBox>
            </ClickableText>
          </Flex>
        )}
        <>
          {!below780 && (
            <Flex>
              <ClickableText
                color="textDim"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.AMOUNT1);
                  setSortDirection(
                    sortedColumn !== SORT_FIELD.AMOUNT1 ? true : !sortDirection
                  );
                }}
              >
                <TableHeaderBox>
                  {symbol1Override
                    ? symbol1Override + " Amount"
                    : "Token Amount"}{" "}
                  {sortedColumn === SORT_FIELD.AMOUNT1
                    ? sortDirection
                      ? "↑"
                      : "↓"
                    : ""}
                </TableHeaderBox>
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex>
              <TableHeaderBox>Account</TableHeaderBox>
            </Flex>
          )}
          <Flex>
            <TableHeaderBox>Transaction</TableHeaderBox>
          </Flex>
          <Flex>
            <ClickableText
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.TIMESTAMP);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.TIMESTAMP ? true : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                Time{" "}
                {sortedColumn === SORT_FIELD.TIMESTAMP
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHeaderBox>
            </ClickableText>
          </Flex>
        </>
      </HeaderWrapper>
      <List p={0}>
        {!filteredList ? (
          <LocalLoader />
        ) : filteredList.length === 0 ? (
          <EmptyCard>No recent transactions found.</EmptyCard>
        ) : (
          filteredList.map((item, index) => {
            return (
              <div key={index}>
                <ListItem key={index} item={item} />
                <Divider />
              </div>
            );
          })
        )}
      </List>
      {maxPage > 1 && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(maxPage)}
            page={page}
            onChange={(event, page) => setPage(page)}
          />
        </PaginationWrapper>
      )}
    </>
  );
};

export default memo(TxnList);
