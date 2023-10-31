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

const CustomDatePicker = MUIStyled(DatePicker)({
  height: '60px',
  display: 'grid',
  placeItems: 'center',
  marginRight: '10px',
  '& .MuiInputLabel-root ': {
    marginTop: '10px',
  },
  '& .MuiOutlinedInput-input': {
    height: '0.2em',
  },
});

const CustomTimePicker = MUIStyled(TimePicker)({
  height: '60px',
  marginRight: '10px',
  display: 'grid',
  placeItems: 'center',
  '& .MuiInputLabel-root ': {
    marginTop: '10px',
  },
  '& .MuiOutlinedInput-input': {
    height: '0.2em',
  },
});

export default function SelectDate({ value, setValue, baseDate }) {
  const [shouldStartInterval, setShouldStartInterval] = useState(true);

  const handleChange = (newValue) => {
    console.log(newValue);
    setShouldStartInterval(false);
    setValue(newValue);
  };

  //baseDate가 없고 change가 안됐을 때에만 호출
  useEffect(() => {
    let intervalId;

    if (shouldStartInterval && baseDate === null) {
      intervalId = setInterval(() => {
        setValue(dayjs(moment()));
      }, 10000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [baseDate, setValue, shouldStartInterval]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomDatePicker label="날짜" value={dayjs(moment())} />
      <CustomTimePicker
        label="시간"
        value={value == null ? dayjs(moment()) : value}
        onChange={(newValue) => handleChange(newValue)}
      />
    </LocalizationProvider>
  );
}
