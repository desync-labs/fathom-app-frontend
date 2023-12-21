import { FC, useCallback, useState } from "react";
import styled from "styled-components";
import Popover, { PopoverProps } from "apps/dex/components/Popover";

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
`;

interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: string;
}

const Tooltip: FC<TooltipProps> = ({ text, ...rest }: TooltipProps) => {
  return (
    <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
  );
};

export default Tooltip;

export const MouseoverTooltip: FC<Omit<TooltipProps, "show">> = ({
  children,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  );
};
