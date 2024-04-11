import { AbiItem } from "./VaultItemManagement";
import { VaultItemAccordion } from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultStrategyItem";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  FormGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import {
  AppFormLabel,
  AppTextField,
} from "../../../AppComponents/AppForm/AppForm";
import { FlexBox } from "../../VaultListItem";
import { ApproveButton } from "../../../AppComponents/AppButton/AppButton";

const VaultManagementItem = ({ method }: { method: AbiItem }) => {
  const { formState, control, handleSubmit } = useForm({
    defaultValues: {},
    reValidateMode: "onChange",
    mode: "onChange",
  });

  useEffect(() => {
    console.log("Form state: ", formState);
  }, [formState]);

  const handleSubmitForm = useCallback(() => {
    console.log("Execute Tx: ", formState);
  }, [formState]);
  return (
    <VaultItemAccordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ width: "30px", height: "30px" }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ padding: "0" }}
      >
        <Typography>{method.name}</Typography>
      </AccordionSummary>
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
      </AccordionDetails>
    </VaultItemAccordion>
  );
};

export default VaultManagementItem;
