import { Placement } from "@popperjs/core";
import { transparentize } from "polished";
import { FC, memo, ReactNode, useRef, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import * as Portal from "@reach/portal";
import useInterval from "apps/charts/hooks";

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 9999;

  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;

  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.borderBG};
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.9, theme.shadow1)};
  color: ${({ theme }) => theme.text2};
  border-radius: 8px;
`;

const ReferenceElement = styled.div`
  display: inline-block;
`;

export interface PopoverProps {
  content: ReactNode;
  show: boolean;
  children?: ReactNode;
  placement?: Placement;
}

const Popover: FC<PopoverProps> = ({
  content,
  show,
  children,
  placement = "auto",
}) => {
  const referenceElement = useRef<HTMLDivElement>(null);
  const popperElement = useRef<HTMLDivElement>(null);
  const [arrowElement] = useState<HTMLDivElement>();
  const { styles, update, attributes } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement,
      strategy: "fixed",
      modifiers: [
        { name: "offset", options: { offset: [8, 8] } },
        { name: "arrow", options: { element: arrowElement } },
      ],
    }
  );

  useInterval(update as () => void, show ? 100 : null);

  return (
    <>
      <ReferenceElement ref={referenceElement}>{children}</ReferenceElement>
      <Portal>
        <PopoverContainer
          show={show}
          ref={popperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {content}
        </PopoverContainer>
      </Portal>
    </>
  );
};

export default memo(Popover);
