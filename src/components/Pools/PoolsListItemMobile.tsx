import { Dispatch, FC, SetStateAction, memo, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { ICollateralPool } from "fathom-sdk";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency } from "utils/format";
import { TVL } from "components/AppComponents/AppBox/AppBox";
import PoolName from "components/Pools/PoolListItem/PoolName";
import PoolListItemPreviewModal from "components/Pools/PoolListItem/PoolListItemPreviewModal";

type PoolsListItemMobilePropsType = {
  pool: ICollateralPool;
  setSelectedPool: Dispatch<SetStateAction<ICollateralPool | undefined>>;
};

export const PoolsListItemMobileContainer = styled(Box)`
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

export const PoolWrapper = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 6px;
`;

const PoolsListItemMobile: FC<PoolsListItemMobilePropsType> = ({
  pool,
  setSelectedPool,
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
      <PoolsListItemMobileContainer onClick={handleOpenPreviewModal}>
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
      </PoolsListItemMobileContainer>
      {useMemo(() => {
        return (
          <PoolListItemPreviewModal
            pool={pool}
            isOpenPreviewModal={isOpenPreviewModal}
            handleClosePreview={handleClosePreviewModal}
            setSelectedPool={setSelectedPool}
          />
        );
      }, [pool, isOpenPreviewModal, setSelectedPool])}
    </>
  );
};

export default memo(PoolsListItemMobile);
