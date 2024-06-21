import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Dialog,
  ListItemText,
  styled,
} from "@mui/material";
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
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import {
  AppListItem,
  AppListVault,
} from "components/AppComponents/AppList/AppList";
import {
  VaultListItemImageWrapper,
  VaultTagLabel,
  VaultTitle,
} from "components/Vaults/VaultList/VaultListItemMobile";
import { VaultStacked } from "components/Vaults/VaultList/VaultListItem";
import CloseIcon from "@mui/icons-material/Close";

import LockAquaSrc from "assets/svg/lock-aqua.svg";
import LockSrc from "assets/svg/lock.svg";

const FullScreenDialog = styled(Dialog)`
  top: 116px;
  height: calc(100% - 116px);
  z-index: 100;

  & .MuiDialog-paper {
    margin: 0;
    width: 100%;
    border-radius: 0;
  }
  & .MuiBackdrop-root {
    top: 116px
  },
`;

const VaultListItemPreviewModalContainer = styled("div")`
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #000c24 63.06%, #131f35 126.46%);
  padding: 0 16px 24px;
`;

const AppListVaultPreview = styled(AppListVault)`
  padding: 0;
  & li {
    border-bottom: 1px solid #3d5580;
    padding: 16px !important;

    &.MuiListItemText-root {
      margin-top: 2px;
      margin-bottom: 2px;
    }
    span {
      color: #8ea4cc;
      font-size: 12px;
      font-weight: 700;
    }
    & div:last-of-type {
      color: #fff;
      font-size: 11px;
      font-weight: 500;
    }

    &:last-of-type {
      border: none;
    }
  }
`;

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

const PseudoBreadcrumbs = ({
  vaultName,
  handleCloseModal,
}: {
  vaultName: string;
  handleCloseModal: () => void;
}) => {
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
};

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
}

const BreadcrumbsWrapperContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}) => {
  const navigate = useNavigate();
  const { fxdPrice } = usePricesContext();
  const { token, shutdown, balanceTokens, depositLimit } = vault;

  const formattedApr = useApr(vault);

  const redirectToVaultDetail = useCallback(() => {
    navigate(`/vaults/${vault.id}`);
  }, [vault.id]);

  return (
    <FullScreenDialog
      fullScreen={true}
      open={isOpenPreviewModal}
      onClose={handleClosePreview}
    >
      <VaultListItemPreviewModalContainer>
        <BreadcrumbsWrapperContainer>
          <PseudoBreadcrumbs
            vaultName={vault.name}
            handleCloseModal={handleClosePreview}
          />
          <CloseIcon sx={{ color: "#6d86b2" }} onClick={handleClosePreview} />
        </BreadcrumbsWrapperContainer>
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
        <VaultPaper sx={{ padding: "0 !important", marginTop: "10px" }}>
          <AppListVaultPreview>
            <AppListItem
              secondaryAction={
                <>
                  {balanceEarned &&
                  BigNumber(balanceEarned).isGreaterThan(0) ? (
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
                      .multipliedBy(
                        BigNumber(balanceTokens).dividedBy(10 ** 18)
                      )
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
                    BigNumber(vaultPosition?.balancePosition).isGreaterThan(
                      0
                    ) ? (
                      <img
                        src={LockAquaSrc}
                        alt={"locked-active"}
                        width={10}
                        height={10}
                      />
                    ) : (
                      <img
                        src={LockSrc}
                        alt={"locked"}
                        width={10}
                        height={10}
                      />
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
          </AppListVaultPreview>
        </VaultPaper>
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
                sx={{ height: "36px", minWidth: "100px" }}
              >
                Withdraw all
              </ButtonPrimary>
            )}
        </ButtonsWrapper>
      </VaultListItemPreviewModalContainer>
    </FullScreenDialog>
  );
};

export default VaultListItemPreviewModal;
