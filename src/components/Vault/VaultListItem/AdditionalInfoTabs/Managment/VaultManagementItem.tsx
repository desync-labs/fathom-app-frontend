import {
  AbiItem,
  STATE_MUTABILITY_TRANSACTIONS,
} from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/VaultItemManagement";
import { VaultItemAccordion } from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultStrategyItem";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  FormGroup,
  styled,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, useForm } from "react-hook-form";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { FlexBox } from "components/Vault/VaultListItem";
import { ApproveButton } from "components/AppComponents/AppButton/AppButton";
import useConnector from "context/connector";
import { Contract } from "fathom-ethers";

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

const MethodResponseStyled = styled(Box)``;

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

  console.log({
    response,
  });

  const handleSubmitForm = useCallback(async () => {
    const values = getValues();

    console.log({
      values,
    });

    /**
     * @todo: need to check arguments and put to this function.
     */
    if (methodType === MethodType.View) {
      const response = await (contract as Contract)[method.name]();
      setResponse(response);
    }
  }, [formState, contract, methodType, method, getValues]);

  const getMethodType = useMemo(() => {
    return methodType === MethodType.Mutate ? "Write" : "Read";
  }, [methodType]);

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
          <FlexBox sx={{ justifyContent: "flex-end" }}>
            <ApproveButton
              type="submit"
              sx={{ width: "200px", height: "40px" }}
            >
              Execute
            </ApproveButton>
          </FlexBox>
        </Box>
        {response && (
          <MethodResponseStyled>Response: {response}</MethodResponseStyled>
        )}
      </AccordionDetails>
    </VaultItemAccordion>
  );
};

export default memo(VaultManagementItem);
