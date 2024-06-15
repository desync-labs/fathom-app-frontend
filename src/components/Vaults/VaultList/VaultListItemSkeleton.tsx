import { Box, Skeleton, styled, TableCell } from "@mui/material";
import useConnector from "context/connector";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import { VaultListItemImageWrapper } from "components/Vaults/VaultList/VaultListItem";
import { VaultListItemImageWrapper as VaultListItemImageWrapperMobile } from "components/Vaults/VaultList/VaultListItemMobile";
import { VaultItemTableRow } from "components/Vaults/VaultList/VaultListItemMobile";

const CustomSkeleton = styled(Skeleton)`
  background-color: #2536564a;
`;

export const VaultListItemSkeleton = () => {
  const { account } = useConnector();
  return (
    <AppTableRow className="border single">
      <TableCell colSpan={2} sx={{ width: "20%" }}>
        <AppFlexBox>
          <VaultListItemImageWrapper>
            <CustomSkeleton
              animation="wave"
              variant="circular"
              width={36}
              height={36}
            />
          </VaultListItemImageWrapper>
          <Box>
            <CustomSkeleton animation={"wave"} width={90} />
          </Box>
        </AppFlexBox>
      </TableCell>
      <TableCell colSpan={1} sx={{ width: account ? "7%" : "10%" }}>
        <CustomSkeleton animation={"wave"} width={35} />
      </TableCell>
      {account && (
        <TableCell colSpan={1} sx={{ width: account ? "11%" : "10%" }}>
          <CustomSkeleton animation={"wave"} width={20} />
        </TableCell>
      )}
      <TableCell colSpan={1} sx={{ width: account ? "10%" : "10%" }}>
        <CustomSkeleton animation={"wave"} width={35} />
      </TableCell>
      <TableCell colSpan={1} sx={{ width: account ? "13%" : "11%" }}>
        <CustomSkeleton animation={"wave"} width={100} />
      </TableCell>
      <TableCell colSpan={1} sx={{ width: account ? "14%" : "15%" }}>
        <CustomSkeleton animation={"wave"} width={100} />
      </TableCell>
      <TableCell colSpan={1} sx={{ width: account ? "13%" : "10%" }}>
        <CustomSkeleton animation={"wave"} width={70} />
      </TableCell>
      <TableCell colSpan={2}>
        <AppFlexBox justifyContent={"flex-end"} mx={2}>
          <CustomSkeleton
            animation={"wave"}
            width={account ? 60 : 120}
            height={35}
          />
          <CustomSkeleton animation={"wave"} width={22} />
        </AppFlexBox>
      </TableCell>
    </AppTableRow>
  );
};

export const VaultListItemMobileSkeleton = () => {
  return (
    <VaultItemTableRow>
      <TableCell colSpan={2}>
        <AppFlexBox sx={{ justifyContent: "flex-start", gap: "4px" }}>
          <VaultListItemImageWrapperMobile>
            <CustomSkeleton
              animation="wave"
              variant="circular"
              width={20}
              height={20}
            />
          </VaultListItemImageWrapperMobile>
          <Box>
            <CustomSkeleton animation={"wave"} height={16} width={80} />
          </Box>
        </AppFlexBox>
      </TableCell>
      <TableCell colSpan={1}>
        <CustomSkeleton animation={"wave"} height={16} width={30} />
      </TableCell>
      <TableCell colSpan={2}>
        <CustomSkeleton animation={"wave"} height={16} width={80} />
      </TableCell>
      <TableCell colSpan={1}>
        <CustomSkeleton animation={"wave"} height={20} width={40} />
      </TableCell>
    </VaultItemTableRow>
  );
};
