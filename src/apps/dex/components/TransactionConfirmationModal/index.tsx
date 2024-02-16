import { FC, ReactNode } from "react";
import { ChainId, Currency } from "into-the-fathom-swap-sdk";
import { Box, styled, Typography } from "@mui/material";

import { getBlockScanLink } from "apps/dex/utils";
import { useActiveWeb3React } from "apps/dex/hooks";
import useAddTokenToMetamask from "apps/dex/hooks/useAddTokenToMetamask";
import { CloseIcon, CustomLightSpinner } from "apps/dex/theme/components";
import { RowBetween, RowFixed } from "apps/dex/components/Row";
import { ButtonPrimary, ButtonLight } from "apps/dex/components/Button";
import { AutoColumn, ColumnCenter } from "apps/dex/components/Column";
import Modal from "apps/dex/components/Modal";
import { ExternalLink } from "apps/dex/theme";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import Circle from "apps/dex/assets/images/blue-loader.svg";
import MetaMaskLogo from "apps/dex/assets/images/metamask.png";

const Wrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
`;
const Section = styled(AutoColumn)`
  padding: 24px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-bottom: 201px;
  }
`;

const BottomSection = styled(Section)`
  background-color: #061023;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin-bottom: unset;
  }
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

const StyledLogo = styled("img")`
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
          <Typography
            fontWeight={500}
            fontSize={20}
            data-testid="dex-waitingForConfirmationModal-headerText"
          >
            Waiting For Confirmation
          </Typography>
          <AutoColumn gap="12px" justify={"center"}>
            <Typography
              fontWeight={600}
              fontSize={14}
              color=""
              textAlign="center"
              data-testid="dex-waitingForConfirmationModal-bodyText"
            >
              {pendingText}
            </Typography>
          </AutoColumn>
          <Typography
            fontSize={12}
            color="#565A69"
            textAlign="center"
            data-testid="dex-waitingForConfirmationModal-footerText"
          >
            Confirm this transaction in your wallet
          </Typography>
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
          <TaskAltRoundedIcon
            sx={{
              color: "#27AE60",
              width: "90px",
              height: "90px",
            }}
          />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={"center"}>
          <Typography
            fontWeight={500}
            fontSize={20}
            data-testid="dex-transactionSubmittedModal-headerText"
          >
            Transaction Submitted
          </Typography>
          {chainId && hash && (
            <ExternalLink href={getBlockScanLink(chainId, hash, "transaction")}>
              <Typography
                fontWeight={600}
                fontSize={14}
                color="#4F658C"
                data-testid="dex-transactionSubmittedModal-footerText"
              >
                View on Blocksscan
              </Typography>
            </ExternalLink>
          )}
          {currencyToAdd && library?.provider?.isMetaMask && (
            <ButtonLight
              padding="6px 12px"
              width="fit-content"
              onClick={addToken}
              sx={{ marginTop: "12px" }}
            >
              {!success ? (
                <RowFixed>
                  Add {currencyToAdd.symbol} to Metamask{" "}
                  <StyledLogo src={MetaMaskLogo} />
                </RowFixed>
              ) : (
                <RowFixed>
                  Added {currencyToAdd.symbol}{" "}
                  <TaskAltRoundedIcon
                    sx={{
                      color: "#27AE60",
                      width: "16px",
                      height: "16px",
                      marginLeft: "6px",
                    }}
                  />
                </RowFixed>
              )}
            </ButtonLight>
          )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: "20px 0 0 0" }}>
            <Typography
              fontWeight={500}
              fontSize={20}
              data-testid="dex-transactionSubmittedModal-closeButton"
            >
              Close
            </Typography>
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
  topContent: () => ReactNode;
  bottomContent: () => ReactNode;
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Typography fontWeight={500} fontSize={20}>
            {title}
          </Typography>
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
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <Typography fontWeight={500} fontSize={20}>
            Error
          </Typography>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn
          style={{ marginTop: 20, padding: "2rem 0" }}
          gap="24px"
          justify="center"
        >
          <WarningAmberRoundedIcon
            sx={{ color: "#fd4040", width: "40px", height: "40px" }}
          />
          <Typography
            fontWeight={500}
            fontSize={14}
            color="#fd4040"
            style={{
              textAlign: "center",
              width: "85%",
              wordBreak: "break-all",
            }}
          >
            {message}
          </Typography>
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
  content: () => ReactNode;
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
