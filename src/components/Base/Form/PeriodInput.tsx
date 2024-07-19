import { IconButton, Popover, Slider, styled } from "@mui/material";
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
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    start && setStartDate(start);
    end && setEndDate(end);
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
    } else {
      handleChangeRange(0);
    }
  }, [startDate, endDate]);

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popover" : undefined;
  return (
    <DateRangePickerWrapper>
      <BaseFormLabelRow>
        <BaseFormInputLabel>Position duration</BaseFormInputLabel>
      </BaseFormLabelRow>
      <BaseFormInputWrapper>
        <RangeTextFields
          type="number"
          value={range.toString()}
          onChange={(e) => handleChangeRange(Number(e.target.value))}
          placeholder="Number of Days"
        />
        <DatePickerButton>
          <CalendarTodayOutlinedIcon
            sx={{ color: "#43FFF1", width: "22px", height: "22px" }}
            onClick={handleOpen}
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
            selected={startDate}
            onChange={handleChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
          />
        </Popover>
      </BaseFormInputWrapper>
      <Slider
        value={range}
        onChange={(e, newValue: number | number[]) =>
          handleChangeRange(newValue as number)
        }
        aria-labelledby="input-slider"
      />
    </DateRangePickerWrapper>
  );
};

export default BaseDateRangePicker;
