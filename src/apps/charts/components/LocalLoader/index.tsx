import { FC, memo } from "react";
import { Box, css, keyframes, styled } from "@mui/material";
import imgSrc from "apps/charts/assets/Fathom-app-logo.svg";

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Wrapper = styled(Box)<{ fill?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  pointer-events: none;
  ${(props) =>
    props.fill && !props.height
      ? css`
          height: calc(100vh - 191px);
          @media (max-width: 767px) {
            height: calc(100vh - 238px);
          }
        `
      : css`
          height: 180px;
        `}
`;

const AnimatedImg = styled(Box)<{ fill?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${({ fill }) => (fill ? "calc(100vh - 191px)" : "inherit")};
  animation: ${pulse} 800ms linear infinite;
`;

type LocalLoader = {
  fill?: string;
};

const LocalLoader: FC<LocalLoader> = ({ fill }) => {
  return (
    <Wrapper fill={fill}>
      <AnimatedImg fill={fill}>
        <img src={imgSrc} alt="loading-icon" style={{ width: "160px" }} />
      </AnimatedImg>
    </Wrapper>
  );
};

export default memo(LocalLoader);
