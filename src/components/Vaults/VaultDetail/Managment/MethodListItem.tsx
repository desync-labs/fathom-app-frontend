import { Controller, useForm } from "react-hook-form";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { Contract, BigNumber as eBigNumber, utils } from "fathom-ethers";
import { FunctionFragment } from "@into-the-fathom/abi";
import { getEstimateGas } from "fathom-sdk";
import { ESTIMATE_GAS_MULTIPLIER } from "fathom-sdk/dist/cjs/utils/Constants";
import {
  Accordion,
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
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { ApproveButton } from "components/AppComponents/AppButton/AppButton";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import TransactionResponseDataList from "components/Vaults/VaultDetail/Managment/TransactionResponseDataList";
import { STATE_MUTABILITY_TRANSACTIONS } from "components/Vaults/VaultDetail/Managment/ManagementVaultMethodList";

enum MethodType {
  View = "view",
  Mutate = "mutate",
}

const MethodResponseStyled = styled(Box)`
  position: relative;
  width: calc(100% - 122px);
  word-wrap: break-word;
  padding-top: 4px;
`;

const MethodListItemAccordion = styled(Accordion)`
  background: #253656;
  border-radius: 8px !important;
  border: 1px solid #2c4066;
  box-shadow: none;
  margin-bottom: 8px;
  padding: 0;
  overflow: hidden;

  &.MuiAccordion-root {
    &:before {
      background: none;
    }
  }

  &.Mui-expanded {
    margin: 0 0 8px 0;
  }

  & .MuiCollapse-root {
    padding: 0 16px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    &.MuiPaper-root {
      &:before {
        background: none;
      }
    }
    padding: 20px;
    margin: 16px 0;

    &.mb-0 {
      margin-bottom: 0;
    }

    &.mt-3 {
      margin-top: 3px;
    }
  }
`;

const AccordionSummaryStyled = styled(AccordionSummary)`
  background: #091433;
  min-height: 46px;
  padding: 0 16px;

  .MuiAccordionSummary-content {
    gap: 7px;
    display: flex;
    align-items: center;
    margin: 0;
  }

  &.Mui-expanded {
    min-height: 46px;
    margin: 0;
  }
`;

const MethodInputFormGroup = styled(FormGroup)`
  margin-bottom: 14px;

  & .MuiFormLabel-root {
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    text-transform: capitalize;
    margin-bottom: 4px;
  }

  & .MuiInputBase-root {
    border: none;
  }
  & .MuiTextField-root textarea {
    background: transparent;
    border-radius: 8px;
    border: 1px solid #6d86b2;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    text-transform: capitalize;
    padding: 8px;
  }
`;

const MethodListItem: FC<{
  method: FunctionFragment;
  contractAddress: string;
  index: number;
}> = ({ method, contractAddress, index }) => {
  const { formState, control, handleSubmit, getValues } = useForm({
    defaultValues: {},
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { account, library } = useConnector();

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
    } finally {
      setIsLoading(false);
    }
  }, [formState, contract, methodType, method, getValues]);

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
        expandIcon={
          <ExpandMoreIcon
            sx={{ color: "#6D86B2", width: "24px", height: "24px" }}
          />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{`${index}. ${method.name}`}</Typography>
      </AccordionSummaryStyled>
      <AccordionDetails sx={{ padding: "10px 0" }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleSubmitForm)}
          noValidate
          autoComplete="off"
        >
          {method.inputs.map((input) => (
            <Controller
              key={input.name}
              name={input.name as never}
              rules={{ required: true }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MethodInputFormGroup>
                  <AppFormLabel>{`${input.name} (${input.type})`}</AppFormLabel>
                  <AppTextField error={!!error} multiline rows={1} {...field} />
                </MethodInputFormGroup>
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
                <MethodInputFormGroup>
                  <AppFormLabel>XDC value</AppFormLabel>
                  <AppTextField error={!!error} multiline rows={1} {...field} />
                </MethodInputFormGroup>
              )}
            />
          )}
          <AppFlexBox
            sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <MethodResponseStyled>
              {response !== undefined && <>{renderResponse()}</>}
            </MethodResponseStyled>
            <ApproveButton
              type="submit"
              sx={{
                fontSize: "12px",
                width: "80px",
                height: "28px",
                marginTop: 0,
              }}
            >
              {isLoading ? (
                <CircularProgress size={18} sx={{ color: "#00332f" }} />
              ) : (
                "Execute"
              )}
            </ApproveButton>
          </AppFlexBox>
        </Box>
      </AccordionDetails>
    </MethodListItemAccordion>
  );
};

export default memo(MethodListItem);
