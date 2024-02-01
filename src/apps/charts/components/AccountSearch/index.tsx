import { FC, memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, styled } from "@mui/material";
import { ButtonLight, ButtonFaded } from "apps/charts/components/ButtonStyled";
import { AutoRow, RowBetween } from "apps/charts/components/Row";
import { isAddress } from "apps/charts/utils";
import { useSavedAccounts } from "apps/charts/contexts/LocalStorage";
import { AutoColumn } from "apps/charts/components/Column";
import { TYPE } from "apps/charts/Theme";

import CloseIcon from "@mui/icons-material/Close";

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  border-radius: 12px;
`;

const Input = styled("input")`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  outline: none;
  padding: 12px 16px;
  border-radius: 8px;
  color: #fafafa;
  background-color: #0e1d34;
  font-size: 16px;
  margin-right: 1rem;
  border: 1px solid #253656;

  ::placeholder {
    color: #fff;
    font-size: 14px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`;

const AccountLink = styled("span")`
  display: flex;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
`;

const DashGrid = styled(Box)`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr;
  grid-template-areas: "account";
  padding: 0 4px;

  > * {
    justify-content: flex-end;
  }
`;

export const HeaderWrapper = styled(DashGrid)`
  background: #131f35;
  border-radius: 8px;
  padding: 0.5rem 1.125rem 0.5rem;
  color: #5977a0;
  text-transform: uppercase;
  font-size: 11px;
`;

const CloseIconButton = styled(IconButton)`
  padding: 0;
  :hover {
    background-color: unset;
    opacity: 0.7;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;

type AccountSearchProps = {
  small?: boolean;
};

const AccountSearch: FC<AccountSearchProps> = ({ small }) => {
  const [accountValue, setAccountValue] = useState<string>("");
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts();
  const navigate = useNavigate();

  function handleAccountSearch() {
    if (isAddress(accountValue)) {
      navigate("/charts/account/" + accountValue);
      if (!savedAccounts.includes(accountValue)) {
        addAccount(accountValue);
      }
    }
  }

  return (
    <AutoColumn gap={"1rem"}>
      {!small && (
        <>
          <AutoRow>
            <Wrapper>
              <Input
                placeholder="0x..."
                onChange={(e) => {
                  setAccountValue(e.target.value);
                }}
              />
            </Wrapper>
            <ButtonLight onClick={handleAccountSearch}>
              Load Account Details
            </ButtonLight>
          </AutoRow>
        </>
      )}

      <AutoColumn>
        {!small && (
          <>
            <HeaderWrapper style={{ height: "fit-content", marginTop: "2rem" }}>
              Saved Accounts
            </HeaderWrapper>
            {savedAccounts?.length > 0 ? (
              savedAccounts.map((account: string) => {
                return (
                  <DashGrid
                    key={account}
                    style={{
                      height: "fit-content",
                      padding: "0.5rem 1.125rem",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      onClick={() => navigate("/charts/account/" + account)}
                    >
                      <AccountLink>{account?.slice(0, 42)}</AccountLink>
                      <CloseIconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAccount(account);
                        }}
                      >
                        <CloseIcon />
                      </CloseIconButton>
                    </Box>
                  </DashGrid>
                );
              })
            ) : (
              <TYPE.light style={{ marginTop: "1rem" }}>
                No saved accounts
              </TYPE.light>
            )}
          </>
        )}

        {small && (
          <AutoColumn gap={"12px"}>
            <TYPE.main>{"Accounts"}</TYPE.main>
            {savedAccounts?.length > 0 ? (
              savedAccounts.map((account: string) => {
                return (
                  <RowBetween key={account} gap={"8px"}>
                    <ButtonFaded
                      onClick={() => navigate("/charts/account/" + account)}
                    >
                      {small ? (
                        <TYPE.header fontSize={"12px"}>
                          {account?.slice(0, 6) +
                            "..." +
                            account?.slice(38, 42)}
                        </TYPE.header>
                      ) : (
                        <AccountLink>{account?.slice(0, 42)}</AccountLink>
                      )}
                    </ButtonFaded>
                    <CloseIconButton onClick={() => removeAccount(account)}>
                      <CloseIcon />
                    </CloseIconButton>
                  </RowBetween>
                );
              })
            ) : (
              <TYPE.light>No pinned wallets</TYPE.light>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </AutoColumn>
  );
};

export default memo(AccountSearch);
