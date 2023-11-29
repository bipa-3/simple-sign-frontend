import { useAlert } from '../contexts/AlertContext';
import React from 'react';

export default function ErrorHandle(res) {
  const { showAlert } = useAlert();

  return res.json().then((data) => {
    if (data.errors) {
      data.errors.map((ele) => {
        showAlert({
          severity: 'error',
          message: ele.message,
        });
      });
    } else {
      showAlert({
        severity: 'info',
        message: data.message,
      });
    }
  });
}
