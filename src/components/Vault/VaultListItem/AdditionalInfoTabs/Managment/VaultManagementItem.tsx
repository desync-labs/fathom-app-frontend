import { Controller, useForm } from "react-hook-form";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Contract, BigNumber as eBigNumber, utils } from "fathom-ethers";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  FormGroup,
  styled,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import useConnector from "context/connector";
import {
  AbiItem,
  STATE_MUTABILITY_TRANSACTIONS,
} from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/VaultItemManagement";
import { VaultItemAccordion } from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultStrategyItem";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { FlexBox } from "components/Vault/VaultListItem";
import { ApproveButton } from "components/AppComponents/AppButton/AppButton";
import { getEstimateGas } from "fathom-sdk";
import { ESTIMATE_GAS_MULTIPLIER } from "fathom-sdk/dist/cjs/utils/Constants";

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
  width: calc(100% - 200px);
  word-wrap: break-word;
`;

const VaultManagementItem: FC<{ method: AbiItem; vaultId: string }> = ({
  method,
  vaultId,
}) => {
  const { formState, control, handleSubmit, getValues } = useForm({
    defaultValues: {},
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { account, library } = useConnector();

  const [methodType, setMethodType] = useState<MethodType>(MethodType.View);
  const [contract, setContract] = useState<Contract>();
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    const methodType = STATE_MUTABILITY_TRANSACTIONS.includes(
      method.stateMutability
    )
      ? MethodType.Mutate
      : MethodType.View;

    setMethodType(methodType);

    let contract;

    if (methodType === MethodType.Mutate) {
      contract = new Contract(vaultId, [method], library.getSigner(account));
    } else {
      contract = new Contract(vaultId, [method], library);
    }

    setContract(contract);
  }, [method, library, account, setMethodType, setContract]);

  const handleSubmitForm = useCallback(async () => {
    const values = getValues();
    const options = { gasLimit: 0 };
    console.log(1, values, method);

    const args: any[] = [];

    method.inputs.forEach((input, index) => {
      if (input.type === "uint256") {
        // @ts-ignore
        args[index] = utils.parseUnits(values[input.name], 18);
      } else if (input.type === "bytes32") {
        // @ts-ignore
        args[index] = utils.id(values[input.name]);
      } else {
        // @ts-ignore
        args[index] = values[input.name];
      }
    });

    console.log(111, args);
    try {
      let response;
      if (methodType === MethodType.View) {
        response = await (contract as Contract)[method.name](...args);
      } else if (methodType === MethodType.Mutate) {
        console.log(222);

        const gasLimit = await getEstimateGas(
          contract as Contract,
          method.name,
          args,
          options
        );

        console.log(333, gasLimit);

        options.gasLimit = Math.ceil(gasLimit * ESTIMATE_GAS_MULTIPLIER);
        response = await (contract as Contract)[method.name](...args, options);
      }
      console.log("Res: ", response);
      setResponse(response);
    } catch (e: any) {
      console.error(e);
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
    <VaultItemAccordion>
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
      <AccordionDetails sx={{ padding: "0" }}>
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
          <FlexBox sx={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
            <MethodResponseStyled>
              {response !== undefined && <>Response: {renderResponse()}</>}
            </MethodResponseStyled>
            <ApproveButton
              type="submit"
              sx={{ width: "200px", height: "40px" }}
            >
              Execute
            </ApproveButton>
          </FlexBox>
        </Box>
      </AccordionDetails>
    </VaultItemAccordion>
  );
};

export default memo(VaultManagementItem);
