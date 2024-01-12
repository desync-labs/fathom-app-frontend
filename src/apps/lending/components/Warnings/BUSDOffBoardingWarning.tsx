import { Link } from "apps/lending/components/primitives/Link";

export const BUSDOffBoardingWarning = () => {
  return (
    <>
      <>
        This asset is planned to be offboarded due to an Fathom Protocol
        Governance decision.
      </>{" "}
      <Link
        href="https://governance.aave.com/t/arfc-busd-offboarding-plan/12170"
        sx={{ textDecoration: "underline" }}
      >
        More details
      </Link>
    </>
  );
};
