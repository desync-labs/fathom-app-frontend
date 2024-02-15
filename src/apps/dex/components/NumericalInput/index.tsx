import { FC, HTMLProps, memo } from "react";
import { styled } from "@mui/material";
import { escapeRegExp } from "apps/dex/utils";

const StyledInput = styled("input")<{
  error?: boolean;
  fontSize?: string;
  align?: string;
}>`
  color: ${({ error }) => (error ? "#FD4040" : "#ffffff")};
  width: 0;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: ${({ fontSize }) => fontSize ?? "24px"};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type="number"] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: #ffffff;
  }
`;

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

type InputProps = {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: boolean;
  fontSize?: string;
  align?: "right" | "left";
} & Omit<HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">;

export const Input: FC<InputProps> = memo(
  ({ value, onUserInput, placeholder, ...rest }) => {
    const enforcer = (nextUserInput: string) => {
      if (
        nextUserInput === "" ||
        inputRegex.test(escapeRegExp(nextUserInput))
      ) {
        onUserInput(nextUserInput);
      }
    };

    return (
      <StyledInput
        {...rest}
        value={value}
        onChange={(event) => {
          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          enforcer(event.target.value.replace(/,/g, "."));
        }}
        // universal input options
        inputMode="decimal"
        title="Token Amount"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={placeholder || "0.0"}
        minLength={1}
        maxLength={79}
        spellCheck="false"
      />
    );
  }
);
