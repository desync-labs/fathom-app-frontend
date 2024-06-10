import { Controller, useForm } from "react-hook-form";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Contract, BigNumber as eBigNumber, utils } from "fathom-ethers";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  FormGroup,
  styled,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import useConnector from "context/connector";
import { STATE_MUTABILITY_TRANSACTIONS } from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/ManagementVaultMethodList";
import { VaultItemAccordion } from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultStrategyItem";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { FlexBox } from "components/Vault/VaultListItem";
import { ApproveButton } from "components/AppComponents/AppButton/AppButton";
import { getEstimateGas } from "fathom-sdk";
import { ESTIMATE_GAS_MULTIPLIER } from "fathom-sdk/dist/cjs/utils/Constants";
import TransactionResponseDataList from "./TransactionResponseDataList";
import { FunctionFragment } from "@into-the-fathom/abi";
import useRpcError from "hooks/useRpcError";

enum MethodType {
  View = "view",
  Mutate = "mutate",
}

const MethodTypeStyled = styled(Box)`
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  &.view {
    background: #00bfff;
  }
  &.mutate {
    background: #a020f0;
  }
`;

const AccordionSummaryStyled = styled(AccordionSummary)`
  padding: 0;

  .MuiAccordionSummary-content {
    gap: 7px;
    display: flex;
    align-items: center;
  }
`;

const MethodResponseStyled = styled(Box)`
  position: relative;
  width: 100%;
  word-wrap: break-word;
`;

const MethodListItemAccordion = styled(VaultItemAccordion)`
  padding: 0 32px;
`;

const MethodListItem: FC<{
  method: FunctionFragment;
  contractAddress: string;
}> = ({ method, contractAddress }) => {
  const { formState, control, handleSubmit, getValues } = useForm({
    defaultValues: {},
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { account, library } = useConnector();
  const { showErrorNotification } = useRpcError();

  const [methodType, setMethodType] = useState<MethodType>(MethodType.View);
  const [contract, setContract] = useState<Contract>();
  const [response, setResponse] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const methodType = STATE_MUTABILITY_TRANSACTIONS.includes(
      method.stateMutability
    )
      ? MethodType.Mutate
      : MethodType.View;

    setMethodType(methodType);

    let contract;

    if (methodType === MethodType.Mutate) {
      contract = new Contract(
        contractAddress,
        [method],
        library.getSigner(account)
      );
    } else {
      contract = new Contract(contractAddress, [method], library);
    }

    setContract(contract);
  }, [contractAddress, method, library, account, setMethodType, setContract]);

  const handleSubmitForm = useCallback(async () => {
    const values = getValues();
    const options = { gasLimit: 0 };
    setIsLoading(true);

    const args: any[] = [];

    method.inputs.forEach((input, index) => {
      if (input.type === "uint256") {
        // @ts-ignore
        args[index] = utils.parseUnits(values[input.name], 18);
      } else if (input.type === "address") {
        // @ts-ignore
        args[index] = values[input.name].toLowerCase();
      } else {
        // @ts-ignore
        args[index] = values[input.name];
      }
    });

    try {
      let response;
      if (methodType === MethodType.View) {
        response = await (contract as Contract)[method.name](...args);
      } else if (methodType === MethodType.Mutate) {
        const gasLimit = await getEstimateGas(
          contract as Contract,
          method.name,
          args,
          options
        );

        options.gasLimit = Math.ceil(gasLimit * ESTIMATE_GAS_MULTIPLIER);
        const transaction = await (contract as Contract)[method.name](
          ...args,
          options
        );

        response = await transaction.wait();
      }
      setResponse(response);
    } catch (e: any) {
      console.error(e);
      showErrorNotification(e);
    } finally {
      setIsLoading(false);
    }
  }, [formState, contract, methodType, method, getValues]);

  const getMethodType = useMemo(() => {
    return methodType === MethodType.Mutate ? "Write" : "Read";
  }, [methodType]);

  const renderResponse = useCallback(() => {
    if (
      [
        "totalAssets",
        "totalSupply",
        "totalSupplyAmount",
        "totalIdleAmount",
        "totalDebtAmount",
        "balanceOf",
        "convertToAssets",
        "convertToShares",
        "depositLimit",
        "maxDeposit",
        "maxMint",
        "previewDeposit",
        "previewMint",
        "previewRedeem",
        "previewWithdraw",
        "maxMint",
        "pricePerShare",
      ].includes(method.name)
    ) {
      return utils.formatUnits(response, 18).toString();
    } else if (
      method.name === "lastProfitUpdate" ||
      method.name === "fullProfitUnlockDate"
    ) {
      return new Date(response * 1000).toLocaleString();
    } else if (method.name === "strategies") {
      return `activation: ${new Date(
        response.activation * 1000
      ).toLocaleString()}, currentDebt: ${utils.formatUnits(
        response.currentDebt,
        18
      )}, maxDebt: ${utils.formatUnits(
        response.maxDebt,
        18
      )}, lastReport: ${new Date(response.lastReport * 1000).toLocaleString()}`;
    } else if (STATE_MUTABILITY_TRANSACTIONS.includes(method.stateMutability)) {
      return <TransactionResponseDataList transactionResponseData={response} />;
    } else if (response instanceof eBigNumber) {
      return response.toString();
    } else if (typeof response === "string" || typeof response === "number") {
      return response;
    } else if (typeof response === "boolean") {
      return response.toString();
    }

    return null;
  }, [response, method]);

  return (
    <MethodListItemAccordion>
      <AccordionSummaryStyled
        expandIcon={<ExpandMoreIcon sx={{ width: "30px", height: "30px" }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <MethodTypeStyled
          className={
            STATE_MUTABILITY_TRANSACTIONS.includes(method.stateMutability)
              ? "mutate"
              : "view"
          }
        >
          {getMethodType}
        </MethodTypeStyled>{" "}
        <Typography>{method.name}</Typography>
      </AccordionSummaryStyled>
      <AccordionDetails sx={{ padding: "0 0 10px 0" }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleSubmitForm)}
          noValidate
          autoComplete="off"
          sx={{ ".MuiFormGroup-root": { marginBottom: "15px" } }}
        >
          {method.inputs.map((input) => (
            <Controller
              key={input.name}
              name={input.name as never}
              rules={{ required: true }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormGroup>
                  <AppFormLabel>{`${input.name} (${input.type})`}</AppFormLabel>
                  <AppTextField
                    error={!!error}
                    multiline
                    rows={1}
                    helperText={`Fill ${input.name}.`}
                    {...field}
                  />
                </FormGroup>
              )}
            />
          ))}
          {method.stateMutability === "payable" && (
            <Controller
              key="value"
              name={"value" as never}
              rules={{ required: true }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormGroup>
                  <AppFormLabel>XDC value</AppFormLabel>
                  <AppTextField
                    error={!!error}
                    multiline
                    rows={1}
                    helperText={`Fill XDC value.`}
                    {...field}
                  />
                </FormGroup>
              )}
            />
          )}
          <FlexBox sx={{ justifyContent: "flex-end" }}>
            <ApproveButton
              type="submit"
              sx={{ width: "200px", height: "40px" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: "#00332f" }} />
              ) : (
                "Execute"
              )}
            </ApproveButton>
          </FlexBox>
        </Box>
        <MethodResponseStyled>
          {response !== undefined && <>Response: {renderResponse()}</>}
        </MethodResponseStyled>
      </AccordionDetails>
    </MethodListItemAccordion>
  );
};

export default memo(MethodListItem);
