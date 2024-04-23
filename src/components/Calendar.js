//Calendar.js component
import React from 'react';
import "./Calendar.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

export default function Calendar({ value, onDateTimeChange }) {
  const handleDateTimeChange = (date) => {
    // Konverter datoen til ønsket format før du sender den tilbake
    const formattedDate = format(date, "yyyy-MM-dd / HH:mm");
    onDateTimeChange && onDateTimeChange(formattedDate);
  };

  return (
    <DatePicker
      selected={value}
      onChange={(date) => {
        handleDateTimeChange(date);
      }}
      dateFormat="dd/MM/yyyy HH:mm"
      showTimeInput
    />
  );
}

