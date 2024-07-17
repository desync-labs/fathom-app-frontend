import { FC, memo, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency } from "utils/format";
import { TVL } from "components/AppComponents/AppBox/AppBox";
import { PositionListItemProps } from "components/PositionList/PositionListItem";
import PoolName from "components/Pools/PoolListItem/PoolName";
import PositionListItemPreviewModal from "components/PositionList/PositionListItemPreviewModal";

export const PositionListItemMobileContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #132340;
  border-radius: 8px;
  margin-bottom: 4px;
  padding: 14px 16px;

  &:active {
    background: #2c4066;
  }
`;

const PoolWrapper = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
`;

const PoolId = styled(Box)`
  width: 40px;
`;

const PositionListItemMobile: FC<PositionListItemProps> = ({
  position,
  setTopUpPosition,
}) => {
  const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false);

  const handleOpenPreviewModal = () => {
    setIsOpenPreviewModal(true);
  };
  const handleClosePreviewModal = () => {
    setIsOpenPreviewModal(false);
  };
  return (
    <>
      <PositionListItemMobileContainer onClick={handleOpenPreviewModal}>
        <PoolWrapper>
          <PoolId>{position.positionId}</PoolId>
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
      </PositionListItemMobileContainer>
      {useMemo(() => {
        return (
          <PositionListItemPreviewModal
            position={position}
            isOpenPreviewModal={isOpenPreviewModal}
            handleClosePreview={handleClosePreviewModal}
            setTopUpPosition={setTopUpPosition}
          />
        );
      }, [position, isOpenPreviewModal, setTopUpPosition])}
    </>
  );
};

export default memo(PositionListItemMobile);
