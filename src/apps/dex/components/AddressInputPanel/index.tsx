import { useContext, useCallback } from "react";
import styled, { ThemeContext } from "styled-components";
import useENS from "apps/dex/hooks/useENS";
import { useActiveWeb3React } from "apps/dex/hooks";
import { ExternalLink, TYPE } from "apps/dex/theme";
import { AutoColumn } from "apps/dex/components/Column";
import { RowBetween } from "apps/dex/components/Row";
import { getBlockScanLink } from "apps/dex/utils";

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
  width: 100%;
`;

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid ${({ error, theme }) => (error ? theme.red1 : theme.bg2)};
  transition: border-color 300ms
      ${({ error }) => (error ? "step-end" : "step-start")},
    color 500ms ${({ error }) => (error ? "step-end" : "step-start")};
  background-color: ${({ theme }) => theme.bg1};
`;

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`;

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? "step-end" : "step-start")};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.white)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.white};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

export default function AddressInputPanel({
  id,
  value,
  onChange,
}: {
  id?: string;
  // the typed string value
  value: string;
  // triggers whenever the typed value changes
  onChange: (value: string) => void;
}) {
  const { chainId } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  const { address, loading, name } = useENS(value);

  const handleInput = useCallback(
    (event: any) => {
      const input = event.target.value;
      const withoutSpaces = input.replace(/\s+/g, "");
      onChange(withoutSpaces);
    },
    [onChange]
  );

  const error = Boolean(value.length > 0 && !loading && !address);

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.black color={theme?.text2} fontWeight={600} fontSize={13}>
                Recipient
              </TYPE.black>
              {address && chainId && (
                <ExternalLink
                  href={getBlockScanLink(chainId, name ?? address, "address")}
                  style={{ fontSize: "14px" }}
                >
                  (View on Blocksscan)
                </ExternalLink>
              )}
            </RowBetween>
            <Input
              className="recipient-address-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Wallet Address or ENS name"
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              onChange={handleInput}
              value={value}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  );
}
