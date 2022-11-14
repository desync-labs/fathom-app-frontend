import React, { FC } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  DialogContent,
  Grid,
  Stack,
  Icon,
  FormGroup,
  Checkbox,
  FormControl,
} from "@mui/material";
import { observer } from "mobx-react";
import { Controller } from "react-hook-form";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { getTokenLogoURL } from "utils/tokenLogo";
import { styled } from "@mui/material/styles";
import useCreateProposal from "hooks/useCreateProposal";

import requiredSrc from "assets/svg/required.svg";
import MuiInfoIcon from "@mui/icons-material/Info";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "components/AppComponents/AppButton/AppButton";

export type ProposeListViewProps = {
  onClose: () => void;
};

const ProposeLabel = styled(
  AppFormLabel,
  {}
)(({ theme }) => ({
  float: "none",
  width: "100%",
  fontSize: "11px",
  lineHeight: "18px",
  color: "#7D91B5",
  height: "26px",
  display: "inline-flex",
  alignItems: "end",
  padding: 0,
}));

const CurrencyBox = styled(Box)(({ theme }) => ({
  fontSize: "14px",
  lineHeight: "20px",
}));

const BalanceBox = styled(Box)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "20px",
  lineHeight: "24px",
}));

const WarningBox = styled(Box)(({ theme }) => ({
  background: "#452508",
  border: "1px solid #5C310A",
  borderRadius: "8px",
  padding: "8px 16px",
  gap: "8px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  color: "#F7B06E",
  fontSize: "14px",
}));

const ProposeButtonPrimary = styled(ButtonPrimary)(({ theme }) => ({
  height: "48px",
  fontSize: "17px",
}));

const ProposeButtonSecondary = styled(ButtonSecondary)(({ theme }) => ({
  height: "48px",
  fontSize: "17px",
  color: "#fff",
  border: "1px solid #324567",
}));

const MINIMUM_V_BALANCE = 2000;

const Required = () => (
  <Icon sx={{ width: "20px", height: "26px" }}>
    <img alt="staking-icon" src={requiredSrc} />
  </Icon>
);

const Optional = () => (
  <Box
    component="span"
    sx={{
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "16px",
      textTransform: "none",
      color: "#9FADC6",
    }}
  >
    (Optional)
  </Box>
);

const InfoIcon: FC<{ sx?: Record<string, any> }> = ({ sx }) => (
  <MuiInfoIcon
    sx={{ width: "11px", height: "11px", marginRight: "5px", ...sx }}
  />
);

const ProposeListView: FC<ProposeListViewProps> = observer(({ onClose }) => {
  const {
    withAction,
    handleSubmit,
    control,
    onSubmit,
    vBalance,
    saveForLater,
    validateAddressesArray,
    formatNumber,
  } = useCreateProposal(onClose);

  return (
    <AppDialog
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="md"
      color="primary"
      sx={{ "& .MuiPaper-root": { width: "700px" } }}
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        New Proposal
      </AppDialogTitle>
      <DialogContent sx={{ marginTop: "20px" }}>
        <Grid container padding={"0 8px"} gap={2}>
          <Grid item xs={12}>
            <ProposeLabel>Wallet balance</ProposeLabel>
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="end"
              spacing={1}
            >
              <img src={getTokenLogoURL("FTHM")} alt="vFTHM-Token" width={28} />
              <BalanceBox component="span">
                {formatNumber(vBalance / 10 ** 18)}
              </BalanceBox>
              <CurrencyBox component="span">vFHTM</CurrencyBox>
            </Stack>
          </Grid>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <Grid item xs={12}>
              <Controller
                control={control}
                name="descriptionTitle"
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormGroup>
                    <ProposeLabel>
                      Title <Required />
                    </ProposeLabel>
                    <AppTextField
                      error={!!error}
                      id="outlined-textarea"
                      multiline
                      rows={1}
                      placeholder={"Ex: More stream staking rewards"}
                      value={value}
                      onChange={onChange}
                      helperText={error ? "Field Title is required" : ""}
                    />
                  </FormGroup>
                )}
              />
              <Controller
                control={control}
                name="description"
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormGroup>
                    <ProposeLabel>
                      Description <Required />
                    </ProposeLabel>
                    <AppTextField
                      error={!!error}
                      id="outlined-textarea"
                      multiline
                      rows={2}
                      placeholder={
                        "Ex: Describe how you propose new way in details..."
                      }
                      value={value}
                      onChange={onChange}
                      helperText={error ? "Field Description is required" : ""}
                    />
                  </FormGroup>
                )}
              />

              <Controller
                control={control}
                name="link"
                rules={{ required: false }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormGroup>
                    <ProposeLabel>
                      Discussion / Detail / Forum link <Optional />
                    </ProposeLabel>
                    <AppTextField
                      error={!!error}
                      id="outlined-textarea"
                      multiline
                      rows={1}
                      placeholder={"Ex: Discord / Twitter / Medium ..."}
                      value={value}
                      onChange={onChange}
                      helperText={
                        <Stack direction={"row"} alignItems={"center"}>
                          <InfoIcon />
                          Forum discussion will be auto-created if this is left
                          empty
                        </Stack>
                      }
                    />
                  </FormGroup>
                )}
              />

              <FormGroup sx={{ margin: "10px 0 18px 0" }}>
                <Controller
                  control={control}
                  name="withAction"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControlLabel
                      control={<Switch onChange={onChange} checked={!!value} />}
                      label="Actionable Proposal"
                    />
                  )}
                />
              </FormGroup>

              {withAction ? (
                <>
                  <Controller
                    control={control}
                    name="targets"
                    rules={{
                      required: true,
                      validate: validateAddressesArray,
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormGroup>
                        <ProposeLabel>Target addresses</ProposeLabel>
                        <AppTextField
                          error={!!error}
                          placeholder={"Ex: ..."}
                          id="outlined-multiline-flexible"
                          multiline
                          value={value}
                          maxRows={1}
                          helperText={
                            error && error.type === "required" ? (
                              "Field Target addresses is required"
                            ) : error && error.type === "validate" ? (
                              error.message
                            ) : (
                              <Stack direction={"row"} alignItems={"center"}>
                                <InfoIcon />
                                Once this proposal is accepted, it will
                                automatically call for this smart contract to
                                execute.
                              </Stack>
                            )
                          }
                          onChange={onChange}
                        />
                      </FormGroup>
                    )}
                  />

                  <Controller
                    control={control}
                    name="callData"
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormGroup>
                        <ProposeLabel>Calldata</ProposeLabel>
                        <AppTextField
                          placeholder={"Ex: ..."}
                          error={!!error}
                          id="outlined-multiline-static"
                          multiline
                          value={value}
                          maxRows={1}
                          helperText={error ? "Field Calldata is required" : ""}
                          onChange={onChange}
                        />
                      </FormGroup>
                    )}
                  />

                  <Controller
                    control={control}
                    name="inputValues"
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormGroup sx={{ marginBottom: "15px" }}>
                        <ProposeLabel>Values</ProposeLabel>
                        <AppTextField
                          error={!!error}
                          placeholder={"Ex: ..."}
                          id="outlined-textarea2"
                          multiline
                          value={value}
                          maxRows={1}
                          helperText={error ? "Field Values is required" : ""}
                          onChange={onChange}
                        />
                      </FormGroup>
                    )}
                  />
                </>
              ) : (
                ""
              )}
              {vBalance / 10 ** 18 < MINIMUM_V_BALANCE && (
                <WarningBox>
                  <InfoIcon
                    sx={{ width: "16px", color: "#F5953D", height: "16px" }}
                  />
                  A balance of at least {MINIMUM_V_BALANCE} vFTHM is required to
                  create a proposal.
                </WarningBox>
              )}

              <FormGroup sx={{ margin: "10px 0 18px 0" }}>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="agreement"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <FormControl
                      error={!!error}
                      sx={{ ".Mui-error": { color: "#f44336" } }}
                    >
                      <FormControlLabel
                        sx={{
                          marginTop: "10px",
                          ".MuiTypography-root": {
                            fontSize: "14px",
                            lineHeight: "20px",
                          },
                        }}
                        control={
                          <Checkbox onChange={onChange} checked={!!value} />
                        }
                        label={`I understand that by submitting this proposal, I will deposit ${formatNumber(
                          MINIMUM_V_BALANCE
                        )} vFTHM to complete this proposal creation.`}
                      />
                    </FormControl>
                  )}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <ProposeButtonSecondary type="button" sx={{ width: "100%" }} onClick={saveForLater}>
                    Save for later
                  </ProposeButtonSecondary>
                </Grid>
                <Grid item xs={8}>
                  <ProposeButtonPrimary type="submit" sx={{ width: "100%" }}>
                    Submit proposal
                  </ProposeButtonPrimary>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </DialogContent>
    </AppDialog>
  );
});

export default ProposeListView;
