import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";
import { useLocation } from "react-router-dom";
import { forwardRef, AnchorHTMLAttributes } from "react";
import { Link as ReactLink } from "react-router-dom";

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled("a")({});

interface LinkComposedProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}

export const LinkComposed = forwardRef<HTMLAnchorElement, LinkComposedProps>(
  function LinkComposed(props, ref) {
    const { to, className, children } = props;
    return (
      <ReactLink to={to} ref={ref} className={className}>
        {children}
      </ReactLink>
    );
  }
);

export type LinkProps = {
  as?: string;
  href: { pathname: string } | string;
  linkAs?: string;
  noLinkStyle?: boolean;
} & Omit<LinkComposedProps, "to" | "linkAs" | "href"> &
  Omit<MuiLinkProps, "href">;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  props,
  ref
) {
  const {
    as: linkAs,
    className: classNameProps,
    href,
    noLinkStyle,
    ...other
  } = props;

  const isExternal =
    typeof href === "string" &&
    (href.indexOf("http") === 0 || href.indexOf("mailto:") === 0);

  const router = useLocation();
  const pathname = typeof href === "string" ? href : href.pathname;
  const className = clsx(classNameProps, {
    active: router?.pathname === pathname,
  });
  if (isExternal) {
    if (noLinkStyle) {
      return (
        <Anchor
          className={className}
          href={href}
          ref={ref}
          target="_blank"
          rel="noopener"
          underline="none"
          {...other}
        />
      );
    }

    return (
      <MuiLink
        className={className}
        href={href}
        ref={ref}
        target="_blank"
        rel="noopener"
        underline="none"
        {...other}
      />
    );
  }

  if (noLinkStyle) {
    return (
      <LinkComposed
        className={className}
        ref={ref}
        to={typeof href === "string" ? href : href.pathname}
        underline="none"
        {...other}
      />
    );
  }

  return (
    <MuiLink
      component={LinkComposed}
      linkAs={linkAs}
      className={className}
      ref={ref}
      to={href}
      underline="none"
      {...other}
    />
  );
});

export const ROUTES = {
  dashboard: "/lending",
  markets: "/lending/markets",
  faucet: "/lending/faucet",
  reserveOverview: (underlyingAsset: string, marketName: CustomMarket) =>
    `/lending/reserve-overview/?underlyingAsset=${underlyingAsset}&marketName=${marketName}`,
  history: "/lending/transactions",
};
