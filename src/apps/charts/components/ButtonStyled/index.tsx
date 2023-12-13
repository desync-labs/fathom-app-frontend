import { Button as RebassButton } from "rebass/styled-components";
import styled from "styled-components";
import { ChevronDown, ChevronUp } from "react-feather";
import { RowBetween } from "apps/charts/components/Row";
import { StyledIcon } from "apps/charts/components";
import { FC, ReactNode } from "react";

const Base = styled(RebassButton)`
  padding: 8px 12px;
  font-size: 0.825rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
  border-bottom-right-radius: ${({ open }) => open && "0"};
  border-bottom-left-radius: ${({ open }) => open && "0"};
`;

export default function ButtonStyled({
  children,
  ...rest
}: {
  children: ReactNode;
}) {
  return <Base {...rest}>{children}</Base>;
}

export const ButtonLight = styled(Base)`
  background: transparent;

  border: 1px solid ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.bg3};

  min-width: fit-content;
  border-radius: 12px;
  white-space: nowrap;

  a {
    color: ${({ theme }) => theme.text5};
    :hover {
      color: ${({ theme }) => theme.white};
    }
  }

  :hover {
    border: 1px solid ${({ theme }) => theme.borderBG};
    color: ${({ theme }) => theme.white};
  }
`;

type ButtonDropdownProps = {
  disabled?: boolean;
  children: ReactNode;
  open: boolean;
};

export const ButtonDropdown: FC<ButtonDropdownProps> = ({
  disabled = false,
  children,
  open,
  ...rest
}) => {
  return (
    <ButtonFaded {...rest} disabled={disabled} open={open}>
      <RowBetween>
        <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
        {open ? (
          <StyledIcon>
            <ChevronUp size={24} />
          </StyledIcon>
        ) : (
          <StyledIcon>
            <ChevronDown size={24} />
          </StyledIcon>
        )}
      </RowBetween>
    </ButtonFaded>
  );
};

export const ButtonDark = styled(Base)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text3};
  width: fit-content;
  border-radius: 12px;
  white-space: nowrap;

  :hover {
    background: transparent;
    border: 1px solid ${({ theme }) => theme.bg3};
    color: #fff;
  }
`;

export const ButtonFaded = styled(Base)`
  background-color: ${({ theme }) => theme.bg1};
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  border: 1px solid ${({ theme }) => theme.borderBG}
  :hover {
    opacity: 0.5;
  }
`;

export const OptionButton = styled.div<{
  active?: boolean;
  disabled?: boolean;
}>`
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  padding: 6px;
  border-radius: 6px;
  background-color: ${({ active }) => active && "#324567"};
  color: ${({ theme }) => theme.white};

  :hover {
    cursor: ${({ disabled }) => !disabled && "pointer"};
  }
`;
