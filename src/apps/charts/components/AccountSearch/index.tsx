import { FC, useState } from "react";
import "feather-icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ButtonLight, ButtonFaded } from "apps/charts/components/ButtonStyled";
import { AutoRow, RowBetween } from "apps/charts/components/Row";
import { isAddress } from "apps/charts/utils";
import { useSavedAccounts } from "apps/charts/contexts/LocalStorage";
import { AutoColumn } from "apps/charts/components/Column";
import { TYPE } from "apps/charts/Theme";
import { Hover, StyledIcon } from "apps/charts/components";
import { Flex } from "rebass";

import { X } from "react-feather";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  border-radius: 12px;
`;

const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  outline: none;
  padding: 12px 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  font-size: 16px;
  margin-right: 1rem;
  border: 1px solid ${({ theme }) => theme.borderBG};

  ::placeholder {
    color: ${({ theme }) => theme.white};
    font-size: 14px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`;

const AccountLink = styled.span`
  display: flex;
  cursor: pointer;
  color: ${({ theme }) => theme.link};
  font-size: 14px;
  font-weight: 500;
`;

const DashGrid = styled.div`
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
  background: ${({ theme }) => theme.headerBackground};
  border-radius: 8px;
  padding: 0.5rem 1.125rem 0.5rem;
  color: ${({ theme }) => theme.primaryText2};
  text-transform: uppercase;
  font-size: 11px;
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
                    <Flex
                      justifyContent="space-between"
                      onClick={() => navigate("/charts/account/" + account)}
                    >
                      <AccountLink>{account?.slice(0, 42)}</AccountLink>
                      <Hover
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAccount(account);
                        }}
                      >
                        <StyledIcon>
                          <X size={16} />
                        </StyledIcon>
                      </Hover>
                    </Flex>
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
          <>
            <TYPE.main marginBottom="1rem">{"Accounts"}</TYPE.main>
            {savedAccounts?.length > 0 ? (
              savedAccounts.map((account: string) => {
                return (
                  <RowBetween key={account}>
                    <ButtonFaded
                      onClick={() => navigate("/charts/account/" + account)}
                    >
                      {small ? (
                        <TYPE.header>
                          {account?.slice(0, 6) +
                            "..." +
                            account?.slice(38, 42)}
                        </TYPE.header>
                      ) : (
                        <AccountLink>{account?.slice(0, 42)}</AccountLink>
                      )}
                    </ButtonFaded>
                    <Hover onClick={() => removeAccount(account)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                );
              })
            ) : (
              <TYPE.light>No pinned wallets</TYPE.light>
            )}
          </>
        )}
      </AutoColumn>
    </AutoColumn>
  );
};

export default AccountSearch;
