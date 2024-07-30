import { Dispatch, FC, memo, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { Box, ListItemText, Stack, styled } from "@mui/material";
import BigNumber from "bignumber.js";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ICollateralPool } from "fathom-sdk";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber } from "utils/format";
import usePricesContext from "context/prices";
import PriceChanged from "components/Common/PriceChange";
import BaseDialogFullScreen from "components/Base/Dialog/FullScreenDialog";
import { OpenPositionButton } from "components/AppComponents/AppButton/AppButton";
import PoolName from "components/Pools/PoolListItem/PoolName";
import { TVL } from "components/AppComponents/AppBox/AppBox";
import { PoolWrapper } from "components/Pools/PoolsListItemMobile";
import { BasePreviewModalPaper } from "components/Base/Paper/StyledPaper";
import {
  BreadcrumbsWrapper,
  VaultBreadcrumbsCurrentPage,
} from "components/Vaults/VaultDetail/Breadcrumbs";
import {
  BaseListItem,
  BaseListPreviewModal,
} from "components/Base/List/StyledList";
import useConnector from "../../../context/connector";
import { BaseFlexBox } from "../../Base/Boxes/StyledBoxes";

const BreadcrumbsContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PoolBreadcrumbsCloseModal = styled("div")`
  color: #6d86b2;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
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

const ListItemLabel = styled(ListItemText)`
  width: 30%;
`;

const PriceWrapper = styled(BaseFlexBox)`
  justify-content: flex-end;
  gap: 4px;

  & span {
    height: 20px;
  }
`;

type PseudoBreadcrumbsProps = {
  poolName: string;
  handleCloseModal: () => void;
};

const PseudoBreadcrumbs: FC<PseudoBreadcrumbsProps> = memo(
  ({ poolName, handleCloseModal }) => {
    const breadcrumbs = [
      <PoolBreadcrumbsCloseModal key="1" onClick={handleCloseModal}>
        Pools
      </PoolBreadcrumbsCloseModal>,
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

interface PoolListItemPreviewModalProps {
  pool: ICollateralPool;
  isOpenPreviewModal: boolean;
  handleClosePreview: () => void;
  setSelectedPool: Dispatch<SetStateAction<ICollateralPool | undefined>>;
}

const PoolListItemPreviewModal: FC<PoolListItemPreviewModalProps> = ({
  pool,
  isOpenPreviewModal,
  handleClosePreview,
  setSelectedPool,
}) => {
  const { xdcPrice, prevXdcPrice } = usePricesContext();
  const { account } = useConnector();
  return (
    <BaseDialogFullScreen
      isOpen={isOpenPreviewModal}
      onClose={handleClosePreview}
      tabVisible={!!account}
    >
      <BreadcrumbsContainer>
        <PseudoBreadcrumbs
          poolName={pool.poolName}
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
              pool?.poolName?.toUpperCase() === "XDC" ? "WXDC" : pool.poolName
            )}
            alt={pool.poolName}
            width={18}
            height={18}
          />
          <PoolName>{pool.poolName}</PoolName>
        </PoolWrapper>
        <TVL>TVL: {formatCurrency(Number(pool.tvl))}</TVL>
      </Stack>

      <BasePreviewModalPaper>
        <BaseListPreviewModal>
          <BaseListItem
            secondaryAction={
              <PriceWrapper>
                {formatCurrency(
                  pool.poolName.toUpperCase() === "XDC" &&
                    BigNumber(xdcPrice).isGreaterThan(0)
                    ? BigNumber(xdcPrice)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    : pool.collateralPrice
                )}
                <PriceChanged
                  current={
                    pool.poolName.toUpperCase() === "XDC" &&
                    BigNumber(xdcPrice).isGreaterThan(0)
                      ? BigNumber(xdcPrice)
                          .dividedBy(10 ** 18)
                          .toNumber()
                      : Number(pool.collateralPrice)
                  }
                  previous={
                    pool.poolName.toUpperCase() === "XDC" &&
                    prevXdcPrice &&
                    BigNumber(prevXdcPrice).isGreaterThan(0)
                      ? BigNumber(prevXdcPrice)
                          .dividedBy(10 ** 18)
                          .toNumber()
                      : Number(pool.collateralLastPrice)
                  }
                />
              </PriceWrapper>
            }
          >
            <ListItemLabel primary={"Price"} />
          </BaseListItem>
          <BaseListItem
            secondaryAction={
              <>{formatNumber(Number(pool.totalBorrowed))} FXD</>
            }
          >
            <ListItemLabel primary={"Borrowed"} />
          </BaseListItem>{" "}
          <BaseListItem
            secondaryAction={
              <>{formatNumber(Number(pool.totalAvailable))} FXD</>
            }
          >
            <ListItemLabel primary={"Available"} />
          </BaseListItem>
        </BaseListPreviewModal>
      </BasePreviewModalPaper>

      <PreviewModalButtonWrapper>
        <OpenPositionButton onClick={() => setSelectedPool(pool)}>
          <AddCircleIcon sx={{ fontSize: "20px", marginRight: "7px" }} />
          Open Position
        </OpenPositionButton>
      </PreviewModalButtonWrapper>
    </BaseDialogFullScreen>
  );
};

export default PoolListItemPreviewModal;
