export const StETHCollateralWarning = () => {
  return (
    <>
      Due to internal stETH mechanics required for rebasing support, it is not
      possible to perform a collateral switch where stETH is the source token.
    </>
  );
};
