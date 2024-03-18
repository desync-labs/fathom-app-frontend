import { Skeleton, styled, TableCell } from "@mui/material";
import useConnector from "context/connector";
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
  const { account } = useConnector();
  return (
    <AppTableRow className="border single">
      <TableCell colSpan={2} sx={{ width: "20%" }}>
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
      <TableCell colSpan={1} sx={{ width: "7%" }}>
        <CustomSkeleton animation={"wave"} width={35} />
      </TableCell>
      <TableCell colSpan={1} sx={{ width: account ? "11%" : "10%" }}>
        <CustomSkeleton animation={"wave"} width={20} />
      </TableCell>
      <TableCell colSpan={1} sx={{ width: account ? "10%" : "8%" }}>
        <CustomSkeleton animation={"wave"} width={35} />
      </TableCell>
      <TableCell colSpan={1} sx={{ width: account ? "13%" : "11%" }}>
        <CustomSkeleton animation={"wave"} width={100} />
      </TableCell>
      <TableCell colSpan={1} sx={{ width: account ? "14%" : "12%" }}>
        <CustomSkeleton animation={"wave"} width={100} />
      </TableCell>
      <TableCell colSpan={1} sx={{ width: "10%" }}>
        <CustomSkeleton animation={"wave"} width={70} />
      </TableCell>
      <TableCell colSpan={2}>
        <FlexBox justifyContent={"flex-end"} mx={2}>
          <CustomSkeleton
            animation={"wave"}
            width={account ? 60 : 120}
            height={35}
          />
          <CustomSkeleton animation={"wave"} width={22} />
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
