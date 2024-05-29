import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import {
  Box,
  CircularProgress,
  Divider,
  ListItemText,
  styled,
} from "@mui/material";
import { IVault, IVaultPosition } from "fathom-sdk";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { FormType } from "hooks/useVaultManageDeposit";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";
import { formatNumber, formatPercentage } from "utils/format";
import { AppFlexBox, Summary } from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "components/AppComponents/AppButton/AppButton";

const ManageVaultInfoWrapper = styled(Box)`
  position: relative;
  width: 50%;
  padding: 0;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

const VaultList = styled(AppList)`
  & li {
    color: #fff;
    align-items: flex-start;
    padding: 4px 0;
  }
`;

type VaultManageInfoProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  formToken: string;
  formSharedToken: string;
  formType: FormType;
  isMobile: boolean;
  onClose: () => void;
  openDepositLoading: boolean;
  errors: FieldErrors<{
    formToken: string;
    formSharedToken: string;
  }>;
  approveBtn: boolean;
  handleSubmit: UseFormHandleSubmit<
    {
      formToken: string;
      formSharedToken: string;
    },
    undefined
  >;
  onSubmit: (values: Record<string, any>) => Promise<void>;
};

const ManageVaultInfo: FC<VaultManageInfoProps> = ({
  formType,
  vaultItemData,
  vaultPosition,
  formToken,
  formSharedToken,
  isMobile,
  onClose,
  openDepositLoading,
  errors,
  approveBtn,
  handleSubmit,
  onSubmit,
}) => {
  const { token, shareToken, sharesSupply } = vaultItemData;
  const { balancePosition, balanceShares } = vaultPosition;

  return (
    <ManageVaultInfoWrapper>
      <Summary>Summary</Summary>
      <Divider sx={{ borderColor: "#3D5580" }} />
      <VaultList>
        <AppListItem
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balancePosition)
                  .dividedBy(10 ** 18)
                  .toNumber()
              ) +
                " " +
                token.name +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balancePosition)
                        .dividedBy(10 ** 18)
                        .plus(BigNumber(formToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    token.name +
                    " "
                  : formatPercentage(
                      Math.max(
                        BigNumber(balancePosition)
                          .dividedBy(10 ** 18)
                          .minus(BigNumber(formToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    token.name +
                    " "}
              </Box>
            </>
          }
        >
          <ListItemText primary={token.name + " Deposited"} />
        </AppListItem>
        <AppListItem
          secondaryAction={
            <>
              {`${formatNumber(
                BigNumber(balanceShares)
                  .dividedBy(BigNumber(sharesSupply))
                  .multipliedBy(100)
                  .toNumber()
              )} %`}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatNumber(
                      BigNumber(balanceShares)
                        .plus(
                          BigNumber(formSharedToken || "0").multipliedBy(
                            10 ** 18
                          )
                        )
                        .dividedBy(
                          BigNumber(sharesSupply).plus(
                            BigNumber(formSharedToken || "0").multipliedBy(
                              10 ** 18
                            )
                          )
                        )
                        .multipliedBy(100)
                        .toNumber()
                    )
                  : BigNumber(formSharedToken)
                      .multipliedBy(10 ** 18)
                      .isEqualTo(BigNumber(sharesSupply))
                  ? "0"
                  : formatNumber(
                      Math.max(
                        BigNumber(balanceShares)
                          .minus(
                            BigNumber(formSharedToken || "0").multipliedBy(
                              10 ** 18
                            )
                          )
                          .dividedBy(
                            BigNumber(sharesSupply).minus(
                              BigNumber(formSharedToken || "0").multipliedBy(
                                10 ** 18
                              )
                            )
                          )
                          .multipliedBy(100)
                          .toNumber(),
                        0
                      )
                    )}{" "}
                %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </AppListItem>
        <AppListItem
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(balanceShares)
                  .dividedBy(10 ** 18)
                  .toNumber()
              ) +
                " " +
                shareToken.symbol +
                " "}
              <Box
                component="span"
                sx={{
                  color: formType === FormType.DEPOSIT ? "#29C20A" : "#F76E6E",
                }}
              >
                →{" "}
                {formType === FormType.DEPOSIT
                  ? formatPercentage(
                      BigNumber(balanceShares)
                        .dividedBy(10 ** 18)
                        .plus(BigNumber(formSharedToken || "0"))
                        .toNumber()
                    ) +
                    " " +
                    shareToken.symbol
                  : formatPercentage(
                      Math.max(
                        BigNumber(balanceShares)
                          .dividedBy(10 ** 18)
                          .minus(BigNumber(formSharedToken || "0"))
                          .toNumber(),
                        0
                      )
                    ) +
                    " " +
                    shareToken.symbol}{" "}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </AppListItem>
      </VaultList>
      <AppFlexBox>
        {!isMobile && (
          <ButtonSecondary sx={{ width: "auto" }} onClick={onClose}>
            Close
          </ButtonSecondary>
        )}
        <ButtonPrimary
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={
            openDepositLoading ||
            (formType === FormType.DEPOSIT && approveBtn) ||
            !!Object.keys(errors).length
          }
          isLoading={openDepositLoading}
          sx={{ width: "auto" }}
        >
          {openDepositLoading ? (
            <CircularProgress sx={{ color: "#0D1526" }} size={20} />
          ) : formType === FormType.DEPOSIT ? (
            "Deposit"
          ) : (
            "Withdraw"
          )}
        </ButtonPrimary>
        {isMobile && <ButtonSecondary onClick={onClose}>Close</ButtonSecondary>}
      </AppFlexBox>
    </ManageVaultInfoWrapper>
  );
};

export default memo(ManageVaultInfo);
