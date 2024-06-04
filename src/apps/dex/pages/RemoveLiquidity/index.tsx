import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BigNumber } from "fathom-ethers";
import { splitSignature } from "@into-the-fathom/bytes";
import { Contract } from "@into-the-fathom/contracts";
import { TransactionResponse } from "@into-the-fathom/providers";
import {
  ChainId,
  Currency,
  currencyEquals,
  Percent,
  WETH,
  XDC,
} from "into-the-fathom-swap-sdk";
import ReactGA from "react-ga4";
import { Box, styled, Typography } from "@mui/material";

import {
  ButtonPrimary,
  ButtonError,
  ButtonConfirmed,
} from "apps/dex/components/Button";
import { BlueCard, LightCard } from "apps/dex/components/Card";
import { AutoColumn, ColumnCenter } from "apps/dex/components/Column";
import TransactionConfirmationModal, {
  ConfirmationModalContent,
} from "apps/dex/components/TransactionConfirmationModal";
import CurrencyInputPanel from "apps/dex/components/CurrencyInputPanel";
import DoubleCurrencyLogo from "apps/dex/components/DoubleLogo";
import { AddRemoveTabs } from "apps/dex/components/NavigationTabs";
import { MinimalPositionCard } from "apps/dex/components/PositionCard";
import Row, { RowBetween, RowFixed } from "apps/dex/components/Row";
import Slider from "apps/dex/components/Slider";
import CurrencyLogo from "apps/dex/components/CurrencyLogo";
import { ROUTER_ADDRESSES } from "apps/dex/constants";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useCurrency } from "apps/dex/hooks/Tokens";
import { usePairContract } from "apps/dex/hooks/useContract";
import useTransactionDeadline from "apps/dex/hooks/useTransactionDeadline";
import { useTransactionAdder } from "apps/dex/state/transactions/hooks";
import { StyledInternalLink, TYPE } from "apps/dex/theme";
import {
  calculateGasMargin,
  calculateSlippageAmount,
  getRouterContract,
} from "apps/dex/utils";
import { currencyId } from "apps/dex/utils/currencyId";
import useDebouncedChangeHandler from "apps/dex/utils/useDebouncedChangeHandler";
import { wrappedCurrency } from "apps/dex/utils/wrappedCurrency";
import AppBody from "apps/dex/pages/AppBody";
import { ClickableText, MaxButton, Wrapper } from "apps/dex/pages/Pool/styleds";
import {
  useApproveCallback,
  ApprovalState,
} from "apps/dex/hooks/useApproveCallback";
import {
  ArrowDownWrapped,
  ArrowWrapper,
  Dots,
} from "apps/dex/components/swap/styleds";
import { useBurnActionHandlers } from "apps/dex/state/burn/hooks";
import { useDerivedBurnInfo, useBurnState } from "apps/dex/state/burn/hooks";
import { Field } from "apps/dex/state/burn/actions";
import { useUserSlippageTolerance } from "apps/dex/state/user/hooks";
import { ConnectWalletButton, WalletIcon } from "apps/dex/pages/Swap";
import useConnector from "context/connector";

import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

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

const RemoveLiquidity = () => {
  const { currencyIdA, currencyIdB } = useParams();
  const navigate = useNavigate();

  const [currencyA, currencyB] = [
    useCurrency(currencyIdA) ?? undefined,
    useCurrency(currencyIdB) ?? undefined,
  ];
  const { account, chainId, library } = useActiveWeb3React();
  const [tokenA, tokenB] = useMemo(
    () => [
      wrappedCurrency(currencyA, chainId),
      wrappedCurrency(currencyB, chainId),
    ],
    [currencyA, currencyB, chainId]
  );

  // toggle wallet when disconnected
  const { openConnectorMenu } = useConnector();

  // burn state
  const { independentField, typedValue } = useBurnState();
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  );
  const { onUserInput: _onUserInput } = useBurnActionHandlers();
  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showDetailed, setShowDetailed] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState(false); // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>("");
  const deadline = useTransactionDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo(
      "0"
    )
      ? "0"
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent("1", "100"))
      ? "<1"
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY
        ? typedValue
        : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? "",
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? typedValue
        : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? "",
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? typedValue
        : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? "",
  };

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(
    new Percent("1")
  );

  // pair contract
  const pairContract: Contract | null = usePairContract(
    pair?.liquidityToken?.address
  );

  // allowance handling
  const [signatureData, setSignatureData] = useState<{
    v: number;
    r: string;
    s: string;
    deadline: number;
  } | null>(null);
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    ROUTER_ADDRESSES[chainId as ChainId]
  );

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline)
      throw new Error("missing dependencies");
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error("missing liquidity amount");

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account);

    const EIP712Domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];
    const domain = {
      name: "Fathom DEX",
      version: "1",
      chainId: chainId,
      verifyingContract: pair.liquidityToken.address,
    };
    const Permit = [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];
    const message = {
      owner: account,
      spender: ROUTER_ADDRESSES[chainId as ChainId],
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber(),
    };
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: "Permit",
      message,
    });

    library
      .send("eth_signTypedData_v4", [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber(),
        });
      })
      .catch((error) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback();
        }
      });
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setSignatureData(null);
      return _onUserInput(field, typedValue);
    },
    [_onUserInput]
  );

  const onLiquidityInput = useCallback(
    (typedValue: string): void => onUserInput(Field.LIQUIDITY, typedValue),
    [onUserInput]
  );
  const onCurrencyAInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_A, typedValue),
    [onUserInput]
  );
  const onCurrencyBInput = useCallback(
    (typedValue: string): void => onUserInput(Field.CURRENCY_B, typedValue),
    [onUserInput]
  );

  // tx sending
  const addTransaction = useTransactionAdder();
  async function onRemove() {
    if (!chainId || !library || !account || !deadline)
      throw new Error("missing dependencies");
    const {
      [Field.CURRENCY_A]: currencyAmountA,
      [Field.CURRENCY_B]: currencyAmountB,
    } = parsedAmounts;
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error("missing currency amounts");
    }
    const router = getRouterContract(chainId, library, account);

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        currencyAmountA,
        allowedSlippage
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        currencyAmountB,
        allowedSlippage
      )[0],
    };

    if (!currencyA || !currencyB) throw new Error("missing tokens");
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
    if (!liquidityAmount) throw new Error("missing liquidity amount");

    const currencyBIsXDC = currencyB === XDC;
    const oneCurrencyIsXDC = currencyA === XDC || currencyBIsXDC;

    if (!tokenA || !tokenB) throw new Error("could not wrap");

    let methodNames: string[],
      args: Array<string | string[] | number | boolean>;
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsXDC) {
        methodNames = [
          "removeLiquidityETH",
          "removeLiquidityETHSupportingFeeOnTransferTokens",
        ];
        args = [
          currencyBIsXDC ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[
            currencyBIsXDC ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsXDC ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          deadline.toHexString(),
        ];
      }
      // removeLiquidity
      else {
        methodNames = ["removeLiquidity"];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ];
      }
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsXDC) {
        methodNames = [
          "removeLiquidityETHWithPermit",
          "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
        ];
        args = [
          currencyBIsXDC ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[
            currencyBIsXDC ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsXDC ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ["removeLiquidityWithPermit"];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
    } else {
      throw new Error(
        "Attempting to confirm without approval or a signature. Please contact support."
      );
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((error) => {
            console.error(`estimateGas failed`, methodName, args, error);
            return undefined;
          })
      )
    );

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
      (safeGasEstimate) => BigNumber.isBigNumber(safeGasEstimate)
    );

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error("This transaction would fail. Please contact support.");
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation];
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

      setAttemptingTxn(true);
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            summary:
              "Remove " +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              " " +
              currencyA?.symbol +
              " and " +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              " " +
              currencyB?.symbol,
          });

          setTxHash(response.hash);

          ReactGA.event({
            category: "Liquidity",
            action: "Remove",
            label: [currencyA?.symbol, currencyB?.symbol].join("/"),
          });
        })
        .catch((error: Error) => {
          setAttemptingTxn(false);
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error);
        });
    }
  }

  function modalHeader() {
    return (
      <AutoColumn gap={"md"} style={{ marginTop: "20px" }}>
        <RowBetween align="flex-end">
          <Typography fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Typography>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyA} size={"24px"} />
            <Typography
              fontSize={24}
              fontWeight={500}
              style={{ marginLeft: "10px" }}
            >
              {currencyA?.symbol}
            </Typography>
          </RowFixed>
        </RowBetween>
        <PlusWrapper>
          <ColumnCenter>
            <IconWrapper>
              <AddIcon
                sx={{ width: "20px", height: "20px", color: "#061023" }}
              />
            </IconWrapper>
          </ColumnCenter>
        </PlusWrapper>
        <RowBetween align="flex-end">
          <Typography fontSize={24} fontWeight={500}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Typography>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyB} size={"24px"} />
            <Typography
              fontSize={24}
              fontWeight={500}
              style={{ marginLeft: "10px" }}
            >
              {currencyB?.symbol}
            </Typography>
          </RowFixed>
        </RowBetween>

        <TYPE.italic
          fontSize={12}
          color="#4f658c"
          textAlign="left"
          padding={"12px 0 0 0"}
        >
          {`Output is estimated. If the price changes by more than ${
            allowedSlippage / 100
          }% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    );
  }

  function modalBottom() {
    return (
      <>
        <RowBetween>
          <Typography color="#4f658c" fontWeight={500} fontSize={16}>
            {"FTHM " + currencyA?.symbol + "/" + currencyB?.symbol} Burned
          </Typography>
          <RowFixed>
            <DoubleCurrencyLogo
              currency0={currencyA}
              currency1={currencyB}
              margin={true}
            />
            <Typography fontWeight={500} fontSize={16}>
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </Typography>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <Typography color="#4f658c" fontWeight={500} fontSize={16}>
                Price
              </Typography>
              <Typography fontWeight={500} fontSize={16} color="#ffffff">
                1 {currencyA?.symbol} ={" "}
                {tokenA ? pair.priceOf(tokenA).toSignificant(6) : "-"}{" "}
                {currencyB?.symbol}
              </Typography>
            </RowBetween>
            <RowBetween>
              <div />
              <Typography fontWeight={500} fontSize={16} color="#ffffff">
                1 {currencyB?.symbol} ={" "}
                {tokenB ? pair.priceOf(tokenB).toSignificant(6) : "-"}{" "}
                {currencyA?.symbol}
              </Typography>
            </RowBetween>
          </>
        )}
        <ButtonPrimary
          disabled={
            !(approval === ApprovalState.APPROVED || signatureData !== null)
          }
          onClick={onRemove}
        >
          <Typography fontWeight={500} fontSize={20}>
            Confirm
          </Typography>
        </ButtonPrimary>
      </>
    );
  }

  const pendingText = `Removing ${parsedAmounts[
    Field.CURRENCY_A
  ]?.toSignificant(6)} ${currencyA?.symbol} and ${parsedAmounts[
    Field.CURRENCY_B
  ]?.toSignificant(6)} ${currencyB?.symbol}`;

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString());
    },
    [onUserInput]
  );

  const oneCurrencyIsXDC = currencyA === XDC || currencyB === XDC;
  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals((WETH as any)[chainId], currencyA)) ||
        (currencyB && currencyEquals((WETH as any)[chainId], currencyB)))
  );

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        navigate(`/swap/remove/${currencyId(currency)}/${currencyIdA}`);
      } else {
        navigate(`/swap/remove/${currencyId(currency)}/${currencyIdB}`);
      }
    },
    [currencyIdA, currencyIdB, navigate]
  );
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        navigate(`/swap/remove/${currencyIdB}/${currencyId(currency)}`);
      } else {
        navigate(`/swap/remove/${currencyIdA}/${currencyId(currency)}`);
      }
    },
    [currencyIdA, currencyIdB, navigate]
  );

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false);
    setSignatureData(null); // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, "0");
    }
    setTxHash("");
  }, [onUserInput, txHash]);

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] =
    useDebouncedChangeHandler(
      Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
      liquidityPercentChangeCallback
    );

  return (
    <>
      <AppBody>
        <AddRemoveTabs creating={false} adding={false} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash ? txHash : ""}
            content={() => (
              <ConfirmationModalContent
                title={"You will receive"}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap="md">
            <BlueCard>
              <AutoColumn gap="10px">
                <TYPE.white fontWeight={400}>
                  <b>Tip:</b> Removing pool tokens converts your position back
                  into underlying tokens at the current rate, proportional to
                  your share of the pool. Accrued fees are included in the
                  amounts you receive.
                </TYPE.white>
              </AutoColumn>
            </BlueCard>
            <LightCard>
              <AutoColumn gap="20px">
                <RowBetween>
                  <Typography fontWeight={500}>Amount</Typography>
                  <ClickableText
                    fontWeight={500}
                    onClick={() => {
                      setShowDetailed(!showDetailed);
                    }}
                  >
                    {showDetailed ? "Simple" : "Detailed"}
                  </ClickableText>
                </RowBetween>
                <Row style={{ alignItems: "flex-end" }}>
                  <Typography fontSize={72} fontWeight={500}>
                    {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                  </Typography>
                </Row>
                {!showDetailed && (
                  <>
                    <Slider
                      value={innerLiquidityPercentage}
                      onChange={setInnerLiquidityPercentage}
                    />
                    <RowBetween>
                      <MaxButton
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, "25")
                        }
                        width="20%"
                      >
                        25%
                      </MaxButton>
                      <MaxButton
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, "50")
                        }
                        width="20%"
                      >
                        50%
                      </MaxButton>
                      <MaxButton
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, "75")
                        }
                        width="20%"
                      >
                        75%
                      </MaxButton>
                      <MaxButton
                        onClick={() =>
                          onUserInput(Field.LIQUIDITY_PERCENT, "100")
                        }
                        width="20%"
                      >
                        Max
                      </MaxButton>
                    </RowBetween>
                  </>
                )}
              </AutoColumn>
            </LightCard>
            {!showDetailed && (
              <>
                <ColumnCenter>
                  <ArrowWrapper clickable={false}>
                    <ArrowDownWrapped>
                      <ArrowDownwardRoundedIcon
                        sx={{ width: "20px", height: "20px", color: "#000" }}
                      />
                    </ArrowDownWrapped>
                  </ArrowWrapper>
                </ColumnCenter>
                <LightCard>
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <Typography fontSize={24} fontWeight={500}>
                        {formattedAmounts[Field.CURRENCY_A] || "-"}
                      </Typography>
                      <RowFixed>
                        <CurrencyLogo
                          currency={currencyA}
                          style={{ marginRight: "12px" }}
                        />
                        <Typography
                          fontSize={24}
                          fontWeight={500}
                          id="remove-liquidity-tokena-symbol"
                        >
                          {currencyA?.symbol}
                        </Typography>
                      </RowFixed>
                    </RowBetween>
                    <RowBetween>
                      <Typography fontSize={24} fontWeight={500}>
                        {formattedAmounts[Field.CURRENCY_B] || "-"}
                      </Typography>
                      <RowFixed>
                        <CurrencyLogo
                          currency={currencyB}
                          style={{ marginRight: "12px" }}
                        />
                        <Typography
                          fontSize={24}
                          fontWeight={500}
                          id="remove-liquidity-tokenb-symbol"
                        >
                          {currencyB?.symbol}
                        </Typography>
                      </RowFixed>
                    </RowBetween>
                    {chainId && (oneCurrencyIsWETH || oneCurrencyIsXDC) ? (
                      <RowBetween style={{ justifyContent: "flex-end" }}>
                        {oneCurrencyIsXDC ? (
                          <StyledInternalLink
                            to={`/swap/remove/${
                              currencyA === XDC
                                ? WETH[chainId].address
                                : currencyIdA
                            }/${
                              currencyB === XDC
                                ? WETH[chainId].address
                                : currencyIdB
                            }`}
                          >
                            Receive WXDC
                          </StyledInternalLink>
                        ) : oneCurrencyIsWETH ? (
                          <StyledInternalLink
                            to={`/swap/remove/${
                              currencyA &&
                              currencyEquals(currencyA, WETH[chainId])
                                ? "XDC"
                                : currencyIdA
                            }/${
                              currencyB &&
                              currencyEquals(currencyB, WETH[chainId])
                                ? "XDC"
                                : currencyIdB
                            }`}
                          >
                            Receive XDC
                          </StyledInternalLink>
                        ) : null}
                      </RowBetween>
                    ) : null}
                  </AutoColumn>
                </LightCard>
              </>
            )}

            {showDetailed && (
              <>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.LIQUIDITY]}
                  onUserInput={onLiquidityInput}
                  onMax={() => {
                    onUserInput(Field.LIQUIDITY_PERCENT, "100");
                  }}
                  showMaxButton={!atMaxAmount}
                  disableCurrencySelect
                  currency={pair?.liquidityToken}
                  pair={pair}
                  id="liquidity-amount"
                />
                <ColumnCenter>
                  <ArrowWrapper clickable={false}>
                    <ArrowDownWrapped>
                      <ArrowDownwardRoundedIcon
                        sx={{ width: "20px", height: "20px", color: "#000" }}
                      />
                    </ArrowDownWrapped>
                  </ArrowWrapper>
                </ColumnCenter>
                <CurrencyInputPanel
                  hideBalance={true}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onCurrencyAInput}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, "100")}
                  showMaxButton={!atMaxAmount}
                  currency={currencyA}
                  label={"Output"}
                  onCurrencySelect={handleSelectCurrencyA}
                  id="remove-liquidity-tokena"
                />
                <PlusWrapper>
                  <ColumnCenter>
                    <IconWrapper>
                      <AddIcon
                        sx={{ width: "20px", height: "20px", color: "#061023" }}
                      />
                    </IconWrapper>
                  </ColumnCenter>
                </PlusWrapper>
                <CurrencyInputPanel
                  hideBalance={true}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onCurrencyBInput}
                  onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, "100")}
                  showMaxButton={!atMaxAmount}
                  currency={currencyB}
                  label={"Output"}
                  onCurrencySelect={handleSelectCurrencyB}
                  id="remove-liquidity-tokenb"
                />
              </>
            )}
            {pair && (
              <div style={{ padding: "10px 20px" }}>
                <RowBetween>
                  Price:
                  <div>
                    1 {currencyA?.symbol} ={" "}
                    {tokenA ? pair.priceOf(tokenA).toSignificant(6) : "-"}{" "}
                    {currencyB?.symbol}
                  </div>
                </RowBetween>
                <RowBetween>
                  <div />
                  <div>
                    1 {currencyB?.symbol} ={" "}
                    {tokenB ? pair.priceOf(tokenB).toSignificant(6) : "-"}{" "}
                    {currencyA?.symbol}
                  </div>
                </RowBetween>
              </div>
            )}
            <div style={{ position: "relative" }}>
              {!account ? (
                <ConnectWalletButton onClick={openConnectorMenu}>
                  <WalletIcon></WalletIcon>
                  Connect Wallet
                </ConnectWalletButton>
              ) : (
                <RowBetween>
                  <ButtonConfirmed
                    onClick={onAttemptToApprove}
                    confirmed={
                      approval === ApprovalState.APPROVED ||
                      signatureData !== null
                    }
                    disabled={
                      approval !== ApprovalState.NOT_APPROVED ||
                      signatureData !== null
                    }
                    sx={{
                      marginRight: "0.5rem",
                      fontWeight: 500,
                      fontSize: 16,
                    }}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <Dots>Approving</Dots>
                    ) : approval === ApprovalState.APPROVED ||
                      signatureData !== null ? (
                      "Approved"
                    ) : (
                      "Approve"
                    )}
                  </ButtonConfirmed>
                  <ButtonError
                    onClick={() => {
                      setShowConfirm(true);
                    }}
                    disabled={
                      !isValid ||
                      (signatureData === null &&
                        approval !== ApprovalState.APPROVED)
                    }
                    error={
                      !isValid &&
                      !!parsedAmounts[Field.CURRENCY_A] &&
                      !!parsedAmounts[Field.CURRENCY_B]
                    }
                  >
                    <Typography fontSize={16} fontWeight={500}>
                      {error || "Remove"}
                    </Typography>
                  </ButtonError>
                </RowBetween>
              )}
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>

      {pair ? (
        <AutoColumn
          style={{
            minWidth: "20rem",
            width: "100%",
            maxWidth: "400px",
            marginTop: "1rem",
          }}
        >
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
        </AutoColumn>
      ) : null}
    </>
  );
};

export default RemoveLiquidity;
