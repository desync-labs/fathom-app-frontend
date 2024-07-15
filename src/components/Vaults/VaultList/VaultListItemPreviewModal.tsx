import { FC, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, ListItemText, styled } from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import BigNumber from "bignumber.js";
import { IVault, IVaultPosition } from "fathom-sdk";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber } from "utils/format";
import usePricesContext from "context/prices";
import { useApr } from "hooks/Vaults/useApr";
import {
  BreadcrumbsWrapper,
  VaultBreadcrumbsCurrentPage,
} from "components/Vaults/VaultDetail/Breadcrumbs";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ButtonSecondary,
  ModalButtonWrapper,
} from "components/AppComponents/AppButton/AppButton";
import { BasePreviewModalPaper } from "components/Base/Paper/StyledPaper";
import { AppListItem } from "components/AppComponents/AppList/AppList";
import {
  VaultListItemImageWrapper,
  VaultTagLabel,
  VaultTitle,
} from "components/Vaults/VaultList/VaultListItemMobile";
import { VaultStacked } from "components/Vaults/VaultList/VaultListItem";
import BaseDialogFullScreen from "components/Base/Dialog/FullScreenDialog";
import { BaseListPreviewModal } from "components/Base/List/StyledList";

import CloseIcon from "@mui/icons-material/Close";
import LockAquaSrc from "assets/svg/lock-aqua.svg";
import LockSrc from "assets/svg/lock.svg";

const VaultBreadcrumbsCloseModal = styled("div")`
  color: #6d86b2;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
`;

const LockedIconWrapper = styled("div")`
  display: flex;
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 4px;
  background: rgba(79, 101, 140, 0.2);
`;

const ButtonsWrapper = styled(ModalButtonWrapper)`
  gap: 8px;
  & > button {
    height: 40px;
    width: calc(50% - 4px) !important;
    font-size: 15px;
    font-weight: 600;
    padding: 10px 16px;
  }
`;

type PseudoBreadcrumbsProps = {
  vaultName: string;
  handleCloseModal: () => void;
};

const PseudoBreadcrumbs: FC<PseudoBreadcrumbsProps> = memo(
  ({ vaultName, handleCloseModal }) => {
    const breadcrumbs = [
      <VaultBreadcrumbsCloseModal key="1" onClick={handleCloseModal}>
        Vaults
      </VaultBreadcrumbsCloseModal>,
      <VaultBreadcrumbsCurrentPage key="2">
        {vaultName}
      </VaultBreadcrumbsCurrentPage>,
    ];

    return (
      <BreadcrumbsWrapper
        separator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </BreadcrumbsWrapper>
    );
  }
);

interface VaultListItemPreviewModalProps {
  isOpenPreviewModal: boolean;
  vault: IVault;
  vaultPosition: IVaultPosition | undefined;
  balanceEarned: number;
  handleClosePreview: () => void;
  setNewVaultDeposit: (value: boolean) => void;
  setManageVault: (value: boolean) => void;
  tfVaultDepositLimit: string;
  handleWithdrawAll: () => void;
  isTfVaultType: boolean;
  activeTfPeriod: number;
  isWithdrawLoading: boolean;
}

const BreadcrumbsContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const VaultListItemPreviewModal: FC<VaultListItemPreviewModalProps> = ({
  vault,
  vaultPosition,
  balanceEarned,
  handleClosePreview,
  isOpenPreviewModal,
  setNewVaultDeposit,
  setManageVault,
  tfVaultDepositLimit,
  handleWithdrawAll,
  isTfVaultType,
  activeTfPeriod,
  isWithdrawLoading,
}) => {
  const navigate = useNavigate();
  const { fxdPrice } = usePricesContext();
  const { token, shutdown, balanceTokens, depositLimit } = vault;

  const formattedApr = useApr(vault);

  const redirectToVaultDetail = useCallback(() => {
    navigate(`/vaults/${vault.id}`);
  }, [vault.id]);

  return (
    <BaseDialogFullScreen
      isOpen={isOpenPreviewModal}
      onClose={handleClosePreview}
    >
      <BreadcrumbsContainer>
        <PseudoBreadcrumbs
          vaultName={vault.name}
          handleCloseModal={handleClosePreview}
        />
        <CloseIcon sx={{ color: "#fff" }} onClick={handleClosePreview} />
      </BreadcrumbsContainer>
      <AppFlexBox>
        <AppFlexBox sx={{ justifyContent: "flex-start", gap: "4px" }}>
          <VaultListItemImageWrapper>
            <img src={getTokenLogoURL(token.symbol)} alt={token.name} />
          </VaultListItemImageWrapper>
          <VaultTitle>{vault.name}</VaultTitle>
        </AppFlexBox>
        {vaultPosition?.balancePosition &&
        BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) &&
        !shutdown ? (
          <VaultTagLabel>Earning</VaultTagLabel>
        ) : shutdown ? (
          <VaultTagLabel>Finished</VaultTagLabel>
        ) : (
          <VaultTagLabel>Live</VaultTagLabel>
        )}
      </AppFlexBox>
      <BasePreviewModalPaper sx={{ marginTop: "10px" }}>
        <BaseListPreviewModal>
          <AppListItem
            secondaryAction={
              <>
                {balanceEarned && BigNumber(balanceEarned).isGreaterThan(0) ? (
                  "$" +
                  formatNumber(
                    BigNumber(balanceEarned)
                      .multipliedBy(fxdPrice)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )
                ) : balanceEarned === -1 ? (
                  <CircularProgress size={20} />
                ) : (
                  0
                )}
              </>
            }
          >
            <ListItemText primary={"Earned"} />
          </AppListItem>
          <AppListItem secondaryAction={<>{formattedApr}%</>}>
            <ListItemText primary={"APY"} />
          </AppListItem>
          <AppListItem
            secondaryAction={
              <>
                {formatCurrency(
                  BigNumber(fxdPrice)
                    .dividedBy(10 ** 18)
                    .multipliedBy(BigNumber(balanceTokens).dividedBy(10 ** 18))
                    .toNumber()
                )}
              </>
            }
          >
            <ListItemText primary={"TVL"} />
          </AppListItem>
          <AppListItem
            secondaryAction={
              <>
                {isTfVaultType
                  ? formatNumber(
                      BigNumber(tfVaultDepositLimit)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    )
                  : formatNumber(
                      Math.max(
                        BigNumber(depositLimit)
                          .minus(BigNumber(balanceTokens))
                          .dividedBy(10 ** 18)
                          .toNumber(),
                        0
                      )
                    )}{" "}
                {token.symbol}
              </>
            }
          >
            <ListItemText primary={"Available"} />
          </AppListItem>
          <AppListItem
            secondaryAction={
              <VaultStacked>
                <LockedIconWrapper>
                  {vaultPosition?.balancePosition &&
                  BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) ? (
                    <img
                      src={LockAquaSrc}
                      alt={"locked-active"}
                      width={10}
                      height={10}
                    />
                  ) : (
                    <img src={LockSrc} alt={"locked"} width={10} height={10} />
                  )}
                </LockedIconWrapper>
                <Box className={"value"}>
                  {vaultPosition
                    ? formatNumber(
                        BigNumber(vaultPosition.balancePosition)
                          .dividedBy(10 ** 18)
                          .toNumber()
                      )
                    : 0}
                  {" " + token.symbol}
                </Box>
              </VaultStacked>
            }
          >
            <ListItemText primary={"Staked"} />
          </AppListItem>
        </BaseListPreviewModal>
      </BasePreviewModalPaper>
      <ButtonsWrapper>
        <ButtonSecondary onClick={redirectToVaultDetail}>
          Detail
        </ButtonSecondary>
        {(!vaultPosition ||
          !BigNumber(vaultPosition.balanceShares).isGreaterThan(0)) &&
          !shutdown &&
          activeTfPeriod !== 2 && (
            <ButtonPrimary
              onClick={() => setNewVaultDeposit(true)}
              sx={{ height: "36px", minWidth: "100px" }}
            >
              Deposit
            </ButtonPrimary>
          )}
        {vaultPosition &&
          BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
          !shutdown &&
          activeTfPeriod !== 2 && (
            <ButtonPrimary
              onClick={() => setManageVault(true)}
              sx={{ height: "36px", minWidth: "100px" }}
            >
              Manage
            </ButtonPrimary>
          )}
        {vaultPosition &&
          BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
          shutdown &&
          activeTfPeriod !== 2 && (
            <ButtonPrimary
              onClick={() => setManageVault(true)}
              sx={{ height: "36px", minWidth: "100px" }}
            >
              Withdraw
            </ButtonPrimary>
          )}
        {vaultPosition &&
          BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
          isTfVaultType &&
          activeTfPeriod === 2 && (
            <ButtonPrimary
              onClick={handleWithdrawAll}
              disabled={isWithdrawLoading}
              sx={{ height: "36px", minWidth: "100px" }}
            >
              Withdraw all
            </ButtonPrimary>
          )}
      </ButtonsWrapper>
    </BaseDialogFullScreen>
  );
};

export default memo(VaultListItemPreviewModal);
