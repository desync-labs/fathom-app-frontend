import { useCallback, FC } from "react";
import { Box, styled } from "@mui/material";
import { useActiveWeb3React } from "apps/dex/hooks";
import { ExternalLink, TYPE } from "apps/dex/theme";
import { getBlockScanLink } from "apps/dex/utils";
import { AutoColumn } from "apps/dex/components/Column";
import { RowBetween } from "apps/dex/components/Row";

const InputPanel = styled(Box)`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  border-radius: 1.25rem;
  background-color: #131f35;
  z-index: 1;
  width: 100%;
`;

const ContainerRow = styled(Box)<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid ${({ error }) => (error ? "#FD4040" : "#131F35")};
  transition: border-color 300ms
      ${({ error }) => (error ? "step-end" : "step-start")},
    color 500ms ${({ error }) => (error ? "step-end" : "step-start")};
  background-color: #131f35;
`;

const InputContainer = styled(Box)`
  flex: 1;
  padding: 1rem;
`;

const Input = styled("input")<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: #131f35;
  transition: color 300ms ${({ error }) => (error ? "step-end" : "step-start")};
  color: ${({ error }) => (error ? "#FD4040" : "#fff")};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: #ffffff;
  }
  padding: 0;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

type AddressInputPanleProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
};

const AddressInputPanel: FC<AddressInputPanleProps> = ({
  id,
  value,
  onChange,
}) => {
  const { chainId } = useActiveWeb3React();

  const handleInput = useCallback(
    (event: any) => {
      const input = event.target.value;
      const withoutSpaces = input.replace(/\s+/g, "");
      onChange(withoutSpaces);
    },
    [onChange]
  );

  const error = Boolean(value.length > 0 && !value);

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.black color={"#4F658C"} fontWeight={600} fontSize={13}>
                Recipient
              </TYPE.black>
              {value && chainId && (
                <ExternalLink
                  href={getBlockScanLink(chainId, value, "address")}
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
};

export default AddressInputPanel;
