import { HTMLProps, MouseEvent, useCallback } from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga4";
import { styled, keyframes, Button, Box } from "@mui/material";

import CloseIconMui from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const ButtonText = styled(Button)`
  outline: none;
  border: none;
  font-size: inherit;
  text-transform: none;
  padding: 0;
  margin: 0;
  background: none;
  cursor: pointer;

  :hover {
    background: none;
    opacity: 0.7;
  }

  :focus {
    text-decoration: underline;
  }
`;

export const CloseIcon = styled(CloseIconMui)<{ onClick: () => void }>`
  cursor: pointer;
`;

export const IconWrapper = styled(Box)<{
  stroke?: string;
  size?: string;
  marginRight?: string;
  marginLeft?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size ?? "20px"};
  height: ${({ size }) => size ?? "20px"};
  margin-right: ${({ marginRight }) => marginRight ?? 0};
  margin-left: ${({ marginLeft }) => marginLeft ?? 0};
  & > * {
    stroke: ${({ stroke }) => stroke ?? "#ffffff"};
  }
`;

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled(Button)<{ disabled?: boolean }>`
  border: none;
  text-decoration: none;
  text-transform: unset;
  background: none;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  color: ${({ disabled }) => (disabled ? "#565A69" : "#ffffff")};
  font-weight: 500;

  :hover {
    background: none;
    text-decoration: ${({ disabled }) => (disabled ? null : "underline")};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? null : "underline")};
  }

  :active {
    text-decoration: none;
  }
`;

// An internal link from the react-router-dom library that is correctly styled
export const StyledInternalLink = styled(Link)<{
  padding?: string;
  borderRadius?: string;
  width?: string;
}>`
  text-decoration: none;
  cursor: pointer;
  color: #ffffff;
  font-weight: 500;
  padding: ${({ padding }) => (padding ? padding : "auto")};
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : "0")};
  width: ${({ width }) => (width ? width : "auto")};

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

const StyledLink = styled("a")`
  text-decoration: none;
  cursor: pointer;
  color: #ffffff;
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

const LinkIconWrapper = styled("a")`
  text-decoration: none;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;

  :hover {
    text-decoration: none;
    opacity: 0.7;
  }

  :focus {
    outline: none;
    text-decoration: none;
  }

  :active {
    text-decoration: none;
  }
`;

export const LinkIcon = styled(OpenInNewIcon)`
  height: 18px;
  width: 18px;
  margin-left: 10px;
  color: #ffffff;
`;

export const TrashIcon = styled(DeleteOutlineIcon)`
  height: 20px;
  width: 20px;
  margin-left: 10px;
  color: #ffffff;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;

  :hover {
    opacity: 0.7;
  }
`;

const rotateImg = keyframes`
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  100% {
    transform: perspective(1000px) rotateY(360deg);
  }
`;

export const FthmTokenAnimated = styled("img")`
  animation: ${rotateImg} 5s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  padding: 0.5rem 0 1rem 0;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15));
`;

/**
 * Outbound link that handles firing Google Analytics events
 */
export function ExternalLink({
  target = "_blank",
  href,
  rel = "noopener noreferrer",
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, "as" | "ref" | "onClick"> & {
  href: string;
}) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === "_blank" || event.ctrlKey || event.metaKey) {
        ReactGA.event({
          category: "link",
          action: "outboundLink",
          label: href,
        });
      } else {
        event.preventDefault();
        // send a ReactGA event and then trigger a location change
        ReactGA.event({
          category: "link",
          action: "outboundLink",
          label: href,
        });
      }
    },
    [href, target]
  );
  return (
    <StyledLink
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      {...rest}
    />
  );
}

export function ExternalLinkIcon({
  target = "_blank",
  href,
  rel = "noopener noreferrer",
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, "as" | "ref" | "onClick"> & {
  href: string;
}) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === "_blank" || event.ctrlKey || event.metaKey) {
        ReactGA.event({
          category: "link",
          action: "outboundLink",
          label: href,
        });
      } else {
        event.preventDefault();
        // send a ReactGA event and then trigger a location change
        ReactGA.event({
          category: "link",
          action: "outboundLink",
          label: href,
        });
      }
    },
    [href, target]
  );
  return (
    <LinkIconWrapper
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      {...rest}
    >
      <LinkIcon />
    </LinkIconWrapper>
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled("img")`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`;

export const CustomLightSpinner = styled(Spinner)<{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`;

export const HideSmall = styled(Box)`
  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;
  }
`;
