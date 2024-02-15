import { Box, styled } from "@mui/material";
import { AutoColumn } from "apps/dex/components/Column";

import uImage from "apps/dex/assets/images/big_unicorn.png";
import noise from "apps/dex/assets/images/noise.png";

export const DataCard = styled(AutoColumn)<{ disabled?: boolean }>`
  background: #00fff9;
  border-radius: 12px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

export const CardBGImage = styled("span")<{ desaturate?: boolean }>`
  background: url(${uImage});
  width: 1000px;
  height: 600px;
  position: absolute;
  border-radius: 12px;
  opacity: 0.4;
  top: -100px;
  left: -100px;
  transform: rotate(-15deg);
  user-select: none;

  ${({ desaturate }) => desaturate && `filter: saturate(0)`}
`;

export const CardNoise = styled("span")`
  background: url(${noise});
  background-size: cover;
  mix-blend-mode: overlay;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
`;

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && "0.4"};
`;

export const Break = styled(Box)`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  height: 1px;
`;
