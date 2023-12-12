import { Dispatch, FC, SetStateAction } from "react";
import { IVault, IVaultPosition } from "fathom-sdk";
import { VaultItemInfoWrapper } from "components/Vault/VaultListItem";
import VaultListItemEarningDetails from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultListItemEarningDetails";
import VaultListItemEarned from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultListItemEarned";

type VaultItemPositionInfoPropsTypes = {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition;
  isMobile: boolean;
  setManageVault: Dispatch<SetStateAction<boolean>>;
};

const VaultItemPositionInfo: FC<VaultItemPositionInfoPropsTypes> = ({
  vaultItemData,
  vaultPosition,
  isMobile,
  setManageVault,
}) => {
  return (
    <>
      <VaultItemInfoWrapper>
        <VaultListItemEarningDetails
          vaultItemData={vaultItemData}
          vaultPosition={vaultPosition}
          isMobile={isMobile}
          onOpen={() => setManageVault(true)}
        />
      </VaultItemInfoWrapper>
      <VaultItemInfoWrapper>
        <VaultListItemEarned
          isMobile={isMobile}
          vaultItemData={vaultItemData}
          vaultPosition={vaultPosition}
        />
      </VaultItemInfoWrapper>
    </>
  );
};

export default VaultItemPositionInfo;
