import { useRef, RefObject, useCallback, useState, useMemo, FC } from "react";
import { Token } from "into-the-fathom-swap-sdk";
import { Box, styled } from "@mui/material";

import Column from "apps/dex/components/Column";
import {
  PaddedColumn,
  Separator,
  SearchInput,
} from "apps/dex/components/SearchModal/styleds";
import Row, { RowBetween, RowFixed } from "apps/dex/components/Row";
import {
  TYPE,
  ExternalLinkIcon,
  TrashIcon,
  ButtonText,
  ExternalLink,
} from "apps/dex/theme";
import { useToken } from "apps/dex/hooks/Tokens";
import {
  useUserAddedTokens,
  useRemoveUserAddedToken,
} from "apps/dex/state/user/hooks";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { getBlockScanLink, isAddress } from "apps/dex/utils";
import { useActiveWeb3React } from "apps/dex/hooks";
import Card from "apps/dex/components/Card";
import ImportRow from "apps/dex/components/SearchModal/ImportRow";
import { CurrencyModalView } from "apps/dex/components/SearchModal/CurrencySearchModal";

const Wrapper = styled(Box)`
  width: 100%;
  height: calc(100% - 145px);
  position: relative;
  padding-bottom: 60px;
`;

const Footer = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-top: 1px solid #061023;
  padding: 20px;
  text-align: center;
  z-index: 9;
`;

type ManageTokensProps = {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
};

const ManageTokens: FC<ManageTokensProps> = ({
  setModalView,
  setImportToken,
}) => {
  const { chainId } = useActiveWeb3React();

  const [searchQuery, setSearchQuery] = useState<string>("");

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event: any) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
  }, []);

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);

  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens();
  const removeToken = useRemoveUserAddedToken();

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address);
      });
    }
  }, [removeToken, userAddedTokens, chainId]);

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <RowBetween key={token.address} width="100%">
          <RowFixed>
            <CurrencyLogo currency={token} size={"20px"} />
            <ExternalLink
              href={getBlockScanLink(chainId, token.address, "address")}
            >
              <TYPE.main ml={"10px"} fontWeight={600}>
                {token.symbol}
              </TYPE.main>
            </ExternalLink>
          </RowFixed>
          <RowFixed alignItems={"center"}>
            <ExternalLinkIcon
              href={getBlockScanLink(chainId, token.address, "address")}
            />
            <TrashIcon onClick={() => removeToken(chainId, token.address)} />
          </RowFixed>
        </RowBetween>
      ))
    );
  }, [userAddedTokens, chainId, removeToken]);

  return (
    <Wrapper>
      <Column style={{ width: "100%", flex: "1 1" }}>
        <PaddedColumn gap="14px">
          <Row>
            <SearchInput
              type="text"
              id="token-search-input"
              placeholder={"0x0000"}
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
            />
          </Row>
          {searchQuery !== "" && !isAddressSearch && (
            <TYPE.error error={true}>Enter valid token address</TYPE.error>
          )}
          {searchToken && (
            <Card bgcolor="#061023" padding="10px 0">
              <ImportRow
                token={searchToken}
                showImportView={() =>
                  setModalView(CurrencyModalView.importToken)
                }
                setImportToken={setImportToken}
                style={{ height: "fit-content" }}
              />
            </Card>
          )}
        </PaddedColumn>
        <Separator />
        <PaddedColumn gap="lg">
          <RowBetween>
            <TYPE.main fontWeight={600}>
              {userAddedTokens?.length} Custom{" "}
              {userAddedTokens.length === 1 ? "Token" : "Tokens"}
            </TYPE.main>
            {userAddedTokens.length > 0 && (
              <ButtonText onClick={handleRemoveAll}>
                <TYPE.blue>Clear all</TYPE.blue>
              </ButtonText>
            )}
          </RowBetween>
          {tokenList}
        </PaddedColumn>
      </Column>
      <Footer>
        <TYPE.white>
          Tip: Custom tokens are stored locally in your browser
        </TYPE.white>
      </Footer>
    </Wrapper>
  );
};

export default ManageTokens;
