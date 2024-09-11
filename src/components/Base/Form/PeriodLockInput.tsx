import { FC, memo, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { FieldError } from "react-hook-form";
import InfoIcon from "@mui/icons-material/Info";
import { Box, IconButton, Popover, styled, ToggleButton } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import "react-datepicker/dist/react-datepicker.css";
import {
  BaseFormInputErrorWrapper,
  BaseFormInputLabel,
  BaseFormInputWrapper,
  BaseFormLabelRow,
  RangeTextFields,
} from "components/Base/Form/StyledForm";
import { BaseSlider } from "components/Base/Form/Slider";
import { BaseToggleButtonGroup } from "components/Base/Buttons/StyledButtons";

const DateRangePickerWrapper = styled("div")``;

const DatePickerButton = styled(IconButton)`
  position: absolute;
  right: 12px;
  top: 8px;
`;

interface PeriodLockInputProps {
  range: number;
  minLockPeriod: number;
  handleChangeRange: (...event: any[]) => void;
  error?: FieldError | undefined;
}

const PeriodLockInput: FC<PeriodLockInputProps> = ({
  range,
  minLockPeriod,
  handleChangeRange,
  error,
}) => {
  const [startDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = useCallback(
    (event: any) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleChange = useCallback(
    (date: Date | null) => {
      date && setEndDate(date);
    },
    [setEndDate]
  );

  const handleChangeEndDate = useCallback(
    (number: number) => {
      const date = dayjs(startDate).add(number, "day").toDate();
      setEndDate(date);
    },
    [setEndDate, startDate]
  );

  useEffect(() => {
    if (startDate && endDate) {
      if (dayjs(startDate).isAfter(dayjs(endDate))) {
        const fullDays = dayjs(startDate).diff(dayjs(endDate), "day");
        handleChangeRange(fullDays);
      } else {
        const fullDays = dayjs(endDate).diff(dayjs(startDate), "day");
        handleChangeRange(fullDays);
      }
    }
  }, [startDate, endDate]);

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popover" : undefined;

  return (
    <DateRangePickerWrapper>
      <BaseFormLabelRow>
        <BaseFormInputLabel>Lock period</BaseFormInputLabel>
      </BaseFormLabelRow>
      <BaseFormInputWrapper sx={{ marginBottom: 0 }}>
        <RangeTextFields
          type="number"
          value={range}
          inputProps={{ min: minLockPeriod, max: 365, step: 1 }}
          onChange={handleChangeRange}
          placeholder="Number of Days"
          error={!!error}
          helperText={
            <>
              {error && error.type === "max" && (
                <BaseFormInputErrorWrapper>
                  <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                  <Box
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "6px" }}
                  >
                    The maximum staking period of 365 days has been exceeded
                  </Box>
                </BaseFormInputErrorWrapper>
              )}
              {error && error.type === "required" && (
                <BaseFormInputErrorWrapper>
                  <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                  <Box
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "6px" }}
                  >
                    Lock period is required
                  </Box>
                </BaseFormInputErrorWrapper>
              )}
              {error && error.type === "min" && (
                <BaseFormInputErrorWrapper>
                  <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                  <Box
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "6px" }}
                  >
                    Minimum lock period is {minLockPeriod} day.
                  </Box>
                </BaseFormInputErrorWrapper>
              )}
              {error && error.type === "pattern" && (
                <BaseFormInputErrorWrapper>
                  <InfoIcon sx={{ float: "left", fontSize: "14px" }} />
                  <Box
                    component={"span"}
                    sx={{ fontSize: "12px", paddingLeft: "6px" }}
                  >
                    {error.message}
                  </Box>
                </BaseFormInputErrorWrapper>
              )}
            </>
          }
        />
        <DatePickerButton onClick={handleOpen}>
          <CalendarTodayOutlinedIcon
            sx={{ color: "#43FFF1", width: "22px", height: "22px" }}
          />
        </DatePickerButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <DatePicker
            selected={endDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            selectsEnd
            inline
          />
        </Popover>
      </BaseFormInputWrapper>
      <BaseSlider
        value={range}
        min={minLockPeriod}
        max={365}
        step={1}
        onChange={handleChangeRange}
        aria-labelledby="input-slider"
      />
      <BaseFormInputWrapper sx={{ marginTop: "8px" }}>
        <BaseFormLabelRow mb="8px">
          <BaseFormInputLabel sx={{ color: "#fff" }}>
            Recommend period
          </BaseFormInputLabel>
        </BaseFormLabelRow>
        <BaseToggleButtonGroup
          value={range}
          exclusive
          onChange={(e, value) => handleChangeEndDate(value as number)}
          sx={{ marginBottom: "16px" }}
        >
          <ToggleButton selected={range <= 30} value={30}>
            1-Month
          </ToggleButton>
          <ToggleButton selected={range > 30 && range <= 60} value={60}>
            2-Month
          </ToggleButton>
          <ToggleButton selected={range > 60 && range <= 90} value={90}>
            3-Month
          </ToggleButton>
          <ToggleButton selected={range > 90 && range <= 180} value={180}>
            Half-Year
          </ToggleButton>
          <ToggleButton selected={range > 180} value={365}>
            1-Year
          </ToggleButton>
        </BaseToggleButtonGroup>
      </BaseFormInputWrapper>
    </DateRangePickerWrapper>
  );
};

export default memo(PeriodLockInput);
