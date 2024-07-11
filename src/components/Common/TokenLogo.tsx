import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const ImageWrapper = styled(Box)`
  width: 32px;
  height: 32px;
  min-width: 32px;
  overflow: hidden;
  border-radius: 16px;
`;

type TokenLogoProps = {
  src: string;
  alt: string;
};

const TokenLogo: FC<TokenLogoProps> = ({ src, alt }) => {
  return (
    <ImageWrapper>
      <img src={src} alt={alt} width={32} />
    </ImageWrapper>
  );
};

export default TokenLogo;
