import { CSSProperties, FC } from "react";
import { styled } from "@mui/material";
import useHttpLocations from "apps/dex/hooks/useHttpLocations";
import Logo from "apps/dex/components/Logo";

const StyledListLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

type ListLogoProps = {
  logoURI: string;
  size?: string;
  style?: CSSProperties;
  alt?: string;
};

const ListLogo: FC<ListLogoProps> = ({
  logoURI,
  style,
  size = "24px",
  alt,
}) => {
  const srcs: string[] = useHttpLocations(logoURI);

  return <StyledListLogo alt={alt} size={size} srcs={srcs} style={style} />;
};

export default ListLogo;
