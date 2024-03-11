import { useCallback, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BigNumber } from "@into-the-fathom/bignumber";
import { TransactionResponse } from "@into-the-fathom/providers";
import {
  ChainId,
  Currency,
  currencyEquals,
  TokenAmount,
  WETH,
  XDC,
} from "into-the-fathom-swap-sdk";
import ReactGA from "react-ga4";
import { Box, styled, Typography } from "@mui/material";

import useConnector from "context/connector";
import { ButtonError, ButtonPrimary } from "apps/dex/components/Button";
import { BlueCard, LightCard } from "apps/dex/components/Card";
import { AutoColumn, ColumnCenter } from "apps/dex/components/Column";
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from "apps/dex/components/TransactionConfirmationModal";
import CurrencyInputPanel from "apps/dex/components/CurrencyInputPanel";
import DoubleCurrencyLogo from "apps/dex/components/DoubleLogo";
import { AddRemoveTabs } from "apps/dex/components/NavigationTabs";
import { MinimalPositionCard } from "apps/dex/components/PositionCard";
import Row, { RowBetween, RowFlat } from "apps/dex/components/Row";

import { ROUTER_ADDRESSES } from "apps/dex/constants";
import { PairState } from "apps/dex/data/Reserves";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useCurrency } from "apps/dex/hooks/Tokens";
import {
  ApprovalState,
  useApproveCallback,
} from "apps/dex/hooks/useApproveCallback";
import useTransactionDeadline from "apps/dex/hooks/useTransactionDeadline";
import { Field } from "apps/dex/state/mint/actions";
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from "apps/dex/state/mint/hooks";

import { useTransactionAdder } from "apps/dex/state/transactions/hooks";
import {
  useIsExpertMode,
  useUserSlippageTolerance,
} from "apps/dex/state/user/hooks";
import { TYPE } from "apps/dex/theme";
import {
  calculateGasMargin,
  calculateSlippageAmount,
  getRouterContract,
} from "apps/dex/utils";
import { maxAmountSpend } from "apps/dex/utils/maxAmountSpend";
import { wrappedCurrency } from "apps/dex/utils/wrappedCurrency";
import AppBody from "apps/dex/pages/AppBody";
import { Dots, Wrapper } from "apps/dex/pages/Pool/styleds";
import { ConfirmAddModalBottom } from "apps/dex/pages/AddLiquidity/ConfirmAddModalBottom";
import { currencyId } from "apps/dex/utils/currencyId";
import { PoolPriceBar } from "apps/dex/pages/AddLiquidity/PoolPriceBar";
import { useIsTransactionUnsupported } from "apps/dex/hooks/Trades";
import UnsupportedCurrencyFooter from "apps/dex/components/swap/UnsupportedCurrencyFooter";
import { ConnectWalletButton, WalletIcon } from "apps/dex/pages/Swap";

import AddIcon from "@mui/icons-material/Add";

const PlusWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const IconWrapper = styled(Box)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6379a1;
  border-radius: 15px;
`;

const AddLiquidity = () => {
  const { account, chainId, library } = useActiveWeb3React();
  const { currencyIdA, currencyIdB } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  const oneCurrencyIsXDC = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, (WETH as any)[chainId])) ||
        (currencyB && currencyEquals(currencyB, (WETH as any)[chainId])))
  );

  const { openConnectorMenu } = useConnector(); // toggle wallet when disconnected

  const expertMode = useIsExpertMode();

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity);

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance(); // custom from users
  const [txHash, setTxHash] = useState<string>("");

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity
      ? otherTypedValue
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    };
  }, {});

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? "0"),
    };
  }, {});

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    ROUTER_ADDRESSES[chainId as ChainId]
  );
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    ROUTER_ADDRESSES[chainId as ChainId]
  );

  const addTransaction = useTransactionAdder();

  async function onAdd() {
    if (!chainId || !library || !account) return;
    const router = getRouterContract(chainId, library, account);

    const {
      [Field.CURRENCY_A]: parsedAmountA,
      [Field.CURRENCY_B]: parsedAmountB,
    } = parsedAmounts;
    if (
      !parsedAmountA ||
      !parsedAmountB ||
      !currencyA ||
      !currencyB ||
      !deadline
    ) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        parsedAmountA,
        noLiquidity ? 0 : allowedSlippage
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        parsedAmountB,
        noLiquidity ? 0 : allowedSlippage
      )[0],
    };

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null;
    const isNativeToken = currencyA === XDC || currencyB === XDC;

    if (isNativeToken) {
      const tokenBIsXDC = currencyB === XDC;
      estimate = router.estimateGas.addLiquidityETH;
      method = router.addLiquidityETH;

      args = [
        wrappedCurrency(tokenBIsXDC ? currencyA : currencyB, chainId)
          ?.address ?? "", // token
        (tokenBIsXDC ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[
          tokenBIsXDC ? Field.CURRENCY_A : Field.CURRENCY_B
        ].toString(), // token min
        amountsMin[
          tokenBIsXDC ? Field.CURRENCY_B : Field.CURRENCY_A
        ].toString(), // eth min
        account,
        deadline.toHexString(),
      ];
      value = BigNumber.from(
        (tokenBIsXDC ? parsedAmountB : parsedAmountA).raw.toString()
      );
    } else {
      estimate = router.estimateGas.addLiquidity;
      method = router.addLiquidity;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? "",
        wrappedCurrency(currencyB, chainId)?.address ?? "",
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ];
      value = null;
    }

    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary:
              "Add " +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              " " +
              currencies[Field.CURRENCY_A]?.symbol +
              " and " +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              " " +
              currencies[Field.CURRENCY_B]?.symbol,
          });

          setTxHash(response.hash);

          ReactGA.event({
            category: "Liquidity",
            action: "Add",
            label: [
              currencies[Field.CURRENCY_A]?.symbol,
              currencies[Field.CURRENCY_B]?.symbol,
            ].join("/"),
          });
        })
      )
      .catch((error) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error);
        }
      });
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="20px">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography
              fontSize="28px"
              fontWeight={500}
              lineHeight="42px"
              marginRight={10}
            >
              {currencies[Field.CURRENCY_A]?.symbol +
                "/" +
                currencies[Field.CURRENCY_B]?.symbol}
            </Typography>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="20px">
        <RowFlat style={{ marginTop: "20px" }}>
          <Typography
            fontSize="38px"
            fontWeight={500}
            lineHeight="42px"
            marginRight="10px"
          >
            {liquidityMinted?.toSignificant(6)}
          </Typography>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </RowFlat>
        <Row>
          <Typography fontSize="22px">
            {currencies[Field.CURRENCY_A]?.symbol +
              "/" +
              currencies[Field.CURRENCY_B]?.symbol +
              " Pool Tokens"}
          </Typography>
        </Row>
        <TYPE.italic fontSize={12} textAlign="left" padding={"8px 0 0 0 "}>
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    );
  };

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    );
  };

  const pendingText = `Supplying ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_B]?.symbol
  }`;

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA);
      if (newCurrencyIdA === currencyIdB) {
        navigate(`/swap/add/${currencyIdB}/${currencyIdA}`);
      } else {
        navigate(`/swap/add/${newCurrencyIdA}/${currencyIdB}`);
      }
    },
    [currencyIdB, navigate, currencyIdA]
  );
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB);
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          navigate(`/swap/add/${currencyIdB}/${newCurrencyIdB}`);
        } else {
          navigate(`/swap/add/${newCurrencyIdB}`);
        }
      } else {
        navigate(
          `/swap/add/${currencyIdA ? currencyIdA : "XDC"}/${newCurrencyIdB}`
        );
      }
    },
    [currencyIdA, navigate, currencyIdB]
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput("");
    }
    setTxHash("");
  }, [onFieldAInput, txHash]);

  const isCreate = location.pathname.includes("/swap/create");

  const addIsUnsupported = useIsTransactionUnsupported(
    currencies?.CURRENCY_A,
    currencies?.CURRENCY_B
  );

  return (
    <>
      <AppBody>
        <AddRemoveTabs creating={isCreate} adding={true} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title={
                  noLiquidity ? "You are creating a pool" : "You will receive"
                }
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
            currencyToAdd={pair?.liquidityToken}
          />
          <AutoColumn gap="20px">
            {noLiquidity ||
              (isCreate ? (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn>
                      <TYPE.white fontWeight={600}>
                        You are the first liquidity provider.
                      </TYPE.white>
                      <TYPE.white fontWeight={400}>
                        The ratio of tokens you add will set the price of this
                        pool. <br />
                        Once you are happy with the rate click supply to review.
                      </TYPE.white>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ) : (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.white fontWeight={400}>
                        <b>Tip:</b> When you add liquidity, you will receive
                        pool tokens representing your position. These tokens
                        automatically earn fees proportional to your share of
                        the pool, and can be redeemed at any time.
                      </TYPE.white>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ))}
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? "");
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <PlusWrapper>
              <ColumnCenter>
                <IconWrapper>
                  <AddIcon
                    sx={{
                      width: "20px",
                      height: "20px",
                      color: "#061023",
                    }}
                  />
                </IconWrapper>
              </ColumnCenter>
            </PlusWrapper>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? "");
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
            />
            {currencies[Field.CURRENCY_A] &&
              currencies[Field.CURRENCY_B] &&
              pairState !== PairState.INVALID && (
                <>
                  <LightCard borderRadius={"20px"} padding={"0"}>
                    <RowBetween padding="1rem">
                      <TYPE.subHeader fontWeight={500} fontSize={14}>
                        {noLiquidity ? "Initial prices" : "Prices"} and pool
                        share
                      </TYPE.subHeader>
                    </RowBetween>{" "}
                    <LightCard padding="1rem" borderRadius={"20px"}>
                      <PoolPriceBar
                        currencies={currencies}
                        poolTokenPercentage={poolTokenPercentage}
                        noLiquidity={noLiquidity}
                        price={price}
                      />
                    </LightCard>
                  </LightCard>
                </>
              )}

            {addIsUnsupported ? (
              <ButtonPrimary disabled={true}>
                <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
              </ButtonPrimary>
            ) : !account ? (
              <ConnectWalletButton onClick={openConnectorMenu}>
                <WalletIcon></WalletIcon>
                Connect Wallet
              </ConnectWalletButton>
            ) : (
              <AutoColumn gap={"md"}>
                {(approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING) &&
                  isValid && (
                    <RowBetween>
                      {approvalA !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}
                          width={
                            approvalB !== ApprovalState.APPROVED
                              ? "48%"
                              : "100%"
                          }
                        >
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>
                              Approving {currencies[Field.CURRENCY_A]?.symbol}
                            </Dots>
                          ) : (
                            "Approve " + currencies[Field.CURRENCY_A]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          onClick={approveBCallback}
                          disabled={approvalB === ApprovalState.PENDING}
                          width={
                            approvalA !== ApprovalState.APPROVED
                              ? "48%"
                              : "100%"
                          }
                        >
                          {approvalB === ApprovalState.PENDING ? (
                            <Dots>
                              Approving {currencies[Field.CURRENCY_B]?.symbol}
                            </Dots>
                          ) : (
                            "Approve " + currencies[Field.CURRENCY_B]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                    </RowBetween>
                  )}
                <ButtonError
                  onClick={() => {
                    expertMode ? onAdd() : setShowConfirm(true);
                  }}
                  disabled={
                    !isValid ||
                    approvalA !== ApprovalState.APPROVED ||
                    approvalB !== ApprovalState.APPROVED
                  }
                  error={
                    !isValid &&
                    !!parsedAmounts[Field.CURRENCY_A] &&
                    !!parsedAmounts[Field.CURRENCY_B]
                  }
                >
                  <Typography fontSize={20} fontWeight={500}>
                    {error ?? "Supply"}
                  </Typography>
                </ButtonError>
              </AutoColumn>
            )}
          </AutoColumn>
        </Wrapper>
      </AppBody>
      {!addIsUnsupported ? (
        pair && !noLiquidity && pairState !== PairState.INVALID ? (
          <AutoColumn
            style={{
              minWidth: "20rem",
              width: "100%",
              maxWidth: "400px",
              marginTop: "1rem",
            }}
          >
            <MinimalPositionCard showUnwrapped={oneCurrencyIsXDC} pair={pair} />
          </AutoColumn>
        ) : null
      ) : (
        <UnsupportedCurrencyFooter
          show={addIsUnsupported}
          currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
        />
      )}
    </>
  );
};

export default AddLiquidity;
