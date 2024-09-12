import { FC, useMemo } from "react";
import { Controller, FormProvider } from "react-hook-form";
import {
  Box,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "components/AppComponents/AppButton/AppButton";

import useCreateProposal from "hooks/Governance/useCreateProposal";

import MuiInfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";

import { ErrorBox, ErrorMessage } from "components/AppComponents/AppBox/AppBox";

import { formatNumber } from "utils/format";
import { getTokenLogoURL } from "utils/tokenLogo";

import ProposeActionFields from "components/Governance/Propose/ProposeActionFields";
import ProposeNotices from "components/Governance/Propose/ProposeNotices";
import useSharedContext from "context/shared";
import WalletConnectBtn from "components/Common/WalletConnectBtn";
import BasePageContainer from "components/Base/PageContainer";
import { BasePaper } from "components/Base/Paper/StyledPaper";
import {
  BaseCheckbox,
  BaseFormInputLabel,
  BaseTextField,
} from "components/Base/Form/StyledForm";

import BigNumber from "bignumber.js";

import requiredSrc from "assets/svg/required.svg";
import PlusSm from "assets/svg/PlusSm.svg";
import BackSrc from "assets/svg/back.svg";
import { useNavigate } from "react-router-dom";
import ProposeEditor from "./Propose/ProposeEditor";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

export const ProposeLabel = styled(BaseFormInputLabel)`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  text-transform: none;
  display: flex;
  align-items: center;
  padding-bottom: 3px;
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
  border: 1px solid #43fff1;
  color: #43fff1;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
`;

const Required = () => (
  <Icon
    sx={{
      width: "12px",
      height: "12px",
      display: "flex",
      justifyContent: "right",
    }}
  >
    <img alt="staking-icon" src={requiredSrc} width={6} height={6} />
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

const AddMoreActionButton = styled(ButtonPrimary)`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  &:hover {
    border: none;
  }
`;

const Optional = () => <OptionalBox>(Optional)</OptionalBox>;

export const InfoIcon: FC<{ sx?: Record<string, any> }> = ({ sx }) => (
  <MuiInfoIcon
    sx={{ width: "11px", height: "11px", marginRight: "5px", ...sx }}
  />
);

const RequiredErrorMessage = styled("p")`
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.66;
  letter-spacing: 0.03333em;
  text-align: left;
  color: #dd3c3c;
  margin: 0;
`;

const ProposalTitle = styled(Typography)`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  margin-bottom: 20px;
`;

const ProposalPaper = styled(BasePaper)`
  border-radius: 12px;
  background: #1e2f4d;

  form {
    width: 100%;
  }
`;

const BackIcon = () => (
  <Icon sx={{ height: "14px", width: "16px", display: "flex" }}>
    <img alt="staking-icon" src={BackSrc} width={16} height={14} />
  </Icon>
);

const BackToProposalsButton = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
`;

const Propose: FC = () => {
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
  } = useCreateProposal();

  console.log({
    description: methods.watch("description")
      ? draftToHtml(
          convertToRaw(
            (
              methods.watch("description") as unknown as EditorState
            )?.getCurrentContent()
          )
        )
      : "",
  });

  const { isMobile } = useSharedContext();
  const navigate = useNavigate();

  return (
    <BasePageContainer sx={{ gap: "25px" }}>
      <BackToProposalsButton onClick={() => navigate("/dao/governance")}>
        <BackIcon />
        Back
      </BackToProposalsButton>

      <BasePaper>
        <ProposalTitle>Proposal Creation</ProposalTitle>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <ProposalPaper>
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

                <Grid item xs={12}>
                  <Grid container spacing={1.5}>
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
                            <BaseTextField
                              error={!!error}
                              id="outlined-textarea"
                              multiline
                              rows={1}
                              placeholder={"Enter the title of your proposal"}
                              value={value}
                              onChange={onChange}
                              helperText={
                                error ? "Field Title is required" : ""
                              }
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
                        render={() => (
                          <FormGroup>
                            <ProposeLabel>
                              Description <Required />
                            </ProposeLabel>
                            <ProposeEditor
                              control={control}
                              editorName={"description"}
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
                            <BaseTextField
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
                                  Forum discussion will be auto-created if this
                                  is left empty
                                </Stack>
                              }
                            />
                          </FormGroup>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormGroup>
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
                          {fields.map((field, index) => {
                            return (
                              <ProposeActionFields
                                index={index}
                                removeAction={removeAction}
                                key={field.id}
                              />
                            );
                          })}
                        </Grid>
                        <AddMoreActionButton onClick={appendAction}>
                          <img src={PlusSm} alt="plus" width={24} height={24} />
                          Add Action
                        </AddMoreActionButton>
                      </>
                    )}
                  </Grid>
                  <ProposeNotices
                    vBalance={vBalance}
                    vBalanceError={vBalanceError}
                    minimumVBalance={minimumVBalance as number}
                  />
                  <Grid item xs={12}>
                    <Controller
                      control={control}
                      name="isApproved"
                      rules={{ required: true }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormGroup sx={{ marginY: "8px" }}>
                          <Typography
                            fontSize="14px"
                            color="#fff"
                            fontWeight={600}
                          >
                            Confirm Transaction Details
                          </Typography>
                          <FormControlLabel
                            control={
                              <BaseCheckbox
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                                name="isApproved"
                              />
                            }
                            label="I have reviewed the contents of my proposal and am ready to submit."
                            sx={{
                              color: "#fff",
                              "& .MuiTypography-root": {
                                fontSize: "14px",
                              },
                            }}
                          />
                          {error && (
                            <RequiredErrorMessage>
                              This field is required
                            </RequiredErrorMessage>
                          )}
                        </FormGroup>
                      )}
                    />
                  </Grid>
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
              </GridContainer>
            </ProposalPaper>

            <Grid
              sx={{ marginTop: "20px" }}
              container
              spacing={1}
              flexDirection={isMobile ? "column-reverse" : "row"}
            >
              <Grid item xs={12} sm={3}>
                <ProposeButtonSecondary
                  type="button"
                  sx={{ width: "100%" }}
                  onClick={saveForLater}
                >
                  Save for later
                </ProposeButtonSecondary>
              </Grid>
              <Grid item xs={12} sm={3}>
                {account ? (
                  <ProposeButtonPrimary type="submit" sx={{ width: "100%" }}>
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
          </Box>
        </FormProvider>
      </BasePaper>
    </BasePageContainer>
  );
};

export default Propose;
