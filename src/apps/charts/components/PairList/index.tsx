import { useState, useEffect, FC, memo, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  Box,
  Pagination,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";

import LocalLoader from "apps/charts/components/LocalLoader";
import { CustomLink } from "apps/charts/components/Link";
import { Divider } from "apps/charts/components";
import { formattedNum, formattedPercent } from "apps/charts/utils";
import DoubleTokenLogo from "apps/charts/components/DoubleLogo";
import FormattedName from "apps/charts/components/FormattedName";
import { PAIR_BLACKLIST } from "apps/charts/constants";
import { AutoColumn } from "apps/charts/components/Column";
import { TableHeaderBox } from "apps/charts/components/Row";
import BasePopover from "components/Base/Popover/BasePopover";

dayjs.extend(utc);

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`;

const Flex = styled(Box)`
  display: flex;
`;

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`;

const DashGrid = styled(Box)<{ fade?: boolean }>`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "name liq vol";
  padding: 0 1.125rem;

  opacity: ${({ fade }) => (fade ? "0.6" : "1")};

  > * {
    :first-of-type {
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
  background: #2c4066;
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

const ClickableText = styled(Typography)`
  color: #5977a0;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  text-align: end;
  user-select: none;
`;

const DataText = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  color: #fafafa;
  font-size: 14px;

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const SORT_FIELD = {
  LIQ: 0,
  VOL: 1,
  VOL_7DAYS: 3,
  FEES: 4,
  APY: 5,
};

const FIELD_TO_VALUE = (field: number, useTracked: boolean) => {
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

const formatDataText = (value: any) => {
  return (
    <AutoColumn gap="2px" style={{ opacity: "1" }}>
      <div style={{ textAlign: "center" }}>{value}</div>
    </AutoColumn>
  );
};

type ListItemProps = {
  pairAddress: string;
  index: number;
  pairs: any[];
  color?: string;
};

const ListItem: FC<ListItemProps> = memo((props) => {
  const { pairAddress, index, pairs, color } = props;
  const pairData = (pairs as any)[pairAddress];

  const below600 = useMediaQuery("(max-width: 600px)");
  const below1080 = useMediaQuery("(max-width: 1080px)");

  if (pairData && pairData.token0 && pairData.token1) {
    const liquidity = formattedNum(
      pairData.trackedReserveUSD
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
      <DashGrid style={{ height: "48px" }}>
        {!below600 && (
          <DataText>
            <div>{index}</div>
          </DataText>
        )}
        <DataText fontWeight="500" sx={{ justifyContent: "flex-start" }}>
          <DoubleTokenLogo
            size={below600 ? 16 : 20}
            a0={pairData.token0.id}
            a1={pairData.token1.id}
          />
          <CustomLink
            style={{
              marginLeft: "14px",
              whiteSpace: "nowrap",
              fontSize: "inherit",
            }}
            to={"/charts/pair/" + pairAddress}
            color={color}
          >
            <FormattedName
              text={pairData.token0.symbol + "-" + pairData.token1.symbol}
              maxCharacters={below600 ? 8 : 16}
              adjustSize={true}
              fontSize={"inherit"}
              link={true}
            />
          </CustomLink>
        </DataText>
        <DataText>{formatDataText(liquidity)}</DataText>
        <DataText>{formatDataText(volume)}</DataText>
        {!below1080 && <DataText>{formatDataText(weekVolume)}</DataText>}
        {!below1080 && <DataText>{formatDataText(fees)}</DataText>}
        {!below1080 && <DataText>{formatDataText(apy)}</DataText>}
      </DashGrid>
    );
  } else {
    return null;
  }
});

type PairListProps = {
  pairs: any;
  color?: string;
  maxItems?: number;
  useTracked?: boolean;
};

const PairList: FC<PairListProps> = (props) => {
  const { pairs, color, maxItems = 10, useTracked = false } = props;
  const below600 = useMediaQuery("(max-width: 600px)");
  const below1080 = useMediaQuery("(max-width: 1080px)");

  // pagination
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const ITEMS_PER_PAGE = maxItems;

  // sorting
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [sortedColumn, setSortedColumn] = useState<number>(SORT_FIELD.LIQ);

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

  const pairList = useMemo(() => {
    return (
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
              parseFloat(String(pairA.oneDayVolumeUSD * 0.003 * 356 * 100)) /
              parseFloat(pairA.reserveUSD);
            const apy1 =
              parseFloat(String(pairB.oneDayVolumeUSD * 0.003 * 356 * 100)) /
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
                  pairs={pairs}
                  color={color}
                  key={index}
                  index={(page - 1) * ITEMS_PER_PAGE + index + 1}
                  pairAddress={pairAddress}
                />
                <Divider />
              </div>
            )
          );
        })
    );
  }, [
    pairs,
    color,
    sortedColumn,
    maxItems,
    sortDirection,
    page,
    maxPage,
    useTracked,
  ]);

  return (
    <Box>
      <HeaderWrapper style={{ height: "fit-content" }}>
        {!below600 && (
          <Flex alignItems="center" justifyContent="flex-start">
            <TableHeaderBox>ID</TableHeaderBox>
          </Flex>
        )}
        <Flex alignItems="center" sx={{ justifyContent: "flex-start" }}>
          <TableHeaderBox>Name</TableHeaderBox>
        </Flex>
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
              onClick={() => {
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
              onClick={() => {
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
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ color: "#5977a0", gap: "4px" }}
          >
            <ClickableText
              onClick={() => {
                setSortedColumn(SORT_FIELD.APY);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.APY ? true : !sortDirection
                );
              }}
              sx={{ width: "min-content" }}
            >
              <TableHeaderBox sx={{ whiteSpace: "nowrap" }}>
                1y Fees / Liquidity{" "}
                {sortedColumn === SORT_FIELD.APY
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHeaderBox>
            </ClickableText>
            <BasePopover
              id="pairs_sorting"
              text="Based on 24hr volume annualized"
            />
          </Flex>
        )}
      </HeaderWrapper>
      <List p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
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

export default memo(PairList);
