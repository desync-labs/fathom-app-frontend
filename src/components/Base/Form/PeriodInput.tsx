import { IconButton, Popover, styled, ToggleButton } from "@mui/material";
import {
  BaseFormInputLabel,
  BaseFormInputWrapper,
  BaseFormLabelRow,
  BaseFormTextField,
} from "./StyledForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FC, useEffect, useState } from "react";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import dayjs from "dayjs";
import { BaseSlider } from "./Slider";
import { BaseToggleButtonGroup } from "components/Base/Buttons/StyledButtons";

const DateRangePickerWrapper = styled("div")``;

const RangeTextFields = styled(BaseFormTextField)`
  input,
  textarea {
    height: 30px;
    font-size: 14px;
    font-weight: 400;
    padding: 8px 60px 8px 16px;
  }
`;

const DatePickerButton = styled(IconButton)`
  position: absolute;
  right: 12px;
  top: 8px;
`;

interface BaseDateRangePickerProps {
  range: number;
  handleChangeRange: (range: number) => void;
}

const BaseDateRangePicker: FC<BaseDateRangePickerProps> = ({
  range,
  handleChangeRange,
}) => {
  const startDate = new Date();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (date: Date | null) => {
    date && setEndDate(date);
  };

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
        <BaseFormInputLabel>Position duration</BaseFormInputLabel>
      </BaseFormLabelRow>
      <BaseFormInputWrapper sx={{ marginBottom: 0 }}>
        <RangeTextFields
          type="number"
          value={range}
          inputProps={{ min: 1, max: 180, step: 1 }}
          onChange={(e) => handleChangeRange(Number(e.target.value))}
          placeholder="Number of Days"
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
        min={1}
        max={180}
        step={1}
        onChange={(e, newValue: number | number[]) =>
          handleChangeRange(newValue as number)
        }
        aria-labelledby="input-slider"
      />
      <BaseFormInputWrapper>
        <BaseFormLabelRow mb="8px">
          <BaseFormInputLabel>Recommend period</BaseFormInputLabel>
        </BaseFormLabelRow>
        <BaseToggleButtonGroup
          value={range}
          exclusive
          onChange={(e, value) => handleChangeRange(value as number)}
          sx={{ marginBottom: "16px" }}
        >
          <ToggleButton value={30}>1-Month</ToggleButton>
          <ToggleButton value={60}>2-Month</ToggleButton>
          <ToggleButton value={90}>3-Month</ToggleButton>
          <ToggleButton value={180}>6-Month</ToggleButton>
        </BaseToggleButtonGroup>
      </BaseFormInputWrapper>
    </DateRangePickerWrapper>
  );
};

export default BaseDateRangePicker;
