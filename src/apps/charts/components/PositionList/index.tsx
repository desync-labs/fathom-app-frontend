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
import LocalLoader from "apps/charts/components/LocalLoader";
import { CustomLink } from "apps/charts/components/Link";
import { Divider } from "apps/charts/components";
import DoubleTokenLogo from "apps/charts/components/DoubleLogo";
import { formattedNum, getPoolLink } from "apps/charts/utils";
import { AutoColumn } from "apps/charts/components/Column";
import { useEthPrice } from "apps/charts/contexts/GlobalData";
import { RowFixed } from "apps/charts/components/Row";
import { ButtonLight } from "apps/charts/components/ButtonStyled";
import { TYPE } from "apps/charts/Theme";
import FormattedName from "apps/charts/components/FormattedName";
import { TableHeaderBox } from "apps/charts/components/Row";
import { Position } from "apps/charts/utils/returns";

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

const DashGrid = styled(Box)`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 20px 1.5fr 1fr 1fr;
  grid-template-areas: "number name fathomswap return";
  align-items: flex-start;
  padding: 20px 0;

  @media screen and (min-width: 1200px) {
    grid-template-columns: 35px 2.5fr 1fr 1fr;
    grid-template-areas: "number name fathomswap return";
  }

  @media screen and (max-width: 740px) {
    grid-template-columns: 2.5fr 1fr 1fr;
    grid-template-areas: "name fathomswap return";
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas: "name fathomswap";
  }
`;

const HeaderWrapper = styled(DashGrid)`
  background: #2c4066;
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

const ClickableText = styled(Typography)`
  text-align: end;
  user-select: none;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const DataText = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  color: #fafafa;

  & > * {
    font-size: 1em;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`;

const SORT_FIELD = {
  VALUE: "VALUE",
  FATHOMSWAP_RETURN: "FATHOMSWAP_RETURN",
};

type PositionList = { positions: Position[] };
type ListItemProps = { position: Position; index: number };

const ListItem: FC<ListItemProps> = memo((props) => {
  const { position, index } = props;
  const poolOwnership =
    position.liquidityTokenBalance / position.pair.totalSupply;
  const valueUSD = poolOwnership * position.pair.reserveUSD;

  const below600 = useMediaQuery("(max-width: 600px)");
  const below740 = useMediaQuery("(max-width: 740px)");

  const [ethPrice] = useEthPrice();

  return (
    <DashGrid
      style={{
        opacity: poolOwnership > 0 ? 1 : 0.6,
        padding: "0.75rem 1.125rem",
      }}
    >
      {!below740 && (
        <DataText alignItems={"center"} sx={{ height: "100%" }}>
          {index}
        </DataText>
      )}
      <DataText justifyContent="flex-start" alignItems="center">
        <AutoColumn justify="flex-start" sx={{ width: "fit-content" }}>
          <DoubleTokenLogo
            size={26}
            a0={position.pair.token0.id}
            a1={position.pair.token1.id}
          />
        </AutoColumn>
        <AutoColumn
          gap="8px"
          justify="flex-start"
          style={{ marginLeft: "20px" }}
        >
          <CustomLink to={"/charts/pair/" + position.pair.id}>
            <TYPE.main style={{ whiteSpace: "nowrap" }}>
              <FormattedName
                text={
                  position.pair.token0.symbol +
                  "-" +
                  position.pair.token1.symbol
                }
                maxCharacters={below740 ? 10 : 18}
              />
            </TYPE.main>
          </CustomLink>

          <RowFixed justify="flex-start">
            <CustomLink
              to={getPoolLink(position.pair.token0.id, position.pair.token1.id)}
              style={{ marginRight: ".5rem" }}
            >
              <ButtonLight style={{ padding: "4px 6px", borderRadius: "4px" }}>
                Add
              </ButtonLight>
            </CustomLink>
            {poolOwnership > 0 && (
              <CustomLink
                to={getPoolLink(
                  position.pair.token0.id,
                  position.pair.token1.id,
                  true
                )}
              >
                <ButtonLight
                  style={{ padding: "4px 6px", borderRadius: "4px" }}
                >
                  Remove
                </ButtonLight>
              </CustomLink>
            )}
          </RowFixed>
        </AutoColumn>
      </DataText>
      <DataText>
        <AutoColumn gap="12px" justify="flex-start">
          <TYPE.main>{formattedNum(valueUSD, true)}</TYPE.main>
          <AutoColumn gap="4px" justify="flex-start">
            <RowFixed>
              <TYPE.small fontWeight={400}>
                {formattedNum(
                  poolOwnership * parseFloat(position.pair.reserve0)
                )}{" "}
              </TYPE.small>
              <FormattedName
                text={position.pair.token0.symbol}
                maxCharacters={below740 ? 10 : 18}
                margin="0 4px"
                fontSize={"11px"}
              />
            </RowFixed>
            <RowFixed>
              <TYPE.small fontWeight={400}>
                {formattedNum(
                  poolOwnership * parseFloat(position.pair.reserve1)
                )}{" "}
              </TYPE.small>
              <FormattedName
                text={position.pair.token1.symbol}
                maxCharacters={below740 ? 10 : 18}
                margin="0 4px"
                fontSize={"11px"}
              />
            </RowFixed>
          </AutoColumn>
        </AutoColumn>
      </DataText>
      {!below600 && (
        <DataText>
          <AutoColumn gap="12px" justify="flex-start">
            <TYPE.main color={"text5"}>
              <RowFixed>{formattedNum(position?.fees.sum, true)}</RowFixed>
            </TYPE.main>
            <AutoColumn gap="4px" justify="flex-start">
              <RowFixed>
                <TYPE.small fontWeight={400}>
                  {parseFloat(position.pair.token0.derivedETH)
                    ? formattedNum(
                        position?.fees.sum /
                          (parseFloat(position.pair.token0.derivedETH) *
                            ethPrice) /
                          2,
                        false
                      )
                    : 0}{" "}
                </TYPE.small>
                <FormattedName
                  text={position.pair.token0.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin="0 4px"
                  fontSize={"11px"}
                />
              </RowFixed>
              <RowFixed>
                <TYPE.small fontWeight={400}>
                  {parseFloat(position.pair.token1.derivedETH)
                    ? formattedNum(
                        position?.fees.sum /
                          (parseFloat(position.pair.token1.derivedETH) *
                            ethPrice) /
                          2,
                        false
                      )
                    : 0}{" "}
                </TYPE.small>
                <FormattedName
                  text={position.pair.token1.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin="0 4px"
                  fontSize={"11px"}
                />
              </RowFixed>
            </AutoColumn>
          </AutoColumn>
        </DataText>
      )}
    </DashGrid>
  );
});

const PositionList: FC<PositionList> = (props) => {
  const { positions } = props;
  const below600 = useMediaQuery("(max-width: 600px)");
  const below740 = useMediaQuery("(max-width: 740px)");

  // pagination
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  // sorting
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [sortedColumn, setSortedColumn] = useState<string>(SORT_FIELD.VALUE);

  useEffect(() => {
    setMaxPage(1); // edit this to do modular
    setPage(1);
  }, [positions]);

  useEffect(() => {
    if (positions) {
      let extraPages = 1;
      if (positions.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0;
      }
      setMaxPage(
        Math.floor(positions.length / ITEMS_PER_PAGE) + extraPages || 1
      );
    }
  }, [positions]);

  const positionsSorted = useMemo(
    () =>
      positions &&
      positions
        .sort((p0, p1) => {
          if (sortedColumn === SORT_FIELD.FATHOMSWAP_RETURN) {
            return p0?.uniswap?.return > p1?.uniswap?.return
              ? sortDirection
                ? -1
                : 1
              : sortDirection
              ? 1
              : -1;
          }
          if (sortedColumn === SORT_FIELD.VALUE) {
            const bal0 =
              (p0.liquidityTokenBalance / p0.pair.totalSupply) *
              p0.pair.reserveUSD;
            const bal1 =
              (p1.liquidityTokenBalance / p1.pair.totalSupply) *
              p1.pair.reserveUSD;
            return bal0 > bal1
              ? sortDirection
                ? -1
                : 1
              : sortDirection
              ? 1
              : -1;
          }
          return 1;
        })
        .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
        .map((position: Position, index: number) => {
          return (
            <div key={index}>
              <ListItem
                key={index}
                index={(page - 1) * 10 + index + 1}
                position={position}
              />
              <Divider />
            </div>
          );
        }),
    [positions, page, sortDirection, sortedColumn]
  );

  return (
    <Box>
      <HeaderWrapper style={{ padding: "0 1.125rem 1rem" }}>
        {!below740 && (
          <Flex>
            <TableHeaderBox>#</TableHeaderBox>
          </Flex>
        )}
        <Flex>
          <TableHeaderBox>Name</TableHeaderBox>
        </Flex>
        <Flex>
          <ClickableText
            onClick={() => {
              setSortedColumn(SORT_FIELD.VALUE);
              setSortDirection(
                sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection
              );
            }}
          >
            <TableHeaderBox>
              {below740 ? "Value" : "Liquidity"}{" "}
              {sortedColumn === SORT_FIELD.VALUE
                ? !sortDirection
                  ? "↑"
                  : "↓"
                : ""}
            </TableHeaderBox>
          </ClickableText>
        </Flex>
        {!below600 && (
          <Flex>
            <ClickableText
              onClick={() => {
                setSortedColumn(SORT_FIELD.FATHOMSWAP_RETURN);
                setSortDirection(
                  sortedColumn !== SORT_FIELD.FATHOMSWAP_RETURN
                    ? true
                    : !sortDirection
                );
              }}
            >
              <TableHeaderBox>
                {below740 ? "Fees" : "Total Fees Earned"}{" "}
                {sortedColumn === SORT_FIELD.FATHOMSWAP_RETURN
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHeaderBox>
            </ClickableText>
          </Flex>
        )}
      </HeaderWrapper>
      <List p={0}>{!positionsSorted ? <LocalLoader /> : positionsSorted}</List>
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

export default memo(PositionList);
