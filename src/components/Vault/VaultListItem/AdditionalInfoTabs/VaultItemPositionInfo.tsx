import { Dispatch, FC, memo, SetStateAction } from "react";
import { IVault, IVaultPosition } from "fathom-sdk";
import { VaultItemInfoWrapper } from "components/Vault/VaultListItem";
import VaultListItemEarningDetails from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultListItemEarningDetails";
import VaultListItemEarned from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultListItemEarned";

type VaultItemPositionInfoPropsTypes = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  setManageVault: Dispatch<SetStateAction<boolean>>;
};

const VaultItemPositionInfo: FC<VaultItemPositionInfoPropsTypes> = ({
  vaultItemData,
  vaultPosition,
  setManageVault,
}) => {
  const vaultTestId = vaultItemData.id;

  return (
    <>
      <VaultItemInfoWrapper
        data-testid={`vaultRowDetails-${vaultTestId}-itemPositionInfo`}
      >
        <VaultListItemEarningDetails
          vaultItemData={vaultItemData}
          vaultPosition={vaultPosition}
          onOpen={() => setManageVault(true)}
        />
      </VaultItemInfoWrapper>
      <VaultItemInfoWrapper>
        <VaultListItemEarned
          vaultItemData={vaultItemData}
          vaultPosition={vaultPosition}
        />
      </VaultItemInfoWrapper>
    </>
  );
};

export default memo(VaultItemPositionInfo);
