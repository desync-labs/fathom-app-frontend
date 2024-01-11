import { Link } from "apps/lending/components/primitives/Link";

export const AMPLWarning = () => {
  return (
    <>
      <b>Ampleforth</b> is a rebasing asset. Visit the{" "}
      <Link
        href="https://docs.aave.com/developers/v/2.0/guides/ampl-asset-listing"
        underline="always"
      >
        documentation
      </Link>{" "}
      to learn more.
    </>
  );
};
