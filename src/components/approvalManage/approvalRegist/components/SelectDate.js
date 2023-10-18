import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
//import styled from '../../../../styles/components/approvalManage/approvalRegist/components/SelectDate.module.css';
import moment from 'moment';
import { styled as MUIStyled } from '@mui/material';

const CustomDatePicker = MUIStyled(
  DatePicker,
  TimePicker
)({
  marginTop: '10px',
  height: '60px',
  marginRight: '10px',
  '& .MuiOutlinedInput-input': {
    height: '0.3em',
  },
});

export default function SelectDate({ handleSelectTimeChange, baseDate }) {
  const [value, setValue] = useState(
    baseDate !== null ? dayjs(baseDate) : dayjs(moment())
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomDatePicker
        label="날짜"
        value={value}
        onChange={(newValue) => handleSelectTimeChange(newValue)}
      />
      <CustomDatePicker
        label="시간"
        value={value}
        onChange={(newValue) => handleSelectTimeChange(newValue)}
      />
    </LocalizationProvider>
  );
}
