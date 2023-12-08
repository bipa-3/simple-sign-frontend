import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { keyframes } from '@emotion/react';

const slideIn = keyframes`
  from {
    right: -250px;
  }
  to {
    right: 20px;
  }
`;

const slideOut = keyframes`
  from {
    right: 20px;
  }
  to {
    right: -250px;
  }
`;

export default function AlarmAlert({ severity, message, open, close }) {
  const [shouldClose, setShouldClose] = useState(false);
  const animation = shouldClose ? slideOut : slideIn;
  useEffect(() => {
    if (open) {
      // 모달이 열릴 때 'shouldClose'를 false로 초기화
      setShouldClose(false);

      // 1.5초 후에 'shouldClose'를 true로 설정하여 슬라이드 아웃 애니메이션 시작
      const timer = setTimeout(() => {
        setShouldClose(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // 모달이 닫힐 때 'shouldClose'를 다시 false로 초기화
      setShouldClose(false);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropProps={{
        style: { backgroundColor: 'transparent' },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: '90%',
          right: ' -250px',
          transform: 'translateY(-50%)',
          width: 300,
          boxShadow: 3,
          animation: `${animation} 0.5s forwards`,
        }}
      >
        <Alert
          sx={{ bgcolor: 'grey.700' }}
          variant="filled"
          severity={severity}
        >
          <AlertTitle>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </AlertTitle>
          {message}
        </Alert>
      </Box>
    </Modal>
  );
}
