import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { CustomMarket } from "apps/lending/ui-config/marketsConfig";
import { useLocation } from "react-router-dom";
import { forwardRef } from "react";
import { Link as ReactLink } from "react-router-dom";

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled("a")({});

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  linkAs?: string;
  href?: string;
}

export const NextLinkComposed = forwardRef<
  HTMLAnchorElement,
  NextLinkComposedProps
>(function NextLinkComposed(props, ref) {
  const { to, children } = props;
  return (
    <ReactLink to={to} ref={ref}>
      {children}
    </ReactLink>
  );
});

export type LinkProps = {
  as?: string;
  href: { pathname: string } | string;
  linkAs?: string;
  noLinkStyle?: boolean;
} & Omit<NextLinkComposedProps, "to" | "linkAs" | "href"> &
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
      <NextLinkComposed
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
      component={NextLinkComposed}
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
