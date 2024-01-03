import { useState, useEffect, useMemo, FC, memo } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Box, Flex, Text } from "rebass";
import TokenLogo from "apps/charts/components/TokenLogo";
import { CustomLink } from "apps/charts/components/Link";
import Row from "apps/charts/components/Row";
import { Divider } from "apps/charts/components/index";

import { formattedNum, formattedPercent } from "apps/charts/utils";
import { useMedia } from "react-use";
import FormattedName from "apps/charts/components/FormattedName";
import { TYPE } from "apps/charts/Theme";
import { TableHeaderBox } from "apps/charts/components/Row";

dayjs.extend(utc);

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 2em;
`;

const Arrow = styled.div<{
  faded: boolean;
}>`
  color: ${({ theme }) => theme.white};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;

  :hover {
    cursor: pointer;
  }
`;

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`;

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1.25fr;
  grid-template-areas: "name liq vol";
  padding: 0 1.125rem;

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 0.25fr 180px 1fr 1fr 1fr;
    grid-template-areas: "id name symbol liq vol ";

    > * {
      justify-content: flex-end;
      width: 100%;

      &:first-child {
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

const ListWrapper = styled.div``;

const ClickableText = styled(Text)`
  text-align: end;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  user-select: none;
  color: ${({ theme }) => theme.text1} !important;
  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`;

const DataText = styled(Flex)`
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  color: ${({ theme }) => theme.text1} !important;

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }

  &.right {
    justify-content: right;
  }
`;

const HeaderWrapper = styled(DashGrid)`
  background: ${({ theme }) => theme.headerBackground};
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
  const below1080 = useMedia("(max-width: 1080px)");
  const below680 = useMedia("(max-width: 680px)");
  const below600 = useMedia("(max-width: 600px)");

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
        <DataText color="text" fontWeight="500">
          <FormattedName text={item.symbol} maxCharacters={5} />
        </DataText>
      )}
      <DataText justifyContent="center">
        {formattedNum(item.totalLiquidityUSD, true)}
      </DataText>
      <DataText justifyContent="center">
        {formattedNum(Math.abs(item.oneDayVolumeUSD), true)}
      </DataText>
      {!below1080 && (
        <DataText color="text" fontWeight="500" justifyContent="center">
          {formattedNum(item.priceUSD, true)}
        </DataText>
      )}
      {!below1080 && (
        <DataText justifyContent="center">
          {formattedPercent(item.priceChangeUSD)}
        </DataText>
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

  const below1080 = useMedia("(max-width: 1080px)");
  const below680 = useMedia("(max-width: 680px)");

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
    <ListWrapper>
      <HeaderWrapper
        style={{ height: "fit-content", padding: "0 1.125rem 1rem 1.125rem" }}
      >
        {!below680 && (
          <Flex alignItems="center" justifyContent="flex-start">
            <TableHeaderBox>ID</TableHeaderBox>
          </Flex>
        )}
        <Flex alignItems="center" justifyContent="flex-start">
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
          <Flex alignItems="center" justifyContent="flex-start">
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

        <Flex alignItems="center" justifyContent="center">
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
        <Flex alignItems="center" justifyContent="center">
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
          <Flex alignItems="center" justifyContent="center">
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
          <Flex alignItems="center" justifyContent="center">
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
      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{"Page " + page + " of " + maxPage}</TYPE.body>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  );
};

export default TopTokenList;
