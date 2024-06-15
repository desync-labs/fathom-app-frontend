import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { TableCell } from "@mui/material";
import { IVault, IVaultPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { useApr } from "hooks/Vaults/useApr";
import usePricesContext from "context/prices";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency } from "utils/format";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";

const VaultItemTableRow = styled(AppTableRow)`
  width: 100%;
  border-radius: 8px;
  background: #132340;

  & td {
    height: 52px;
  }

  & td:first-of-type {
    padding-left: 16px;
  }
`;

export const VaultTitle = styled("div")`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
`;

export const VaultApr = styled("div")`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
`;

export const VaultStackedLiquidity = styled("div")`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
`;

export const VaultTagLabel = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: fit-content;
  background: rgba(79, 101, 140, 0.3);
  font-size: 11px;
  font-weight: 600;
  color: #43fff1;
  border-radius: 6px;
  padding: 4px 8px;
`;

export const VaultListItemImageWrapper = styled("div")`
  display: flex;
  justify-content: left;

  img {
    border-radius: 50%;
    width: 18px;
    height: 18px;
  }
`;

const VaultListItemMobile = ({
  vaultItemData,
  vaultPosition,
  performanceFee,
}: {
  vaultItemData: IVault;
  vaultPosition: IVaultPosition | null;
  performanceFee: number;
}) => {
  const { token, balanceTokens, shutdown } = vaultItemData;
  const formattedApr = useApr(vaultItemData);
  const { fxdPrice } = usePricesContext();
  const navigate = useNavigate();
  const vaultTestId = vaultItemData.id;

  // const {
  //   balanceEarned,
  //   manageVault,
  //   newVaultDeposit,
  //   setManageVault,
  //   setNewVaultDeposit,
  // } = useVaultListItem({ vaultPosition, vault: vaultItemData });

  const redirectToVaultDetail = useCallback(() => {
    navigate(`/vaults/${vaultItemData.id}`);
  }, [vaultItemData.id]);
  return (
    <VaultItemTableRow
      data-testid={`vaultRow-${vaultTestId}`}
      onClick={redirectToVaultDetail}
    >
      <TableCell colSpan={2}>
        <AppFlexBox sx={{ justifyContent: "flex-start", gap: "4px" }}>
          <VaultListItemImageWrapper>
            <img
              src={getTokenLogoURL(token.symbol)}
              alt={token.name}
              data-testid={`vaultRow-${vaultTestId}-tokenImg`}
            />
          </VaultListItemImageWrapper>
          <VaultTitle data-testid={`vaultRow-${vaultTestId}-tokenTitle`}>
            {vaultItemData.name}
          </VaultTitle>
        </AppFlexBox>
      </TableCell>
      <TableCell
        colSpan={1}
        data-testid={`vaultRow-${vaultTestId}-aprValueCell`}
      >
        <VaultApr>{formattedApr}%</VaultApr>
      </TableCell>
      <TableCell
        colSpan={2}
        data-testid={`vaultRow-${vaultTestId}-tvlValueCell`}
      >
        <VaultStackedLiquidity>
          {formatCurrency(
            BigNumber(fxdPrice)
              .dividedBy(10 ** 18)
              .multipliedBy(BigNumber(balanceTokens).dividedBy(10 ** 18))
              .toNumber()
          )}
        </VaultStackedLiquidity>
      </TableCell>
      <TableCell colSpan={1}>
        {vaultPosition?.balancePosition &&
        BigNumber(vaultPosition?.balancePosition).isGreaterThan(0) &&
        !shutdown ? (
          <VaultTagLabel>Earning</VaultTagLabel>
        ) : shutdown ? (
          <VaultTagLabel>Finished</VaultTagLabel>
        ) : (
          <VaultTagLabel>Live</VaultTagLabel>
        )}
      </TableCell>
    </VaultItemTableRow>
  );
};

export default VaultListItemMobile;
