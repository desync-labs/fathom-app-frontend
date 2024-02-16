import { FC, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/material";
import { lighten, darken } from "polished";

type WrappedLinkProps = {
  external?: boolean;
  children: ReactNode;
} & Record<string, any>;

const WrappedLink: FC<WrappedLinkProps> = (props) => {
  const { external, children, ...rest } = props;
  return (
    <a
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
};

const Link = styled(WrappedLink)`
  color: ${({ color }) => (color ? color : "#FFFFFF")};
`;

export default Link;

export const CustomLink = styled(RouterLink)`
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;
  color: ${({ color }) => (color ? color : "#fff")};

  &:visited {
    color: ${({ color }) =>
      color ? lighten(0.1, color) : lighten(0.1, "#fff")};
  }

  &:hover {
    cursor: pointer;
    text-decoration: none;
    color: ${({ color }) => (color ? darken(0.1, color) : darken(0.1, "#fff"))};
  }
`;

export const BasicLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
  &:hover {
    cursor: pointer;
    text-decoration: none;
  }
`;
