import { FC } from "react";
import { Box, styled } from "@mui/material";
import { AutoColumn, ColumnCenter } from "apps/dex/components/Column";
import { RowBetween } from "apps/dex/components/Row";
import { TYPE, CloseIcon, CustomLightSpinner } from "apps/dex/theme";

import Circle from "apps/dex/assets/images/blue-loader.svg";

const ConfirmOrLoadingWrapper = styled(Box)`
  width: 100%;
  padding: 24px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

type LoadingViewProps = {
  children: any;
  onDismiss: () => void;
};

const LoadingView: FC<LoadingViewProps> = ({ children, onDismiss }) => {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={"90px"} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={"center"}>
        {children}
        <TYPE.subHeader>Confirm this transaction in your wallet</TYPE.subHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  );
};

export default LoadingView;
