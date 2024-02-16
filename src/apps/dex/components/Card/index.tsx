import { FC, ReactNode } from "react";
import { Box, styled, Typography } from "@mui/material";

const Card = styled(Box)<{
  width?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  border-radius: 8px;
  padding: 1.25rem;
`;

export default Card;

export const LightCard = styled(Card)<{ padding?: string }>`
  padding: ${({ padding }) => (padding ? padding : "1.25rem")};
  border: 1px solid #061023;
  background-color: #131f35;
`;

export const LightGreyCard = styled(Card)`
  background-color: #061023;
`;

export const GreyCard = styled(Card)`
  background-color: #131f35;
  border: 1px solid #253656;
`;

export const OutlineCard = styled(Card)`
  border: 1px solid #131f35;
`;

const BlueCardStyled = styled(Card)`
  background-color: #22354f;
  color: #253656;
  border-radius: 12px;
  width: fit-content;
`;

export const BlueCard: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BlueCardStyled>
      <Typography fontWeight={500} color="#2172E5">
        {children}
      </Typography>
    </BlueCardStyled>
  );
};
