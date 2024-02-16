import { FC, useState } from "react";
import { Token, Currency } from "into-the-fathom-swap-sdk";
import { transparentize } from "polished";
import { Box, styled } from "@mui/material";

import { TYPE, CloseIcon } from "apps/dex/theme";
import Card from "apps/dex/components/Card";
import { AutoColumn } from "apps/dex/components/Column";
import { RowBetween, RowFixed, AutoRow } from "apps/dex/components/Row";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { ButtonPrimary } from "apps/dex/components/Button";
import { SectionBreak } from "apps/dex/components/swap/styleds";
import { useAddUserToken } from "apps/dex/state/user/hooks";
import { getBlockScanLink } from "apps/dex/utils";
import { useActiveWeb3React } from "apps/dex/hooks";
import { ExternalLink } from "apps/dex/theme/components";
import { useCombinedInactiveList } from "apps/dex/state/lists/hooks";
import ListLogo from "apps/dex/components/ListLogo";
import {
  PaddedColumn,
  Checkbox,
} from "apps/dex/components/SearchModal/styleds";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Wrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const ModalContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 65px);
  padding: 20px;
`;

const WarningWrapper = styled(Card)<{ highWarning: boolean }>`
  background-color: ${({ highWarning }) =>
    highWarning
      ? transparentize(0.8, "#FD4040")
      : transparentize(0.8, "#F3841E")};
  width: fit-content;
`;

const AddressText = styled(TYPE.blue)`
  font-size: 12px;

  ${({ theme }) => theme.breakpoints.up("sm")} {
    font-size: 10px;
  }
`;

interface ImportProps {
  tokens: Token[];
  onBack?: () => void;
  onDismiss?: () => void;
  handleCurrencySelect?: (currency: Currency) => void;
}

export const ImportToken: FC<ImportProps> = ({
  tokens,
  onBack,
  onDismiss,
  handleCurrencySelect,
}) => {
  const { chainId } = useActiveWeb3React();

  const [confirmed, setConfirmed] = useState(false);

  const addToken = useAddUserToken();

  // use for showing an import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList();

  // higher warning severity if either is not on a list
  const fromLists =
    (chainId && inactiveTokenList?.[chainId]?.[tokens[0]?.address]?.list) ||
    (chainId && inactiveTokenList?.[chainId]?.[tokens[1]?.address]?.list);

  return (
    <Wrapper>
      <PaddedColumn gap="14px" style={{ width: "100%", flex: "1 1" }}>
        <RowBetween>
          {onBack ? (
            <ArrowBackIcon style={{ cursor: "pointer" }} onClick={onBack} />
          ) : (
            <div></div>
          )}
          <TYPE.mediumHeader>
            Import {tokens.length > 1 ? "Tokens" : "Token"}
          </TYPE.mediumHeader>
          {onDismiss ? <CloseIcon onClick={onDismiss} /> : <div></div>}
        </RowBetween>
      </PaddedColumn>
      <SectionBreak />
      <ModalContentWrapper>
        {tokens.map((token) => {
          const list =
            chainId && inactiveTokenList?.[chainId]?.[token.address]?.list;
          return (
            <Card
              bgcolor={"#061023"}
              key={"import" + token.address}
              className=".token-warning-container"
            >
              <AutoColumn gap="10px">
                <AutoRow align="center">
                  <CurrencyLogo currency={token} size={"24px"} />
                  <TYPE.body ml="8px" mr="8px" fontWeight={500}>
                    {token.symbol}
                  </TYPE.body>
                  <TYPE.gray fontWeight={300}>{token.name}</TYPE.gray>
                </AutoRow>
                {chainId && (
                  <ExternalLink
                    href={getBlockScanLink(chainId, token.address, "address")}
                  >
                    <AddressText>{token.address}</AddressText>
                  </ExternalLink>
                )}
                {list !== undefined ? (
                  <RowFixed>
                    {list.logoURI && (
                      <ListLogo logoURI={list.logoURI} size="12px" />
                    )}
                    <TYPE.small ml="6px" color={"#00332F"}>
                      via {list.name}
                    </TYPE.small>
                  </RowFixed>
                ) : (
                  <WarningWrapper
                    highWarning={true}
                    sx={{ borderRadius: "8px", padding: "4px" }}
                  >
                    <RowFixed>
                      <ErrorOutlineIcon
                        sx={{ color: "#FD4040", width: "10px", height: "10px" }}
                      />
                      <TYPE.body
                        color={"#FD4040"}
                        ml="4px"
                        fontSize="10px"
                        fontWeight={500}
                      >
                        Unknown Source
                      </TYPE.body>
                    </RowFixed>
                  </WarningWrapper>
                )}
              </AutoColumn>
            </Card>
          );
        })}

        <Card
          style={{
            backgroundColor: fromLists
              ? transparentize(0.8, "#F3841E")
              : transparentize(0.8, "#FD4040"),
          }}
        >
          <AutoColumn
            justify="center"
            style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
          >
            <ErrorOutlineIcon
              sx={{
                color: fromLists ? "#F3841E" : "#FD4040",
                width: "32px",
                height: "32px",
              }}
            />
            <TYPE.body
              fontWeight={600}
              fontSize={20}
              color={fromLists ? "#F3841E" : "#FD4040"}
            >
              Trade at your own risk!
            </TYPE.body>
          </AutoColumn>

          <AutoColumn
            style={{ textAlign: "center", gap: "16px", marginBottom: "12px" }}
          >
            <TYPE.body
              fontWeight={400}
              color={fromLists ? "#F3841E" : "#FD4040"}
            >
              Anyone can create a token, including creating fake versions of
              existing tokens that claim to represent projects.
            </TYPE.body>
            <TYPE.body
              fontWeight={600}
              color={fromLists ? "#F3841E" : "#FD4040"}
            >
              If you purchase this token, you may not be able to sell it back.
            </TYPE.body>
          </AutoColumn>
          <AutoRow
            justify="center"
            style={{ cursor: "pointer" }}
            onClick={() => setConfirmed(!confirmed)}
          >
            <Checkbox
              className=".understand-checkbox"
              name="confirmed"
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            <TYPE.body
              ml="10px"
              fontSize="16px"
              color={fromLists ? "#F3841E" : "#FD4040"}
              fontWeight={500}
            >
              I understand
            </TYPE.body>
          </AutoRow>
        </Card>
        <ButtonPrimary
          disabled={!confirmed}
          altDisabledStyle={true}
          borderRadius="20px"
          padding="10px 1rem"
          onClick={() => {
            tokens.map((token) => addToken(token));
            handleCurrencySelect && handleCurrencySelect(tokens[0]);
          }}
          className=".token-dismiss-button"
        >
          Import
        </ButtonPrimary>
      </ModalContentWrapper>
    </Wrapper>
  );
};
