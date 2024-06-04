import { Box, styled } from "@mui/material";

const Divider = styled(Box)`
  height: 1px;
  background-color: #131f35;
`;

export const BlockedWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BlockedMessageWrapper = styled(Box)`
  border: 1px solid #002f2d;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  max-width: 80%;
`;

export const IconWrapper = styled(Box)`
  position: absolute;
  right: 0;
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fafafa;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

export const Hover = styled(Box)<{ fade?: boolean }>`
  :hover {
    cursor: pointer;
    opacity: ${({ fade }) => fade && "0.7"};
  }
`;

export const StyledIcon = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #43fff6;
`;

const EmptyCard = styled(Box)<{ height?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: #fafafa;
  height: ${({ height }) => (height ? height : "200px")};
`;

export const PageWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  padding-bottom: 80px;
`;

export const ContentWrapper = styled(Box)`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
  @media screen and (max-width: 600px) {
    padding: 0;
  }
`;

export const ContentWrapperLarge = styled(Box)`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  padding: 0 2rem;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 1440px;
  width: 100%;

  @media screen and (max-width: 1282px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  @media screen and (max-width: 767px) {
    padding: 0;
  }
`;

export const FullWrapper = styled(Box)`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;

  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

export { Divider, EmptyCard };
