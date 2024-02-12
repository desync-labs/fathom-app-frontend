import { ChainId, Currency } from "into-the-fathom-swap-sdk";
import { FC, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import Modal from "apps/dex/components/Modal";
import { ExternalLink } from "apps/dex/theme";
import { Text } from "rebass";
import { CloseIcon, CustomLightSpinner } from "apps/dex/theme/components";
import { RowBetween, RowFixed } from "apps/dex/components/Row";
import { AlertTriangle, ArrowUpCircle, CheckCircle } from "react-feather";
import { ButtonPrimary, ButtonLight } from "apps/dex/components/Button";
import { AutoColumn, ColumnCenter } from "apps/dex/components/Column";
import Circle from "apps/dex/assets/images/blue-loader.svg";
import MetaMaskLogo from "apps/dex/assets/images/metamask.png";
import { getBlockScanLink } from "apps/dex/utils";
import { useActiveWeb3React } from "apps/dex/hooks";
import useAddTokenToMetamask from "apps/dex/hooks/useAddTokenToMetamask";

const Wrapper = styled.div`
  width: 100%;
  border: 1px solid #253656;
`;
const Section = styled(AutoColumn)`
  padding: 24px;
`;

const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

const StyledLogo = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 6px;
`;

type ConfirmationPendingContentProps = {
  onDismiss: () => void;
  pendingText: string;
};

const ConfirmationPendingContent: FC<ConfirmationPendingContentProps> = ({
  onDismiss,
  pendingText,
}) => {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <CustomLightSpinner src={Circle} alt="loader" size={"90px"} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={"center"}>
          <Text
            fontWeight={500}
            fontSize={20}
            data-testid="dex-waitingForConfirmationModal-headerText"
          >
            Waiting For Confirmation
          </Text>
          <AutoColumn gap="12px" justify={"center"}>
            <Text
              fontWeight={600}
              fontSize={14}
              color=""
              textAlign="center"
              data-testid="dex-waitingForConfirmationModal-bodyText"
            >
              {pendingText}
            </Text>
          </AutoColumn>
          <Text
            fontSize={12}
            color="#565A69"
            textAlign="center"
            data-testid="dex-waitingForConfirmationModal-footerText"
          >
            Confirm this transaction in your wallet
          </Text>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
};

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
  currencyToAdd?: Currency | undefined;
}) {
  const theme = useContext(ThemeContext);

  const { library } = useActiveWeb3React();

  const { addToken, success } = useAddTokenToMetamask(currencyToAdd);

  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme?.white} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={"center"}>
          <Text
            fontWeight={500}
            fontSize={20}
            data-testid="dex-transactionSubmittedModal-headerText"
          >
            Transaction Submitted
          </Text>
          {chainId && hash && (
            <ExternalLink href={getBlockScanLink(chainId, hash, "transaction")}>
              <Text
                fontWeight={600}
                fontSize={14}
                color={theme?.text2}
                data-testid="dex-transactionSubmittedModal-footerText"
              >
                View on Blocksscan
              </Text>
            </ExternalLink>
          )}
          {currencyToAdd && library?.provider?.isMetaMask && (
            <ButtonLight
              mt="12px"
              padding="6px 12px"
              width="fit-content"
              onClick={addToken}
            >
              {!success ? (
                <RowFixed>
                  Add {currencyToAdd.symbol} to Metamask{" "}
                  <StyledLogo src={MetaMaskLogo} />
                </RowFixed>
              ) : (
                <RowFixed>
                  Added {currencyToAdd.symbol}{" "}
                  <CheckCircle
                    size={"16px"}
                    stroke={theme?.green1}
                    style={{ marginLeft: "6px" }}
                  />
                </RowFixed>
              )}
            </ButtonLight>
          )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: "20px 0 0 0" }}>
            <Text
              fontWeight={500}
              fontSize={20}
              data-testid="dex-transactionSubmittedModal-closeButton"
            >
              Close
            </Text>
          </ButtonPrimary>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
}: {
  title: string;
  onDismiss: () => void;
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            {title}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {topContent()}
      </Section>
      <BottomSection gap="12px">{bottomContent()}</BottomSection>
    </Wrapper>
  );
}

export function TransactionErrorContent({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  const theme = useContext(ThemeContext);
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Text fontWeight={500} fontSize={20}>
            Error
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn
          style={{ marginTop: 20, padding: "2rem 0" }}
          gap="24px"
          justify="center"
        >
          <AlertTriangle
            color={theme?.red1}
            style={{ strokeWidth: 1.5 }}
            size={64}
          />
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme?.red1}
            style={{
              textAlign: "center",
              width: "85%",
              wordBreak: "break-all",
            }}
          >
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
      </BottomSection>
    </Wrapper>
  );
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  currencyToAdd?: Currency | undefined;
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React();

  if (!chainId) return null;

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent
          onDismiss={onDismiss}
          pendingText={pendingText}
        />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  );
}
