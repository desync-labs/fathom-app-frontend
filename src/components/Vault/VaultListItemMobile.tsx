import { FC, memo, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import BigNumber from "bignumber.js";
import { IVault, IVaultPosition } from "fathom-sdk";

import {
  ListItemWrapper,
  ListLabel,
  ListValue,
} from "components/AppComponents/AppList/AppList";
import {
  ExtendedBtn,
  VaultInfo,
  EarningLabel,
  VaultListItemImageWrapper,
  VaultPercent,
  VaultStacked,
  VaultTitle,
  VaultListItemPropsType,
} from "components/Vault/VaultListItem";
import VaultItemPositionInfo from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultItemPositionInfo";
import VaultListItemManageModal from "components/Vault/VaultListItem/VaultListItemManageModal";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import VaultListItemDepositModal from "components/Vault/VaultListItem/VaultListItemDepositModal";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import VaultListItemNav from "components/Vault/VaultListItem/VaultListItemNav";
import VaultItemAbout from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultItemAbout";
import VaultItemStrategies from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultItemStrategies";
import WalletConnectBtn from "components/Common/WalletConnectBtn";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber, formatPercentage } from "utils/format";
import useVaultListItem, { VaultInfoTabs } from "hooks/useVaultListItem";
import usePricesContext from "context/prices";
import useConnector from "context/connector";

import DirectionUp from "assets/svg/direction-up.svg";
import DirectionDown from "assets/svg/direction-down.svg";
import LockSrc from "assets/svg/lock.svg";
import LockAquaSrc from "assets/svg/lock-aqua.svg";

const VaultPoolName = styled("div")`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 7px;
  margin-bottom: 15px;
`;

const VaultListItemMobileContainer = styled(Box)`
  width: 100%;
  background: #131f35;
  border-bottom: 1px solid #131f35;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 5px;
`;

export const VaultListValue = styled(ListValue)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;

  &.neutral {
    font-size: 14px;
    color: #6d86b2;
    line-height: 20px;
    font-weight: 600;
  }
`;

export const VaultListLabel = styled(ListLabel)`
  color: #6d86b2;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  display: flex;
  align-items: center;
  gap: 7px;
`;

const ExtendedBtnWrapper = styled("div")`
  height: 36px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

type VaultListItemMobileAdditionalDataProps = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition | null | undefined;
};

export const VaultListItemMobileAdditionalData: FC<VaultListItemMobileAdditionalDataProps> =
  memo(({ vaultItemData, vaultPosition }) => {
    const { token, depositLimit, balanceTokens } = vaultItemData;

    return (
      <>
        <ListItemWrapper>
          <VaultListLabel>
            TVL
            <AppPopover
              id={"tvl"}
              text={
                <>
                  Total value locked (TVL) is a metric that refers to the sum of
                  assets that are staked in the Vault.
                </>
              }
            />
          </VaultListLabel>
          <VaultListValue>
            $
            {formatNumber(
              BigNumber(balanceTokens)
                .dividedBy(10 ** 18)
                .toNumber()
            )}
          </VaultListValue>
        </ListItemWrapper>
        <ListItemWrapper>
          <VaultListLabel>Available</VaultListLabel>
          <VaultListValue className={"neutral"}>
            {formatNumber(
              BigNumber(depositLimit)
                .minus(BigNumber(balanceTokens))
                .dividedBy(10 ** 18)
                .toNumber()
            )}{" "}
            {token.symbol}
          </VaultListValue>
        </ListItemWrapper>
        <ListItemWrapper>
          <VaultListLabel>Locked</VaultListLabel>
          <VaultListValue className={"neutral"}>
            <VaultStacked>
              <div className={"img-wrapper"}>
                {vaultPosition?.balancePosition &&
                BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) ? (
                  <img
                    src={LockAquaSrc}
                    alt={"locked"}
                    width={20}
                    height={20}
                  />
                ) : (
                  <img src={LockSrc} alt={"locked"} width={20} height={20} />
                )}
              </div>
              {vaultPosition
                ? formatNumber(
                    BigNumber(vaultPosition.balancePosition)
                      .dividedBy(10 ** 18)
                      .toNumber()
                  )
                : 0}
              {" " + token.symbol}
            </VaultStacked>
          </VaultListValue>
        </ListItemWrapper>
      </>
    );
  });

const VaultListItemMobile: FC<VaultListItemPropsType> = ({
  vaultItemData,
  vaultPosition,
  performanceFee,
  protocolFee,
}) => {
  const { token, strategies } = vaultItemData;

  const {
    manageVault,
    newVaultDeposit,
    extended,
    activeVaultInfoTab,
    setActiveVaultInfoTab,
    setNewVaultDeposit,
    setExtended,
    setManageVault,
  } = useVaultListItem({ vaultPosition });

  const { fxdPrice } = usePricesContext();
  const { account } = useConnector();

  return (
    <VaultListItemMobileContainer>
      {vaultPosition?.balancePosition &&
        BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) && (
          <EarningLabel>Earning</EarningLabel>
        )}
      <VaultPoolName>
        <VaultListItemImageWrapper>
          <img src={getTokenLogoURL(token.symbol)} alt={token.name} />
        </VaultListItemImageWrapper>
        <VaultInfo>
          <VaultTitle>{token.name}</VaultTitle>
        </VaultInfo>
      </VaultPoolName>
      <ListItemWrapper>
        <VaultListLabel>
          Fee
          <AppPopover
            id={"fee"}
            text={<>The amount of fee that this Vault takes</>}
          />
        </VaultListLabel>
        <VaultListValue>
          <VaultPercent>
            {formatNumber(BigNumber(performanceFee).toNumber())}%
          </VaultPercent>
        </VaultListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <VaultListLabel>
          Earned
          <AppPopover
            id={"earned"}
            text={<>How much have you earned on this Vault so far</>}
          />
        </VaultListLabel>
        <VaultListValue>
          {vaultPosition?.balanceProfit &&
          BigNumber(vaultPosition?.balanceProfit).isGreaterThan(0)
            ? "$" +
              formatPercentage(
                BigNumber(vaultPosition.balanceProfit)
                  .multipliedBy(fxdPrice)
                  .dividedBy(10 ** 36)
                  .toNumber()
              )
            : "0"}
        </VaultListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <VaultListLabel>
          Apr
          <AppPopover
            id={"apr"}
            text={
              <>
                Annual Percentage Rate – refers to the total cost of your
                borrowing for a year. Importantly, it includes the standard fees
                and interest you'll have to pay.
              </>
            }
          />
        </VaultListLabel>
        <VaultListValue>
          {formatNumber(
            BigNumber(strategies[0].reports[0].results[0].apr).toNumber()
          )}
          %
        </VaultListValue>
      </ListItemWrapper>
      {extended && (
        <>
          <VaultListItemNav
            vaultPosition={vaultPosition}
            activeVaultInfoTab={activeVaultInfoTab}
            setActiveVaultInfoTab={setActiveVaultInfoTab}
          />
          {vaultPosition &&
            BigNumber(vaultPosition.balanceShares).isGreaterThan(0) &&
            activeVaultInfoTab === VaultInfoTabs.POSITION && (
              <VaultItemPositionInfo
                vaultItemData={vaultItemData}
                vaultPosition={vaultPosition}
                setManageVault={setManageVault}
              />
            )}
          {activeVaultInfoTab === VaultInfoTabs.ABOUT && (
            <VaultItemAbout
              vaultItemData={vaultItemData}
              protocolFee={protocolFee}
              performanceFee={performanceFee}
            />
          )}
          {activeVaultInfoTab === VaultInfoTabs.STRATEGIES && (
            <VaultItemStrategies
              vaultItemData={vaultItemData}
              performanceFee={performanceFee}
            />
          )}
        </>
      )}
      <VaultListItemMobileAdditionalData
        vaultItemData={vaultItemData}
        vaultPosition={vaultPosition}
      />
      {(!vaultPosition ||
        !BigNumber(vaultPosition.balanceShares).isGreaterThan(0)) &&
        account && (
          <ButtonPrimary
            onClick={() => setNewVaultDeposit(true)}
            sx={{ width: "100%", marginTop: "16px" }}
          >
            Deposit
          </ButtonPrimary>
        )}
      {!account && <WalletConnectBtn fullwidth sx={{ marginTop: "16px" }} />}
      <ExtendedBtnWrapper>
        <ExtendedBtn
          className={extended ? "visible" : "hidden"}
          onClick={() => setExtended(!extended)}
        >
          <img src={DirectionUp} alt={"direction-up"} />
        </ExtendedBtn>
        <ExtendedBtn
          className={!extended ? "visible" : "hidden"}
          onClick={() => setExtended(!extended)}
        >
          <img src={DirectionDown} alt={"direction-down"} />
        </ExtendedBtn>
      </ExtendedBtnWrapper>
      {useMemo(() => {
        return (
          vaultPosition &&
          manageVault && (
            <VaultListItemManageModal
              vaultItemData={vaultItemData}
              vaultPosition={vaultPosition}
              onClose={() => setManageVault(false)}
              performanceFee={performanceFee}
            />
          )
        );
      }, [
        manageVault,
        vaultItemData,
        vaultPosition,
        performanceFee,
        setManageVault,
      ])}
      {useMemo(() => {
        return (
          newVaultDeposit && (
            <VaultListItemDepositModal
              vaultItemData={vaultItemData}
              onClose={() => setNewVaultDeposit(false)}
              performanceFee={performanceFee}
            />
          )
        );
      }, [newVaultDeposit, vaultItemData, vaultItemData, setNewVaultDeposit])}
    </VaultListItemMobileContainer>
  );
};

export default memo(VaultListItemMobile);
