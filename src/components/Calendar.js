//Calendar.js component
import React from 'react';
import "./Calendar.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Calendar({ value, onDateTimeChange }) {
  return (
    <DatePicker
      selected={value}
      onChange={(date) => {
        onDateTimeChange && onDateTimeChange(date);
      }}
      dateFormat="dd/MM/yyyy HH:mm"
      showTimeInput
    />
  );
}
