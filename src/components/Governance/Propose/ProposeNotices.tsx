import { FC, memo, useCallback } from "react";
import BigNumber from "bignumber.js";
import { Link } from "react-router-dom";
import { formatNumber } from "utils/format";
import { Typography } from "@mui/material";
import { InfoIcon } from "components/Governance/Propose";
import {
  ErrorBox,
  ErrorMessage,
  WarningBox,
} from "components/AppComponents/AppBox/AppBox";

type ProposeNoticesProps = {
  vBalance: null | string;
  minimumVBalance: number;
  vBalanceError: boolean;
};

const ProposeNotices: FC<ProposeNoticesProps> = ({
  vBalance,
  minimumVBalance,
  vBalanceError,
}) => {
  const getInfo = useCallback(() => {
    if (vBalance === null) {
      return (
        <>
          Account not connected. Please, connect your account to be able to
          create proposals.
        </>
      );
    } else if (
      BigNumber(vBalance)
        .dividedBy(10 ** 18)
        .isLessThan(minimumVBalance)
    ) {
      return (
        <>
          You have less than {formatNumber(minimumVBalance)} vFTHM, and you can
          not create a new proposal. <br />
          So please, stake your FTHM tokens in{" "}
          <Link to={"/dao/staking"}>Staking</Link> to get voting power and
          awesome rewards.
        </>
      );
    } else {
      return (
        <>
          To create a proposal, you need to have {formatNumber(minimumVBalance)}{" "}
          vFTHM.
          <br />
          Now you have{" "}
          {formatNumber(
            BigNumber(vBalance as string)
              .dividedBy(10 ** 18)
              .toNumber()
          )}{" "}
          vFTHM
        </>
      );
    }
  }, [minimumVBalance, vBalance]);

  return vBalanceError ? (
    <ErrorBox sx={{ my: 3 }}>
      <InfoIcon sx={{ width: "16px", color: "#F5953D", height: "16px" }} />
      <ErrorMessage>{getInfo()}</ErrorMessage>
    </ErrorBox>
  ) : (
    <WarningBox sx={{ my: 3 }}>
      <InfoIcon sx={{ width: "16px", color: "#F5953D", height: "16px" }} />
      <Typography>{getInfo()}</Typography>
    </WarningBox>
  );
};

export default memo(ProposeNotices);
