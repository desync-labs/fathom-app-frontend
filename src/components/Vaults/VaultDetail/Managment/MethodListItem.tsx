import { Controller, useForm } from "react-hook-form";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { Contract, BigNumber as eBigNumber, utils } from "fathom-ethers";
import { FunctionFragment } from "@into-the-fathom/abi";
import { getEstimateGas } from "fathom-sdk";
import { ESTIMATE_GAS_MULTIPLIER } from "fathom-sdk";
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
import useRpcError from "hooks/General/useRpcError";
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

const EMPTY_FIELD_NAME = "noname";

const MethodResponseStyled = styled(Box)`
  position: relative;
  width: calc(100% - 122px);
  font-size: 14px;
  font-weight: 500;
  word-wrap: break-word;
  padding-top: 4px;

  &.writeMethodRes {
    width: 100%;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
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

  & .MuiAccordionSummary-content.Mui-expanded {
    margin: unset;
  }

  & .MuiCollapse-root {
    padding: 0 16px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    & .MuiAccordionSummary-content {
      p {
        font-size: 12px;
      }
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

  ${({ theme }) => theme.breakpoints.down("sm")} {
    & .MuiFormLabel-root {
      font-size: 12px;
    }

    & .MuiTextField-root textarea {
      font-size: 12px;
      padding: 4px 8px;
    }
  }
`;

export const ReadeMethodIcon = ({ color = "#2C4066" }: { color?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 22H5C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2H15C16.6569 2 18 3.34315 18 5V8M20 22C18.8954 22 18 21.1046 18 20V8M20 22C21.1046 22 22 21.1046 22 20V10C22 8.89543 21.1046 8 20 8H18M6 7H14M6 12H14M6 17H10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const WriteMethodIcon = ({ color = "#2C4066" }: { color?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.75 5C1.75 3.20507 3.20507 1.75 5 1.75H11C11.4142 1.75 11.75 1.41421 11.75 1C11.75 0.585786 11.4142 0.25 11 0.25H5C2.37665 0.25 0.25 2.37665 0.25 5V17C0.25 19.6234 2.37665 21.75 5 21.75H17C19.6234 21.75 21.75 19.6234 21.75 17V11C21.75 10.5858 21.4142 10.25 21 10.25C20.5858 10.25 20.25 10.5858 20.25 11V17C20.25 18.7949 18.7949 20.25 17 20.25H5C3.20507 20.25 1.75 18.7949 1.75 17V5ZM15.419 1.67708C16.3218 0.774305 17.7855 0.774305 18.6883 1.67708L20.3229 3.31171C21.2257 4.21449 21.2257 5.67818 20.3229 6.58096L18.8736 8.03028C18.7598 7.97394 18.6401 7.91302 18.516 7.84767C17.6806 7.40786 16.6892 6.79057 15.9493 6.05069C15.2095 5.31082 14.5922 4.31945 14.1524 3.48403C14.087 3.35989 14.0261 3.24018 13.9697 3.12639L15.419 1.67708ZM14.8887 7.11135C15.7642 7.98687 16.8777 8.67594 17.7595 9.14441L12.06 14.8438C11.7064 15.1975 11.2475 15.4269 10.7523 15.4977L7.31963 15.9881C6.5568 16.097 5.90295 15.4432 6.01193 14.6804L6.50231 11.2477C6.57305 10.7525 6.80248 10.2936 7.15616 9.93996L12.8556 4.24053C13.3241 5.12234 14.0131 6.23582 14.8887 7.11135Z"
        fill={color}
      />
    </svg>
  );
};

const MethodListItem: FC<{
  method: FunctionFragment;
  contractAddress: string;
  index: number;
  readContract: Contract;
  writeContract: Contract;
}> = ({ method, contractAddress, index, readContract, writeContract }) => {
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
      contract = writeContract;
    } else {
      contract = readContract;
    }

    setContract(contract);
  }, [
    contractAddress,
    method,
    library,
    account,
    setMethodType,
    setContract,
    readContract,
    writeContract,
  ]);

  const handleSubmitForm = useCallback(async () => {
    const values: Record<string, any> = getValues();
    const options = { gasLimit: 0 };
    setIsLoading(true);

    const args: any[] = [];

    method.inputs.forEach((input, index) => {
      const inputName = input.name !== "" ? input.name : EMPTY_FIELD_NAME;
      if (input.type === "uint256") {
        args[index] = values[inputName];
      } else if (input.type === "address") {
        args[index] = values[inputName].toLowerCase();
      } else if (input.type === "address[]") {
        if (values[inputName] === "" || values[inputName] === undefined) {
          args[index] = [];
        } else {
          args[index] = values[inputName]
            .split(",")
            .map((addr: string) => addr.trim().toLowerCase());
        }
      } else {
        args[index] = values[inputName];
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
      setIsLoading(false);
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
        {methodType === MethodType.View && <ReadeMethodIcon />}
        {methodType === MethodType.Mutate && <WriteMethodIcon />}
        <Typography>{`${index + 1}. ${method.name}`}</Typography>
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
              name={
                input.name !== ""
                  ? (input.name as never)
                  : (EMPTY_FIELD_NAME as never)
              }
              rules={{ required: input.type !== "address[]" }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MethodInputFormGroup>
                  <AppFormLabel>{`${input.name} (${input.type}${
                    input.type === "uint256" ? " in wei" : ""
                  })`}</AppFormLabel>
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
            sx={{
              flexDirection:
                methodType === MethodType.Mutate ? "column-reverse" : "row",
              justifyContent:
                methodType === MethodType.Mutate
                  ? "flex-start"
                  : "space-between",
              alignItems:
                methodType === MethodType.Mutate ? "flex-end" : "flex-start",
            }}
          >
            <MethodResponseStyled
              className={
                methodType === MethodType.Mutate
                  ? "writeMethodRes"
                  : "viewMethodRes"
              }
            >
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
