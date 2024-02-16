import { CSSProperties, FC } from "react";
import { Token } from "into-the-fathom-swap-sdk";
import { Box, styled } from "@mui/material";

import { AutoRow, RowFixed } from "apps/dex/components/Row";
import { AutoColumn } from "apps/dex/components/Column";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { TYPE } from "apps/dex/theme";
import ListLogo from "apps/dex/components/ListLogo";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useCombinedInactiveList } from "apps/dex/state/lists/hooks";
import { ButtonPrimary } from "apps/dex/components/Button";
import { useIsUserAddedToken, useIsTokenActive } from "apps/dex/hooks/Tokens";

import TaskAltIcon from "@mui/icons-material/TaskAlt";

const TokenSection = styled(Box)<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? "0.4" : "1")};
`;

const CheckIcon = styled(TaskAltIcon)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  color: #27ae60;
`;

const NameOverflow = styled(Box)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 140px;
  font-size: 12px;
`;

type ImportRowProps = {
  token: Token;
  style?: CSSProperties;
  dim?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
};

const ImportRow: FC<ImportRowProps> = ({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}) => {
  // gloabls
  const { chainId } = useActiveWeb3React();

  // check if token comes from a list
  const inactiveTokenList = useCombinedInactiveList();
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list;

  // check if already active on a list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);

  return (
    <TokenSection style={style}>
      <CurrencyLogo
        currency={token}
        size={"24px"}
        style={{ opacity: dim ? "0.6" : "1" }}
      />
      <AutoColumn gap="4px" style={{ opacity: dim ? "0.6" : "1" }}>
        <AutoRow>
          <TYPE.body fontWeight={500}>{token.symbol}</TYPE.body>
          <TYPE.white ml="8px" fontWeight={300}>
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </TYPE.white>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed>
            <TYPE.small mr="4px">via {list.name}</TYPE.small>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </RowFixed>
        )}
      </AutoColumn>
      {!isActive && !isAdded ? (
        <ButtonPrimary
          width="fit-content"
          padding="6px 12px"
          fontWeight={500}
          fontSize="14px"
          onClick={() => {
            setImportToken && setImportToken(token);
            showImportView();
          }}
        >
          Import
        </ButtonPrimary>
      ) : (
        <RowFixed style={{ minWidth: "fit-content" }}>
          <CheckIcon />
          <TYPE.main color="#27AE60">Active</TYPE.main>
        </RowFixed>
      )}
    </TokenSection>
  );
};

export default ImportRow;
