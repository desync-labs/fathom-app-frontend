import { Skeleton, styled, TableCell } from "@mui/material";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import { ListItemWrapper } from "components/AppComponents/AppList/AppList";
import {
  FlexBox,
  VaultInfo,
  VaultListItemImageWrapper,
} from "components/Vault/VaultListItem";
import {
  VaultListItemMobileContainer,
  VaultPoolName,
} from "components/Vault/VaultListItemMobile";

const CustomSkeleton = styled(Skeleton)`
  background-color: #2536564a;
`;

export const VaultListItemSkeleton = () => {
  return (
    <AppTableRow className="border single">
      <TableCell colSpan={2}>
        <FlexBox>
          <VaultListItemImageWrapper>
            <CustomSkeleton
              animation="wave"
              variant="circular"
              width={36}
              height={36}
            />
          </VaultListItemImageWrapper>
          <VaultInfo>
            <CustomSkeleton animation={"wave"} width={90} />
          </VaultInfo>
        </FlexBox>
      </TableCell>
      <TableCell colSpan={1}>
        <CustomSkeleton animation={"wave"} width={35} />
      </TableCell>
      <TableCell colSpan={1}>
        <CustomSkeleton animation={"wave"} width={20} />
      </TableCell>
      <TableCell colSpan={1}>
        <CustomSkeleton animation={"wave"} width={35} />
      </TableCell>
      <TableCell colSpan={1}>
        <CustomSkeleton animation={"wave"} width={100} />
      </TableCell>
      <TableCell colSpan={1}>
        <CustomSkeleton animation={"wave"} width={100} />
      </TableCell>
      <TableCell colSpan={1}>
        <CustomSkeleton animation={"wave"} width={70} />
      </TableCell>
      <TableCell colSpan={2}>
        <FlexBox justifyContent={"space-evenly"}>
          <CustomSkeleton animation={"wave"} width={65} height={35} />
          <CustomSkeleton animation={"wave"} width={22} sx={{ m: "14px" }} />
        </FlexBox>
      </TableCell>
    </AppTableRow>
  );
};

export const VaultListItemMobileSkeleton = () => {
  return (
    <VaultListItemMobileContainer>
      <VaultPoolName>
        <CustomSkeleton
          animation="wave"
          variant="circular"
          width={28}
          height={28}
        />
        <CustomSkeleton animation={"wave"} width={90} />
      </VaultPoolName>
      <ListItemWrapper>
        <CustomSkeleton animation={"wave"} width={60} height={20} />
        <CustomSkeleton animation={"wave"} width={60} height={20} />
      </ListItemWrapper>
      <ListItemWrapper>
        <CustomSkeleton animation={"wave"} width={60} height={20} />
        <CustomSkeleton animation={"wave"} width={60} height={20} />
      </ListItemWrapper>
      <ListItemWrapper>
        <CustomSkeleton animation={"wave"} width={60} height={20} />
        <CustomSkeleton animation={"wave"} width={60} height={20} />
      </ListItemWrapper>
      <ListItemWrapper>
        <CustomSkeleton animation={"wave"} width={60} height={20} />
        <CustomSkeleton animation={"wave"} width={100} height={20} />
      </ListItemWrapper>
      <ListItemWrapper>
        <CustomSkeleton animation={"wave"} width={60} height={20} />
        <CustomSkeleton animation={"wave"} width={100} height={20} />
      </ListItemWrapper>
      <ListItemWrapper>
        <CustomSkeleton animation={"wave"} width={60} height={20} />
        <CustomSkeleton animation={"wave"} width={60} height={20} />
      </ListItemWrapper>
      <CustomSkeleton
        animation={"wave"}
        width="100%"
        height={40}
        sx={{ mt: "26px", mb: "16px" }}
      />
    </VaultListItemMobileContainer>
  );
};
