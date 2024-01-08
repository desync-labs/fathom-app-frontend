import styled from "styled-components";
import { Box } from "rebass";

const Divider = styled(Box)`
  height: 1px;
  background-color: ${({ theme }) => theme.divider};
`;

export const BlockedWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BlockedMessageWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.text3};
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  max-width: 80%;
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text1};

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

export const Hover = styled.div<{ fade?: boolean }>`
  :hover {
    cursor: pointer;
    opacity: ${({ fade }) => fade && "0.7"};
  }
`;

export const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text5};
`;

const EmptyCard = styled.div<{ height?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  height: ${({ height }) => (height ? height : "200px")};
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  padding-bottom: 80px;

  @media screen and (max-width: 600px) {
    & > * {
      padding: 0 12px;
    }
  }
`;

export const ContentWrapper = styled.div`
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

export const ContentWrapperLarge = styled.div`
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

export const FullWrapper = styled.div`
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
