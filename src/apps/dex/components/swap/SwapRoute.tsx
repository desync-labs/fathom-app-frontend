import { Fragment, memo } from "react";
import { Trade } from "into-the-fathom-swap-sdk";
import { Box, styled } from "@mui/material";
import { TYPE } from "apps/dex/theme";
import { unwrappedToken } from "apps/dex/utils/wrappedCurrency";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Flex = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
`;

export default memo(({ trade }: { trade: Trade }) => {
  return (
    <Flex
      flexWrap="wrap"
      width="100%"
      justifyContent="flex-end"
      alignItems="center"
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1;
        const currency = unwrappedToken(token);
        return (
          <Fragment key={i}>
            <Flex alignItems="end">
              <TYPE.black
                fontSize={14}
                color={"#ffffff"}
                ml="0.125rem"
                mr="0.125rem"
              >
                {currency.symbol}
              </TYPE.black>
            </Flex>
            {isLastItem ? null : (
              <KeyboardArrowRightIcon
                sx={{
                  width: "12px",
                  height: "12px",
                  color: "#4F658C",
                }}
              />
            )}
          </Fragment>
        );
      })}
    </Flex>
  );
});
