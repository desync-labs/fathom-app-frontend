import { useState, useEffect, memo, FC, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Box, Pagination, styled, useMediaQuery } from "@mui/material";

import LocalLoader from "apps/charts/components/LocalLoader";
import { CustomLink } from "apps/charts/components/Link";
import { Divider } from "apps/charts/components";
import { formattedNum } from "apps/charts/utils";
import { TYPE } from "apps/charts/Theme";
import DoubleTokenLogo from "apps/charts/components/DoubleLogo";
import { RowFixed } from "apps/charts/components/Row";
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

const DashGrid = styled(Box)`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 10px 2fr 1fr 1fr;
  grid-template-areas: "number name pair value";
  padding: 0 4px;

  @media screen and (max-width: 1080px) {
    grid-template-columns: 10px 3fr 1fr 1fr;
    grid-template-areas: "number name pair value";
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: "name pair value";
  }
`;

const HeaderWrapper = styled(DashGrid)`
  background: #2c4066;
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

const Flex = styled(Box)`
  display: flex;
`;

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: #fafafa;

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`;

type ListItemProps = { lp: any; index: number };

const ListItem: FC<ListItemProps> = memo((props) => {
  const below600 = useMediaQuery("(max-width: 600px)");
  const below800 = useMediaQuery("(max-width: 800px)");

  const { lp, index } = props;
  return (
    <DashGrid style={{ height: "48px", padding: "0 1.125rem" }}>
      {!below600 && <DataText fontWeight="500">{index}</DataText>}
      <DataText
        fontWeight="500"
        justifyContent={below600 ? "flex-start" : "center"}
      >
        <CustomLink
          style={{ marginLeft: below600 ? 0 : "1rem", whiteSpace: "nowrap" }}
          to={"/charts/account/" + lp.user.id}
        >
          {below800
            ? lp.user.id.slice(0, 4) + "..." + lp.user.id.slice(38, 42)
            : lp.user.id}
        </CustomLink>
      </DataText>

      <DataText justifyContent="center">
        <CustomLink to={"/charts/pair/" + lp.pairAddress}>
          <RowFixed>
            {!below600 && (
              <DoubleTokenLogo a0={lp.token0} a1={lp.token1} size={16} />
            )}
            {lp.pairName}
          </RowFixed>
        </CustomLink>
      </DataText>
      <DataText justifyContent={"center"}>
        {formattedNum(lp.usd, true)}
      </DataText>
    </DashGrid>
  );
});

type LPListProps = { lps: any; maxItems?: number };

const LPList: FC<LPListProps> = (props) => {
  const { lps, maxItems = 10 } = props;
  const below600 = useMediaQuery("(max-width: 600px)");

  // pagination
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const ITEMS_PER_PAGE = maxItems;

  useEffect(() => {
    setMaxPage(1); // edit this to do modular
    setPage(1);
  }, [lps]);

  useEffect(() => {
    if (lps) {
      let extraPages = 1;
      if (Object.keys(lps).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0;
      }
      setMaxPage(
        Math.floor(Object.keys(lps).length / ITEMS_PER_PAGE) + extraPages
      );
    }
  }, [ITEMS_PER_PAGE, lps]);

  const lpList = useMemo(
    () =>
      lps &&
      lps
        .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
        .map((lp: any, index: number) => {
          return (
            <div key={index}>
              <ListItem
                key={index}
                index={(page - 1) * 10 + index + 1}
                lp={lp}
              />
              <Divider />
            </div>
          );
        }),
    [lps, page]
  );

  return (
    <Box>
      <HeaderWrapper
        style={{ height: "fit-content", padding: "0px 1.125rem 1rem" }}
      >
        {!below600 && (
          <Flex alignItems="center" justifyContent="flex-start">
            <TYPE.main>
              <TableHeaderBox>#</TableHeaderBox>
            </TYPE.main>
          </Flex>
        )}
        <Flex
          alignItems="center"
          justifyContent={below600 ? "flex-start" : "center"}
        >
          <TYPE.main>
            <TableHeaderBox>Account</TableHeaderBox>
          </TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <TYPE.main>
            <TableHeaderBox>Pair</TableHeaderBox>
          </TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <TYPE.main>
            <TableHeaderBox>Value</TableHeaderBox>
          </TYPE.main>
        </Flex>
      </HeaderWrapper>
      <List p={0}>{!lpList ? <LocalLoader /> : lpList}</List>
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

export default memo(LPList);
