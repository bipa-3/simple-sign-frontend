import * as React from 'react';
import styled from '../../styles/components/sidebar/AuthorityBtn.module.css';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f4f39',
    },
  },
});

export default function AuthorityBtn({ authorityManage }) {
  const [alignment, setAlignment] = React.useState('user');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        className={styled.toggleGroup}
      >
        <ToggleButton
          value="user"
          onClick={() => {
            authorityManage('user');
          }}
          className={styled.toggle}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#acb8ba', // 선택 상태의 배경색
              '&:hover': {
                backgroundColor: '#acb8ba', // 선택 상태에서의 호버 색상
              },
            },
            '&:hover': {
              backgroundColor: '#D3E1E3', // 일반 호버 상태의 색상
            },
          }}
        >
          <PersonIcon />
        </ToggleButton>
        <ToggleButton
          value="manger"
          onClick={() => {
            authorityManage('manager');
          }}
          className={styled.toggle}
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#acb8ba', // 선택 상태의 배경색
              '&:hover': {
                backgroundColor: '#acb8ba', // 선택 상태에서의 호버 색상
              },
            },
            '&:hover': {
              backgroundColor: '#D3E1E3', // 일반 호버 상태의 색상
            },
          }}
        >
          <ManageAccountsIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </ThemeProvider>
  );
}
