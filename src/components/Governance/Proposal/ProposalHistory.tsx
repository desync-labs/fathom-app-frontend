import { FC, ReactNode, useEffect, useState } from "react";
import {
  Divider,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { BasePaper } from "components/Base/Paper/StyledPaper";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import useProposalContext from "context/proposal";
import { ProposalStatus } from "utils/Constants";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

const HistoryTitle = styled(Typography)`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`;

const HistoryStepTitle = styled(Typography)`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
`;

const HistoryStepDate = styled(Typography)`
  color: #8ea4cc;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
`;

const StepperStyled = styled(Stepper)`
  .expired {
    & .HistoryStepIcon {
      color: #f04242;
    }
  }
`;

const StepperConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#8AF075",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#3D5580",
    borderWidth: 2,
    borderRadius: 1,
  },
}));

const HistoryStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    "& .HistoryStepIcon-completedIcon": {
      color: "#8AF075",
      zIndex: 1,
      fontSize: 26,
    },
    "& .HistoryStepIcon-active": {
      color: "#3D5580",
      zIndex: 1,
      fontSize: 26,
    },
  })
);

function HistoryStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <HistoryStepIconRoot
      ownerState={{ active }}
      className={className}
      sx={{ paddingRight: "24px" }}
    >
      {completed ? (
        <CheckCircleOutlineRoundedIcon className="HistoryStepIcon HistoryStepIcon-completedIcon" />
      ) : (
        <CheckCircleOutlineRoundedIcon className="HistoryStepIcon HistoryStepIcon-active" />
      )}
    </HistoryStepIconRoot>
  );
}

type Step = {
  label: string;
  date: string | ReactNode;
};

const ProposalHistory: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [steps, setSteps] = useState<Step[]>([]);

  const {
    currentBlock,
    fetchedProposal,
    votingStartsTime,
    votingEndTime,
    status,
    isLoading,
  } = useProposalContext();

  useEffect(() => {
    const steps = [
      {
        label: "Created",
        date: isLoading ? (
          <CustomSkeleton animation={"wave"} height={20} width={"50%"} />
        ) : (
          new Date(
            Number(fetchedProposal.blockTimestamp) * 1000
          ).toLocaleString()
        ),
      },
    ];

    if (currentBlock > fetchedProposal.startBlock) {
      steps.push({
        label: "Active",
        date: isLoading ? (
          <CustomSkeleton animation={"wave"} height={20} width={"50%"} />
        ) : (
          (votingStartsTime as string)
        ),
      });
      setActiveStep(steps.length);
    } else {
      steps.push({
        label: "Active",
        date: isLoading ? (
          <CustomSkeleton animation={"wave"} height={20} width={"50%"} />
        ) : (
          (votingStartsTime as string)
        ),
      });
      setActiveStep(steps.length - 1);
    }

    if (
      currentBlock > fetchedProposal.endBlock &&
      [ProposalStatus.Defeated, ProposalStatus.Expired].includes(status)
    ) {
      steps.push({
        label: status,
        date: isLoading ? (
          <CustomSkeleton animation={"wave"} height={20} width={"50%"} />
        ) : (
          (votingEndTime as string)
        ),
      });
      setActiveStep(steps.length);
    } else {
      if (
        [ProposalStatus.Executed, ProposalStatus.Succeeded].includes(status)
      ) {
        steps.push({
          label: status,
          date: isLoading ? (
            <CustomSkeleton animation={"wave"} height={20} width={"50%"} />
          ) : (
            (votingEndTime as string)
          ),
        });
        setActiveStep(steps.length);
      } else {
        steps.push({
          label: ProposalStatus.Succeeded,
          date: isLoading ? (
            <CustomSkeleton animation={"wave"} height={20} width={"50%"} />
          ) : (
            ""
          ),
        });
        setActiveStep(steps.length - 1);
      }
    }

    setSteps(steps);
  }, [
    isLoading,
    status,
    votingStartsTime,
    votingEndTime,
    fetchedProposal,
    currentBlock,
    setSteps,
    setActiveStep,
  ]);

  return (
    <BasePaper sx={{ padding: "24px", marginTop: "10px" }}>
      <BaseFlexBox>
        <HistoryTitle>Proposal History</HistoryTitle>
      </BaseFlexBox>
      <Divider sx={{ borderColor: "#2C4066", marginY: "12px" }} />
      <StepperStyled
        activeStep={activeStep}
        orientation="vertical"
        connector={<StepperConnector />}
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            className={
              [ProposalStatus.Expired, ProposalStatus.Defeated].includes(
                step.label as ProposalStatus
              )
                ? "expired"
                : ""
            }
          >
            <StepLabel StepIconComponent={HistoryStepIcon}>
              <HistoryStepTitle>{step.label}</HistoryStepTitle>
              <HistoryStepDate>{step.date}</HistoryStepDate>
            </StepLabel>
          </Step>
        ))}
      </StepperStyled>
    </BasePaper>
  );
};

export default ProposalHistory;
