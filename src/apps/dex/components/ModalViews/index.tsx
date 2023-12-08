import { useContext } from "react";
import { useActiveWeb3React } from "apps/dex/hooks";

import { AutoColumn, ColumnCenter } from "apps/dex/components/Column";
import styled, { ThemeContext } from "styled-components";
import { RowBetween } from "apps/dex/components/Row";
import { TYPE, CloseIcon, CustomLightSpinner } from "apps/dex/theme";
import { ArrowUpCircle } from "react-feather";

import Circle from "apps/dex/assets/images/blue-loader.svg";
import { getBlockScanLink } from "apps/dex/utils";
import { ExternalLink } from "apps/dex/theme/components";

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

export function LoadingView({
  children,
  onDismiss,
}: {
  children: any;
  onDismiss: () => void;
}) {
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
}

export function SubmittedView({
  children,
  onDismiss,
  hash,
}: {
  children: any;
  onDismiss: () => void;
  hash: string | undefined;
}) {
  const theme = useContext(ThemeContext);
  const { chainId } = useActiveWeb3React();

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <ArrowUpCircle strokeWidth={0.5} size={90} color={theme?.primary1} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={"center"}>
        {children}
        {chainId && hash && (
          <ExternalLink
            href={getBlockScanLink(chainId, hash, "transaction")}
            style={{ marginLeft: "4px" }}
          >
            <TYPE.subHeader>View transaction on BlockScan</TYPE.subHeader>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  );
}
