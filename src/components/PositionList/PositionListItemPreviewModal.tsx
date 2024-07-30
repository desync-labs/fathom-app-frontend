import { FC, memo } from "react";
import { Box, ListItemText, Stack, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { IOpenPosition } from "fathom-sdk";

import {
  formatCurrency,
  formatNumber,
  formatNumberPrice,
  formatPercentage,
} from "utils/format";
import { getTokenLogoURL } from "utils/tokenLogo";

import { PoolWrapper } from "components/Pools/PoolsListItemMobile";
import PoolName from "components/Pools/PoolListItem/PoolName";
import { TVL } from "components/AppComponents/AppBox/AppBox";
import { ManagePositionButton } from "components/AppComponents/AppButton/AppButton";
import { BasePreviewModalPaper } from "components/Base/Paper/StyledPaper";
import BaseDialogFullScreen from "components/Base/Dialog/FullScreenDialog";
import {
  BaseListItem,
  BaseListPreviewModal,
} from "components/Base/List/StyledList";
import {
  BreadcrumbsWrapper,
  VaultBreadcrumbsCurrentPage,
} from "components/Vaults/VaultDetail/Breadcrumbs";
import useConnector from "../../context/connector";

const BreadcrumbsContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PositionBreadcrumbsCloseModal = styled("div")`
  color: #6d86b2;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
`;

const ListItemLabel = styled(ListItemText)`
  width: 30%;
`;

const PreviewModalButtonWrapper = styled("div")`
  display: flex;
  justify-content: stretch;
  width: 100%;
  margin: 18px 0;

  & button {
    width: 100%;
    height: 40px;

    & svg {
      width: 20px;
      height: 20px;
      fill: #005c55;
    }
  }
`;

type PseudoBreadcrumbsProps = {
  poolName: string;
  handleCloseModal: () => void;
};

const PseudoBreadcrumbs: FC<PseudoBreadcrumbsProps> = memo(
  ({ poolName, handleCloseModal }) => {
    const breadcrumbs = [
      <PositionBreadcrumbsCloseModal key="1" onClick={handleCloseModal}>
        Positions
      </PositionBreadcrumbsCloseModal>,
      <VaultBreadcrumbsCurrentPage key="2">
        {poolName}
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

interface PositionListItemPreviewModalProps {
  position: IOpenPosition;
  isOpenPreviewModal: boolean;
  handleClosePreview: () => void;
  setTopUpPosition: (position: IOpenPosition) => void;
}

const PositionListItemPreviewModal: FC<PositionListItemPreviewModalProps> = ({
  position,
  isOpenPreviewModal,
  handleClosePreview,
  setTopUpPosition,
}) => {
  const { account } = useConnector();

  return (
    <BaseDialogFullScreen
      isOpen={isOpenPreviewModal}
      onClose={handleClosePreview}
      tabVisible={!!account}
    >
      <BreadcrumbsContainer>
        <PseudoBreadcrumbs
          poolName={`#${position.positionId} - ${position?.collateralPoolName}`}
          handleCloseModal={handleClosePreview}
        />
        <CloseIcon sx={{ color: "#fff" }} onClick={handleClosePreview} />
      </BreadcrumbsContainer>

      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom="10px"
      >
        <PoolWrapper>
          <img
            src={getTokenLogoURL(
              position?.collateralPoolName?.toUpperCase() === "XDC"
                ? "WXDC"
                : position?.collateralPoolName
            )}
            alt={position?.collateralPoolName}
            width={18}
            height={18}
          />
          <PoolName>{position?.collateralPoolName}</PoolName>
        </PoolWrapper>
        <TVL>TVL: {formatCurrency(position.tvl)}</TVL>
      </Stack>

      <BasePreviewModalPaper>
        <BaseListPreviewModal>
          <BaseListItem
            secondaryAction={
              <>$ {formatPercentage(position.liquidationPrice)}</>
            }
          >
            <ListItemLabel primary={"Liquidation price"} />
          </BaseListItem>
          <BaseListItem
            secondaryAction={<>{formatNumber(position.debtValue)} FXD</>}
          >
            <ListItemLabel primary={"Borrowed"} />
          </BaseListItem>{" "}
          <BaseListItem
            secondaryAction={
              <>
                {formatNumberPrice(position.lockedCollateral)}{" "}
                {position.collateralPoolName}
              </>
            }
          >
            <ListItemLabel primary={"Collateral"} />
          </BaseListItem>
          <BaseListItem
            secondaryAction={
              <>{formatNumber(position.safetyBufferInPercent * 100)}%</>
            }
          >
            <ListItemLabel primary={"Safety Buffer"} />
          </BaseListItem>
        </BaseListPreviewModal>
      </BasePreviewModalPaper>

      <PreviewModalButtonWrapper>
        <ManagePositionButton onClick={() => setTopUpPosition(position)}>
          Manage Position
        </ManagePositionButton>
      </PreviewModalButtonWrapper>
    </BaseDialogFullScreen>
  );
};

export default PositionListItemPreviewModal;
