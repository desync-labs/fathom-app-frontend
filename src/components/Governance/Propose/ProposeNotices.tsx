import React, { FC, memo } from "react";
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
  if (
    vBalance !== null &&
    BigNumber(vBalance)
      .dividedBy(10 ** 18)
      .isLessThan(minimumVBalance)
  ) {
    return vBalanceError ? (
      <ErrorBox sx={{ my: 3 }}>
        <InfoIcon sx={{ width: "16px", color: "#F5953D", height: "16px" }} />
        <ErrorMessage>
          You have less than {formatNumber(minimumVBalance)} vFTHM, and you can
          not create a new proposal. <br />
          So please, stake your FTHM tokens in{" "}
          <Link to={"/dao/staking"}>Staking</Link> to get voting power and
          awesome rewards.
        </ErrorMessage>
      </ErrorBox>
    ) : (
      <WarningBox sx={{ my: 3 }}>
        <InfoIcon sx={{ width: "16px", color: "#F5953D", height: "16px" }} />
        <Typography>
          You have less than {formatNumber(minimumVBalance)} vFTHM, and you can
          not create a new proposal. <br />
          So please, stake your FTHM tokens in{" "}
          <Link to={"/dao/staking"}>Staking</Link> to get voting power and
          awesome rewards.
        </Typography>
      </WarningBox>
    );
  } else {
    return vBalanceError ? (
      <ErrorBox sx={{ my: 3 }}>
        <InfoIcon sx={{ width: "16px", color: "#F5953D", height: "16px" }} />
        <ErrorMessage>
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
        </ErrorMessage>
      </ErrorBox>
    ) : (
      <WarningBox sx={{ my: 3 }}>
        <InfoIcon sx={{ width: "16px", color: "#F5953D", height: "16px" }} />
        <Typography>
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
        </Typography>
      </WarningBox>
    );
  }
};

export default memo(ProposeNotices);
