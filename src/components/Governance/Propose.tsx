import { FC, useMemo } from "react";
import { Controller, FormProvider } from "react-hook-form";
import {
  Box,
  CircularProgress,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  Stack,
  Switch,
} from "@mui/material";

import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "components/AppComponents/AppButton/AppButton";
import { getTokenLogoURL } from "utils/tokenLogo";
import useCreateProposal from "hooks/Governance/useCreateProposal";

import MuiInfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";

import requiredSrc from "assets/svg/required.svg";
import { ErrorBox, ErrorMessage } from "components/AppComponents/AppBox/AppBox";

import { formatNumber } from "utils/format";
import ProposeActionFields from "components/Governance/Propose/ProposeActionFields";
import ProposeNotices from "components/Governance/Propose/ProposeNotices";
import BigNumber from "bignumber.js";
import useSharedContext from "context/shared";
import WalletConnectBtn from "components/Common/WalletConnectBtn";

export const ProposeLabel = styled(AppFormLabel)`
  float: none;
  width: 100%;
  font-size: 11px;
  line-height: 18px;
  color: #7d91b5;
  height: 26px;
  display: inline-flex;
  align-items: end;
  padding: 0;
`;

const CurrencyBox = styled(Box)`
  font-size: 14px;
  line-height: 20px;
`;

const BalanceBox = styled(Box)`
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
`;

const ProposeButtonPrimary = styled(ButtonPrimary)`
  height: 48px;
  font-size: 17px;
`;

const ProposeButtonSecondary = styled(ButtonSecondary)`
  height: 48px;
  font-size: 17px;
  color: #fff;
  border: 1px solid #324567;
`;

const Required = () => (
  <Icon sx={{ width: "20px", height: "26px" }}>
    <img alt="staking-icon" src={requiredSrc} />
  </Icon>
);

const OptionalBox = styled(Box)`
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  text-transform: none;
  color: #9fadc6;
  margin-left: 5px;
`;

const GridContainer = styled(Grid)`
  padding: 0 8px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
  }
`;

const AddMoreActionButtonGrid = styled(Grid)`
  display: flex;
  justify-content: right;
  margin-top: 10px;
`;

const AddMoreActionButton = styled(ButtonPrimary)``;

const Optional = () => <OptionalBox>(Optional)</OptionalBox>;

export const InfoIcon: FC<{ sx?: Record<string, any> }> = ({ sx }) => (
  <MuiInfoIcon
    sx={{ width: "11px", height: "11px", marginRight: "5px", ...sx }}
  />
);

export type ProposeProps = {
  onClose: () => void;
};

const Propose: FC<ProposeProps> = ({ onClose }) => {
  const {
    minimumVBalance,
    isLoading,
    withAction,
    handleSubmit,
    control,
    onSubmit,
    account,
    vBalance,
    vBalanceError,
    saveForLater,
    notAllowTimestamp,
    fields,
    methods,
    appendAction,
    removeAction,
  } = useCreateProposal(onClose);
  const { isMobile } = useSharedContext();

  return (
    <FormProvider {...methods}>
      <AppDialog
        aria-labelledby="customized-dialog-title"
        open={true}
        fullWidth
        maxWidth="md"
        color="primary"
        sx={{ "> .MuiDialog-container > .MuiPaper-root": { width: "700px" } }}
      >
        <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
          New Proposal
        </AppDialogTitle>
        <DialogContent sx={{ marginTop: "20px" }}>
          <GridContainer container gap={2}>
            <Grid item xs={12}>
              <ProposeLabel>Wallet balance</ProposeLabel>
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={1}
              >
                <img
                  src={getTokenLogoURL("FTHM")}
                  alt="vFTHM-Token"
                  width={20}
                />
                {vBalance && (
                  <BalanceBox component="span">
                    {formatNumber(
                      BigNumber(vBalance as string)
                        .dividedBy(10 ** 18)
                        .toNumber()
                    )}
                  </BalanceBox>
                )}
                {!account && <BalanceBox component="span">0</BalanceBox>}
                <CurrencyBox component="span">vFTHM</CurrencyBox>
              </Stack>
            </Grid>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              autoComplete="off"
            >
              <Grid item xs={12}>
                <Grid container spacing={1}>
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
                  </Grid>
                  <Grid item xs={12}>
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
                            rows={3}
                            placeholder={
                              "Ex: Describe how you propose new way in details..."
                            }
                            value={value}
                            onChange={onChange}
                            helperText={
                              error && "Field Description is required"
                            }
                          />
                        </FormGroup>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                              <Stack
                                direction={"row"}
                                alignItems={"center"}
                                component={"span"}
                              >
                                <InfoIcon />
                                Forum discussion will be auto-created if this is
                                left empty
                              </Stack>
                            }
                          />
                        </FormGroup>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup sx={{ margin: "10px 0 0" }}>
                      <Controller
                        control={control}
                        name="withAction"
                        render={({ field: { onChange, value } }) => (
                          <FormControlLabel
                            control={
                              <Switch onChange={onChange} checked={!!value} />
                            }
                            label="Actionable Proposal"
                          />
                        )}
                      />
                    </FormGroup>
                  </Grid>
                  {withAction && (
                    <>
                      <Grid item xs={12}>
                        <Box sx={{ marginTop: "10px" }}>
                          {fields.map((field, index) => {
                            return (
                              <ProposeActionFields
                                index={index}
                                removeAction={removeAction}
                                key={field.id}
                              />
                            );
                          })}
                        </Box>
                      </Grid>
                      <AddMoreActionButtonGrid item xs={12}>
                        <AddMoreActionButton onClick={appendAction}>
                          Add More Action
                        </AddMoreActionButton>
                      </AddMoreActionButtonGrid>
                    </>
                  )}
                </Grid>
                <ProposeNotices
                  vBalance={vBalance}
                  vBalanceError={vBalanceError}
                  minimumVBalance={minimumVBalance as number}
                />
                {useMemo(
                  () =>
                    BigNumber(notAllowTimestamp).isGreaterThan(0) ? (
                      <ErrorBox sx={{ my: 3 }}>
                        <InfoIcon />
                        <ErrorMessage>
                          You can't create new proposal until{" "}
                          {new Date(
                            BigNumber(notAllowTimestamp)
                              .multipliedBy(1000)
                              .toNumber()
                          ).toLocaleString()}
                        </ErrorMessage>
                      </ErrorBox>
                    ) : null,
                  [notAllowTimestamp]
                )}
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={1}
                  flexDirection={isMobile ? "column-reverse" : "row"}
                >
                  <Grid item xs={12} sm={4}>
                    <ProposeButtonSecondary
                      type="button"
                      sx={{ width: "100%" }}
                      onClick={saveForLater}
                    >
                      Save for later
                    </ProposeButtonSecondary>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    {account ? (
                      <ProposeButtonPrimary
                        type="submit"
                        sx={{ width: "100%" }}
                      >
                        {isLoading ? (
                          <CircularProgress size={30} />
                        ) : (
                          "Submit proposal"
                        )}
                      </ProposeButtonPrimary>
                    ) : (
                      <WalletConnectBtn fullwidth sx={{ height: "48px" }} />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </GridContainer>
        </DialogContent>
      </AppDialog>
    </FormProvider>
  );
};

export default Propose;
