import { formatUserSummary } from "@into-the-fathom/lending-math-utils";
import { Box, SvgIcon, Typography } from "@mui/material";
import { FC, memo, useState } from "react";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Row } from "apps/lending/components/primitives/Row";
import { Warning } from "apps/lending/components/primitives/Warning";
import { EmodeCategory } from "apps/lending/helpers/types";
import {
  AppDataContextType,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useCurrentTimestamp } from "apps/lending/hooks/useCurrentTimestamp";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { getNetworkConfig } from "apps/lending/utils/marketsAndNetworksConfig";

import { TxErrorView } from "apps/lending/components/transactions/FlowCommons/Error";
import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  DetailsHFLine,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { TxModalTitle } from "apps/lending/components/transactions/FlowCommons/TxModalTitle";
import { ChangeNetworkWarning } from "apps/lending/components/transactions/Warnings/ChangeNetworkWarning";
import { EmodeActions } from "apps/lending/components/transactions/Emode/EmodeActions";
import { getEmodeMessage } from "apps/lending/components/transactions/Emode/EmodeNaming";
import { EmodeSelect } from "apps/lending/components/transactions/Emode/EmodeSelect";

import EastRoundedIcon from "@mui/icons-material/EastRounded";

export enum ErrorType {
  EMODE_DISABLED_LIQUIDATION,
  CLOSE_POSITIONS_BEFORE_SWITCHING,
}

export enum EmodeModalType {
  ENABLE = "Enable",
  DISABLE = "Disable",
  SWITCH = "Switch",
}

export interface EmodeModalContentProps {
  mode: EmodeModalType;
}

function getInitialEmode(
  mode: EmodeModalType,
  eModes: AppDataContextType["eModes"],
  currentEmode: number
) {
  const eModesNumber = Object.keys(eModes).length;
  if (mode === EmodeModalType.ENABLE) {
    if (eModesNumber > 2) return undefined;
    return eModes[1];
  }
  if (mode === EmodeModalType.SWITCH) {
    if (eModesNumber > 3) return undefined;
    if (currentEmode === 1) return eModes[2];
    return eModes[1];
  }
  return eModes[0];
}

export const EmodeModalContent: FC<EmodeModalContentProps> = memo(
  ({ mode }) => {
    const {
      user,
      reserves,
      eModes,
      marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd,
      userReserves,
    } = useAppDataContext();
    const { currentChainId } = useProtocolDataContext();
    const { chainId: connectedChainId } = useWeb3Context();
    const currentTimestamp = useCurrentTimestamp(1);
    const { gasLimit, mainTxState: emodeTxState, txError } = useModalContext();

    const [selectedEmode, setSelectedEmode] = useState<
      EmodeCategory | undefined
    >(getInitialEmode(mode, eModes, user.userEmodeCategoryId));
    const networkConfig = getNetworkConfig(currentChainId);

    // calcs
    const newSummary = formatUserSummary({
      currentTimestamp,
      userReserves: userReserves,
      formattedReserves: reserves,
      userEmodeCategoryId: selectedEmode ? selectedEmode.id : 0,
      marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd,
    });

    // error handling
    let blockingError: ErrorType | undefined = undefined;
    // if user is disabling eMode
    if (user.isInEmode && selectedEmode?.id === 0) {
      if (
        Number(newSummary.healthFactor) < 1.01 &&
        newSummary.healthFactor !== "-1"
      ) {
        blockingError = ErrorType.EMODE_DISABLED_LIQUIDATION; // intl.formatMessage(messages.eModeDisabledLiquidation);
      }
    } else if (
      selectedEmode &&
      user.userEmodeCategoryId !== selectedEmode?.id
    ) {
      // check if user has open positions different than future emode
      const hasIncompatiblePositions = user.userReservesData.some(
        (userReserve) =>
          (Number(userReserve.scaledVariableDebt) > 0 ||
            Number(userReserve.principalStableDebt) > 0) &&
          userReserve.reserve.eModeCategoryId !== selectedEmode?.id
      );
      if (hasIncompatiblePositions) {
        blockingError = ErrorType.CLOSE_POSITIONS_BEFORE_SWITCHING;
      }
    }
    // render error messages
    const Blocked: React.FC = () => {
      switch (blockingError) {
        case ErrorType.CLOSE_POSITIONS_BEFORE_SWITCHING:
          return (
            <Warning severity="info" sx={{ mt: 6, alignItems: "center" }}>
              <Typography variant="caption">
                To enable E-mode for the{" "}
                {selectedEmode && getEmodeMessage(selectedEmode.label)}{" "}
                category, all borrow positions outside of this category must be
                closed.
              </Typography>
            </Warning>
          );
        case ErrorType.EMODE_DISABLED_LIQUIDATION:
          return (
            <Warning severity="error" sx={{ mt: 6, alignItems: "center" }}>
              <Typography variant="subheader1" color="#4F1919">
                Cannot disable E-Mode
              </Typography>
              <Typography variant="caption">
                You can not disable E-Mode as your current collateralization
                level is above 80%, disabling E-Mode can cause liquidation. To
                exit E-Mode supply or repay borrowed positions.
              </Typography>
            </Warning>
          );
        default:
          return null;
      }
    };

    // The selector only shows if there are 2 options for the user, which happens when there are 3 emodeCategories (including disable) for mode.enable, and 4 emodeCategories in mode.switch
    const showModal: boolean =
      (Object.keys(eModes).length >= 3 && mode === EmodeModalType.ENABLE) ||
      (Object.keys(eModes).length >= 4 && mode === EmodeModalType.SWITCH);

    // is Network mismatched
    const isWrongNetwork: boolean = currentChainId !== connectedChainId;

    const ArrowRight: FC = () => (
      <SvgIcon color="primary" sx={{ fontSize: "14px", mx: 0.5 }}>
        <EastRoundedIcon />
      </SvgIcon>
    );

    // Shown only if the user is disabling eMode, is not blocked from disabling, and has a health factor that is decreasing
    // HF will never decrease on enable or switch because all borrow positions must initially be in the eMode category
    const showLiquidationRiskWarning: boolean =
      !!selectedEmode &&
      selectedEmode.id === 0 &&
      blockingError === undefined &&
      Number(newSummary.healthFactor).toFixed(3) <
        Number(user.healthFactor).toFixed(3); // Comparing without rounding causes stuttering, HFs update asyncronously

    // Shown only if the user has a collateral asset which is changing in LTV
    const showMaxLTVRow =
      user.currentLoanToValue !== "0" &&
      Number(newSummary.currentLoanToValue).toFixed(3) !=
        Number(user.currentLoanToValue).toFixed(3); // Comparing without rounding causes stuttering, LTVs update asyncronously

    if (txError && txError.blocking) {
      return <TxErrorView txError={txError} />;
    }
    if (emodeTxState.success) return <TxSuccessView action={"Emode"} />;
    return (
      <>
        <TxModalTitle title={`${mode} E-Mode`} />
        {isWrongNetwork && (
          <ChangeNetworkWarning
            networkName={networkConfig.name}
            chainId={currentChainId}
          />
        )}

        {user.userEmodeCategoryId === 0 && (
          <Warning severity="warning">
            <Typography variant="caption">
              Enabling E-Mode only allows you to borrow assets belonging to the
              selected category.
            </Typography>
          </Warning>
        )}

        {showModal && (
          <EmodeSelect
            emodeCategories={eModes}
            selectedEmode={selectedEmode?.id}
            setSelectedEmode={setSelectedEmode}
            userEmode={user.userEmodeCategoryId}
          />
        )}

        {blockingError === ErrorType.EMODE_DISABLED_LIQUIDATION && <Blocked />}
        {showLiquidationRiskWarning && (
          <Warning severity="error" sx={{ mt: 6, alignItems: "center" }}>
            <Typography variant="subheader1">Liquidation risk</Typography>
            <Typography variant="caption">
              This action will reduce your health factor. Please be mindful of
              the increased risk of collateral liquidation.{" "}
            </Typography>
          </Warning>
        )}

        <TxModalDetails gasLimit={gasLimit}>
          {!showModal && (
            <Row
              caption={"E-Mode category"}
              captionVariant="description"
              mb={4}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", mx: 1 }}
                >
                  {user.userEmodeCategoryId !== 0 ? (
                    <>
                      <Typography variant="subheader1">
                        {getEmodeMessage(
                          eModes[user.userEmodeCategoryId].label
                        )}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="subheader1">None</Typography>
                  )}
                </Box>
                {selectedEmode && (
                  <>
                    <ArrowRight />
                    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                      {selectedEmode.id !== 0 ? (
                        <>
                          <Typography variant="subheader1">
                            {getEmodeMessage(eModes[selectedEmode.id].label)}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="subheader1">None</Typography>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </Row>
          )}

          <Row
            caption={"Available assets"}
            captionVariant="description"
            mb={4}
            sx={{ alignContent: "flex-end" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              {eModes[user.userEmodeCategoryId] && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "end",
                  }}
                >
                  {user.userEmodeCategoryId !== 0 ? (
                    <Typography sx={{ textAlign: "end" }}>
                      {eModes[user.userEmodeCategoryId].assets.join(", ")}
                    </Typography>
                  ) : (
                    <Typography>All Assets</Typography>
                  )}
                </Box>
              )}
              {selectedEmode && (
                <>
                  <ArrowRight />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "end",
                    }}
                  >
                    {selectedEmode?.id !== 0 ? (
                      <Typography sx={{ textAlign: "end" }}>
                        {selectedEmode.assets.join(", ")}
                      </Typography>
                    ) : (
                      <Typography>All Assets</Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Row>
          <DetailsHFLine
            visibleHfChange={!!selectedEmode}
            healthFactor={user.healthFactor}
            futureHealthFactor={newSummary.healthFactor}
          />

          {showMaxLTVRow && (
            <Row
              caption={"Maximum loan to value"}
              captionVariant="description"
              mb={4}
              align="flex-start"
            >
              <Box sx={{ textAlign: "right" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <FormattedNumber
                    value={user.currentLoanToValue}
                    sx={{ color: "text.primary" }}
                    visibleDecimals={2}
                    compact
                    percent
                    variant="secondary14"
                  />

                  {selectedEmode !== undefined && (
                    <>
                      <ArrowRight />
                      <FormattedNumber
                        value={newSummary.currentLoanToValue}
                        sx={{ color: "text.primary" }}
                        visibleDecimals={2}
                        compact
                        percent
                        variant="secondary14"
                      />
                    </>
                  )}
                </Box>
              </Box>
            </Row>
          )}
        </TxModalDetails>

        {blockingError === ErrorType.CLOSE_POSITIONS_BEFORE_SWITCHING && (
          <Blocked />
        )}

        {txError && <GasEstimationError txError={txError} />}

        <EmodeActions
          isWrongNetwork={isWrongNetwork}
          blocked={blockingError !== undefined || !selectedEmode}
          selectedEmode={selectedEmode?.id || 0}
          activeEmode={user.userEmodeCategoryId}
          eModes={eModes}
        />
      </>
    );
  }
);
