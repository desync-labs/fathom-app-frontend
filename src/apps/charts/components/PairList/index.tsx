import React, { useState, useEffect } from "react";
import { useMedia } from "react-use";
import dayjs from "dayjs";
import LocalLoader from "components/LocalLoader";
import utc from "dayjs/plugin/utc";
import { Box, Flex, Text } from "rebass";
import styled from "styled-components";

import { CustomLink } from "components/Link";
import { Divider } from "components";
import { withRouter } from "react-router-dom";
import { formattedNum, formattedPercent } from "utils";
import DoubleTokenLogo from "components/DoubleLogo";
import FormattedName from "components/FormattedName";
import QuestionHelper from "components/QuestionHelper";
import { TYPE } from "Theme";
import { PAIR_BLACKLIST } from "constants/index";
import { AutoColumn } from "components/Column";
import { TableHeaderBox } from "components/Row";

dayjs.extend(utc);

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`;

const Arrow = styled.div`
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
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "name liq vol";
  padding: 0 1.125rem;

  opacity: ${({ fade }) => (fade ? "0.6" : "1")};

  > * {
    justify-content: flex-end;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 600px) {
    padding: 0 1.125rem;
    grid-template-columns: 0.25fr 1.5fr 1fr 1fr;
    grid-template-areas: "id name liq vol pool";
  }

  @media screen and (min-width: 1080px) {
    padding: 0 1.125rem;
    grid-template-columns: 0.25fr 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "id name liq vol volWeek fees apy";
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 0.25fr 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "id name liq vol volWeek fees apy";
  }
`;

export const HeaderWrapper = styled(DashGrid)`
  background: ${({ theme }) => theme.headerBackground};
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

const ListWrapper = styled.div``;

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  text-align: end;
  user-select: none;
`;

const DataText = styled(Flex)`
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }

  &.right {
    justify-content: end;
  }
`;

const SORT_FIELD = {
  LIQ: 0,
  VOL: 1,
  VOL_7DAYS: 3,
  FEES: 4,
  APY: 5,
};

const FIELD_TO_VALUE = (field, useTracked) => {
  switch (field) {
    case SORT_FIELD.LIQ:
      return useTracked ? "trackedReserveUSD" : "reserveUSD";
    case SORT_FIELD.VOL:
      return useTracked ? "oneDayVolumeUSD" : "oneDayVolumeUntracked";
    case SORT_FIELD.VOL_7DAYS:
      return useTracked ? "oneWeekVolumeUSD" : "oneWeekVolumeUntracked";
    case SORT_FIELD.FEES:
      return useTracked ? "oneDayVolumeUSD" : "oneDayVolumeUntracked";
    default:
      return "trackedReserveUSD";
  }
};

const formatDataText = (value, trackedValue, supressWarning = false) => {
  const showUntracked = value !== "$0" && !trackedValue & !supressWarning;
  return (
    <AutoColumn gap="2px" style={{ opacity: showUntracked ? "0.7" : "1" }}>
      <div style={{ textAlign: "right" }}>{value}</div>
      <TYPE.light fontSize={"9px"} style={{ textAlign: "right" }}>
        {showUntracked ? "untracked" : "  "}
      </TYPE.light>
    </AutoColumn>
  );
};

function PairList({
  pairs,
  color,
  disbaleLinks,
  maxItems = 10,
  useTracked = false,
}) {
  const below600 = useMedia("(max-width: 600px)");
  const below740 = useMedia("(max-width: 740px)");
  const below1080 = useMedia("(max-width: 1080px)");

  // pagination
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const ITEMS_PER_PAGE = maxItems;

  // sorting
  const [sortDirection, setSortDirection] = useState(true);
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ);

  useEffect(() => {
    setMaxPage(1); // edit this to do modular
    setPage(1);
  }, [pairs]);

  useEffect(() => {
    if (pairs) {
      let extraPages = 1;
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0;
      }

      setMaxPage(
        Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages
      );
    }
  }, [ITEMS_PER_PAGE, pairs]);

  const ListItem = ({ pairAddress, index }) => {
    const pairData = pairs[pairAddress];

    if (pairData && pairData.token0 && pairData.token1) {
      const liquidity = formattedNum(
        !!pairData.trackedReserveUSD
          ? pairData.trackedReserveUSD
          : pairData.reserveUSD,
        true
      );

      const volume = formattedNum(
        pairData.oneDayVolumeUSD
          ? pairData.oneDayVolumeUSD
          : pairData.oneDayVolumeUntracked,
        true
      );

      const apy = formattedPercent(
        ((pairData.oneDayVolumeUSD
          ? pairData.oneDayVolumeUSD
          : pairData.oneDayVolumeUntracked) *
          0.003 *
          365 *
          100) /
          (pairData.oneDayVolumeUSD
            ? pairData.trackedReserveUSD
            : pairData.reserveUSD)
      );

      const weekVolume = formattedNum(
        pairData.oneWeekVolumeUSD
          ? pairData.oneWeekVolumeUSD
          : pairData.oneWeekVolumeUntracked,
        true
      );

      const fees = formattedNum(
        pairData.oneDayVolumeUSD
          ? pairData.oneDayVolumeUSD * 0.003
          : pairData.oneDayVolumeUntracked * 0.003,
        true
      );

      return (
        <DashGrid
          style={{ height: "48px" }}
          disbaleLinks={disbaleLinks}
          focus={true}
        >
          {!below600 && (
            <DataText area="id">
              <div>{index}</div>
            </DataText>
          )}
          <DataText area="name" fontWeight="500">
            <DoubleTokenLogo
              size={below600 ? 16 : 20}
              a0={pairData.token0.id}
              a1={pairData.token1.id}
              margin={!below740}
            />
            <CustomLink
              style={{ marginLeft: "20px", whiteSpace: "nowrap" }}
              to={"/pair/" + pairAddress}
              color={color}
            >
              <FormattedName
                text={pairData.token0.symbol + "-" + pairData.token1.symbol}
                maxCharacters={below600 ? 8 : 16}
                adjustSize={true}
                link={true}
              />
            </CustomLink>
          </DataText>
          <DataText area="liq" justifyContent="center">
            {formatDataText(liquidity, pairData.trackedReserveUSD)}
          </DataText>
          <DataText area="vol" justifyContent="center">
            {formatDataText(volume, pairData.oneDayVolumeUSD)}
          </DataText>
          {!below1080 && (
            <DataText area="volWeek" justifyContent="center">
              {formatDataText(weekVolume, pairData.oneWeekVolumeUSD)}
            </DataText>
          )}
          {!below1080 && (
            <DataText area="fees" justifyContent="center">
              {formatDataText(fees, pairData.oneDayVolumeUSD)}
            </DataText>
          )}
          {!below1080 && (
            <DataText area="apy" justifyContent="center">
              {formatDataText(
                apy,
                pairData.oneDayVolumeUSD,
                pairData.oneDayVolumeUSD === 0
              )}
            </DataText>
          )}
        </DashGrid>
      );
    } else {
      return "";
    }
  };

  const pairList =
    pairs &&
    Object.keys(pairs)
      .filter(
        (address) =>
          !PAIR_BLACKLIST.includes(address) &&
          (useTracked ? !!pairs[address].trackedReserveUSD : true)
      )
      .sort((addressA, addressB) => {
        const pairA = pairs[addressA];
        const pairB = pairs[addressB];
        if (sortedColumn === SORT_FIELD.APY) {
          const apy0 =
            parseFloat(pairA.oneDayVolumeUSD * 0.003 * 356 * 100) /
            parseFloat(pairA.reserveUSD);
          const apy1 =
            parseFloat(pairB.oneDayVolumeUSD * 0.003 * 356 * 100) /
            parseFloat(pairB.reserveUSD);
          return apy0 > apy1
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1;
        }
        return parseFloat(pairA[FIELD_TO_VALUE(sortedColumn, useTracked)]) >
          parseFloat(pairB[FIELD_TO_VALUE(sortedColumn, useTracked)])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1;
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((pairAddress, index) => {
        return (
          pairAddress && (
            <div key={index}>
              <ListItem
                key={index}
                index={(page - 1) * ITEMS_PER_PAGE + index + 1}
                pairAddress={pairAddress}
              />
              <Divider />
            </div>
          )
        );
      });

  return (
    <ListWrapper>
      <HeaderWrapper
        center={true}
        disbaleLinks={disbaleLinks}
        style={{ height: "fit-content" }}
      >
        {!below600 && (
          <Flex alignItems="center" justifyContent="flex-start">
            <TableHeaderBox area="id">ID</TableHeaderBox>
          </Flex>
        )}
        <Flex alignItems="center" justifyContent="flex-start">
          <TableHeaderBox area="name">Name</TableHeaderBox>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <ClickableText
            area="liq"
            onClick={(e) => {
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
            area="vol"
            onClick={(e) => {
              setSortedColumn(SORT_FIELD.VOL);
              setSortDirection(
                sortedColumn !== SORT_FIELD.VOL ? true : !sortDirection
              );
            }}
          >
            <TableHeaderBox>
              Volume (24hrs)
              {sortedColumn === SORT_FIELD.VOL
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
              area="volWeek"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.VOL_7DAYS);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.VOL_7DAYS ? true : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                Volume (7d){" "}
                {sortedColumn === SORT_FIELD.VOL_7DAYS
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
              area="fees"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.FEES);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.FEES ? true : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                Fees (24hr){" "}
                {sortedColumn === SORT_FIELD.FEES
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
              area="apy"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.APY);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.APY ? true : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                1y Fees / Liquidity{" "}
                {sortedColumn === SORT_FIELD.APY
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHeaderBox>
            </ClickableText>
            <QuestionHelper text={"Based on 24hr volume annualized"} />
          </Flex>
        )}
      </HeaderWrapper>
      <List p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
      <PageButtons>
        <div
          onClick={(e) => {
            setPage(page === 1 ? page : page - 1);
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{"Page " + page + " of " + maxPage}</TYPE.body>
        <div
          onClick={(e) => {
            setPage(page === maxPage ? page : page + 1);
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  );
}

export default withRouter(PairList);
