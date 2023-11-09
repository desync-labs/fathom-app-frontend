import { FC, ReactNode } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import UpSrc from "assets/svg/arrow-up.svg";
import DownSrc from "assets/svg/arrow-down.svg";

export enum RiseLabelType {
  UP = "up",
  DOWN = "down",
}

type RiseLabelProps = {
  children: ReactNode;
  type?: RiseLabelType;
};

const RiseWrapper = styled(Box)`
  padding: 4px 8px;
  gap: 5px;
  background: rgba(61, 163, 41, 0.15);
  border-radius: 6px;
  color: #3da329;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  display: flex;
  align-items: center;

  &.down {
    background: rgba(221, 60, 60, 0.15);
    color: #dd3c3c;
  }
`;

const RiseLabel: FC<RiseLabelProps> = ({
  children,
  type = RiseLabelType.UP,
}) => {
  return (
    <RiseWrapper className={type}>
      <img
        src={type === RiseLabelType.UP ? UpSrc : DownSrc}
        alt="rise-label"
        width={8}
      />
      {children}
    </RiseWrapper>
  );
};

export default RiseLabel;
