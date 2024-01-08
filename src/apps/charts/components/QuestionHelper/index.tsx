import { FC, memo, useCallback, useState } from "react";
import { HelpCircle as Question } from "react-feather";
import styled from "styled-components";
import Popover, { PopoverProps } from "apps/charts/components/Popover";

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.primaryText2};
  color: ${({ theme }) => theme.text2};

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
`;

interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: string;
  [key: string]: any;
}

export const Tooltip: FC<TooltipProps> = ({ text, ...rest }) => {
  return (
    <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
  );
};

type QuestionHelper = {
  text: string;
  disabled?: boolean;
};

const QuestionHelper: FC<QuestionHelper> = ({ text, disabled }) => {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show && !disabled}>
        <QuestionWrapper
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <Question size={11} />
        </QuestionWrapper>
      </Tooltip>
    </span>
  );
};

export default memo(QuestionHelper);
