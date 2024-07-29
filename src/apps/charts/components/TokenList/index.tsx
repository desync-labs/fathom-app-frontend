import { useState, useEffect, useMemo, FC, memo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  Box,
  Pagination,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";

import TokenLogo from "apps/charts/components/TokenLogo";
import { CustomLink } from "apps/charts/components/Link";
import Row from "apps/charts/components/Row";
import { Divider } from "apps/charts/components";
import { formattedNum, formattedPercent } from "apps/charts/utils";
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

const Flex = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DashGrid = styled(Box)`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1.25fr;
  grid-template-areas: "name liq vol";
  padding: 0 1.125rem;

  > * {
    &:first-of-type {
      justify-content: flex-start;
      text-align: left;
    }
  }

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 0.25fr 180px 1fr 1fr 1fr;
    grid-template-areas: "id name symbol liq vol ";

    > * {
      &:first-of-type {
        justify-content: flex-start;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 0.25fr 1.5fr 0.6fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "id name symbol liq vol price change";
  }
`;

const ClickableText = styled(Typography)`
  text-align: center;
  user-select: none;
  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const DataText = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const HeaderWrapper = styled(DashGrid)`
  background: #2c4066;
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

const SORT_FIELD = {
  LIQ: "totalLiquidityUSD",
  VOL: "oneDayVolumeUSD",
  VOL_UT: "oneDayVolumeUT",
  SYMBOL: "symbol",
  NAME: "name",
  PRICE: "priceUSD",
  CHANGE: "priceChangeUSD",
};

// @TODO rework into virtualized list
type TopTokenListProps = {
  formattedTokens: any;
  itemMax?: number;
  useTracked?: boolean;
};

type ListItemProps = { item: any; index: number };

const ListItem: FC<ListItemProps> = memo((props) => {
  const below1080 = useMediaQuery("(max-width: 1080px)");
  const below680 = useMediaQuery("(max-width: 680px)");
  const below600 = useMediaQuery("(max-width: 600px)");

  const { item, index } = props;
  return (
    <DashGrid style={{ height: "48px" }}>
      {!below680 && (
        <DataText>
          <div style={{ marginRight: "1rem", width: "10px" }}>{index}</div>
        </DataText>
      )}
      <DataText fontWeight="500">
        <Row>
          <TokenLogo address={item.id} />
          <CustomLink
            style={{ marginLeft: "16px", whiteSpace: "nowrap" }}
            to={"/charts/token/" + item.id}
          >
            <FormattedName
              text={below680 ? item.symbol : item.name}
              maxCharacters={below600 ? 8 : 16}
              adjustSize={true}
              link={true}
            />
          </CustomLink>
        </Row>
      </DataText>
      {!below680 && (
        <DataText fontWeight="500">
          <FormattedName
            text={item.symbol}
            fontSize={"14px"}
            maxCharacters={5}
          />
        </DataText>
      )}
      <DataText>{formattedNum(item.totalLiquidityUSD, true)}</DataText>
      <DataText>{formattedNum(Math.abs(item.oneDayVolumeUSD), true)}</DataText>
      {!below1080 && (
        <DataText color="text" fontWeight="500">
          {formattedNum(item.priceUSD, true)}
        </DataText>
      )}
      {!below1080 && (
        <DataText>{formattedPercent(item.priceChangeUSD)}</DataText>
      )}
    </DashGrid>
  );
});

const TopTokenList: FC<TopTokenListProps> = (props) => {
  const { formattedTokens, itemMax = 10, useTracked = false } = props;
  // page state
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  // sorting
  const [sortDirection, setSortDirection] = useState(true);
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VOL);

  const below1080 = useMediaQuery("(max-width: 1080px)");
  const below680 = useMediaQuery("(max-width: 680px)");

  useEffect(() => {
    setMaxPage(1); // edit this to do modular
    setPage(1);
  }, [formattedTokens]);

  useEffect(() => {
    if (formattedTokens) {
      let extraPages = 1;
      if (formattedTokens.length % itemMax === 0) {
        extraPages = 0;
      }
      setMaxPage(Math.floor(formattedTokens.length / itemMax) + extraPages);
    }
  }, [formattedTokens, itemMax]);

  const filteredList = useMemo(() => {
    return (
      formattedTokens &&
      formattedTokens
        .sort(
          (
            a: {
              [x: string]: string;
            },
            b: {
              [x: string]: string;
            }
          ) => {
            if (
              sortedColumn === SORT_FIELD.SYMBOL ||
              sortedColumn === SORT_FIELD.NAME
            ) {
              return a[sortedColumn] > b[sortedColumn]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1;
            }
            return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
              ? (sortDirection ? -1 : 1) * 1
              : (sortDirection ? -1 : 1) * -1;
          }
        )
        .slice(itemMax * (page - 1), page * itemMax)
    );
  }, [formattedTokens, itemMax, page, sortDirection, sortedColumn]);

  return (
    <Box>
      <HeaderWrapper
        style={{ height: "fit-content", padding: "0 1.125rem 1rem 1.125rem" }}
      >
        {!below680 && (
          <Flex>
            <TableHeaderBox>ID</TableHeaderBox>
          </Flex>
        )}
        <Flex sx={{ justifyContent: "flex-start" }}>
          <ClickableText
            color="text"
            fontWeight="500"
            onClick={() => {
              setSortedColumn(SORT_FIELD.NAME);
              setSortDirection(
                sortedColumn !== SORT_FIELD.NAME ? true : !sortDirection
              );
            }}
          >
            <TableHeaderBox>
              {below680 ? "Symbol" : "Name"}{" "}
              {sortedColumn === SORT_FIELD.NAME
                ? !sortDirection
                  ? "↑"
                  : "↓"
                : ""}
            </TableHeaderBox>
          </ClickableText>
        </Flex>
        {!below680 && (
          <Flex>
            <ClickableText
              onClick={() => {
                setSortedColumn(SORT_FIELD.SYMBOL);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.SYMBOL ? true : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                Symbol{" "}
                {sortedColumn === SORT_FIELD.SYMBOL
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHeaderBox>
            </ClickableText>
          </Flex>
        )}

        <Flex>
          <ClickableText
            onClick={() => {
              setSortedColumn(SORT_FIELD.LIQ);
              setSortDirection(
                sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection
              );
            }}
          >
            <TableHeaderBox>
              Liquidity{" "}
              {sortedColumn === SORT_FIELD.LIQ
                ? !sortDirection
                  ? "↑"
                  : "↓"
                : ""}
            </TableHeaderBox>
          </ClickableText>
        </Flex>
        <Flex>
          <ClickableText
            onClick={() => {
              setSortedColumn(useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL);
              setSortDirection(
                sortedColumn !==
                  (useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL)
                  ? true
                  : !sortDirection
              );
            }}
          >
            <TableHeaderBox>
              Volume (24hrs)
              {sortedColumn ===
              (useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL)
                ? !sortDirection
                  ? "↑"
                  : "↓"
                : ""}
            </TableHeaderBox>
          </ClickableText>
        </Flex>
        {!below1080 && (
          <Flex>
            <ClickableText
              onClick={() => {
                setSortedColumn(SORT_FIELD.PRICE);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                Price{" "}
                {sortedColumn === SORT_FIELD.PRICE
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHeaderBox>
            </ClickableText>
          </Flex>
        )}
        {!below1080 && (
          <Flex>
            <ClickableText
              onClick={() => {
                setSortedColumn(SORT_FIELD.CHANGE);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.CHANGE ? true : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                Price Change (24hrs)
                {sortedColumn === SORT_FIELD.CHANGE
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHeaderBox>
            </ClickableText>
          </Flex>
        )}
      </HeaderWrapper>
      <List p={0}>
        {filteredList &&
          filteredList.map((item: any, index: number) => {
            return (
              <div key={index}>
                <ListItem
                  key={index}
                  index={(page - 1) * itemMax + index + 1}
                  item={item}
                />
                <Divider />
              </div>
            );
          })}
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
    </Box>
  );
};

export default memo(TopTokenList);
