import { FC, useMemo, memo } from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { getTokenInfo } from "utils/tokenLogo";

type PoolNameProps = {
  children: string;
};

export const PoolNameWrapper = styled(Typography)`
  font-size: 14px;
  color: #fff;
  text-align: left;
  line-height: 20px;
  font-weight: 600;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

const PoolName: FC<PoolNameProps> = ({ children }) => {
  const tokenItem = useMemo(() => {
    return getTokenInfo(children);
  }, [children]);

  if (
    tokenItem?.symbol &&
    tokenItem?.name &&
    tokenItem?.name !== tokenItem?.symbol
  ) {
    return (
      <PoolNameWrapper>
        {tokenItem.name} ({tokenItem.symbol})
      </PoolNameWrapper>
    );
  }

  return <PoolNameWrapper>{children}</PoolNameWrapper>;
};

export default memo(PoolName);
