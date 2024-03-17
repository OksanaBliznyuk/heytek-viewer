//Calendar.js component
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function Calendar({ value, onDateTimeChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Velg dato"
        value={value}
        onChange={(date) => {
          onDateTimeChange && onDateTimeChange(date);
        }}
      />
    </LocalizationProvider>
  );
}

