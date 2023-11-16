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
        >
          <PersonIcon />
        </ToggleButton>
        <ToggleButton
          value="manger"
          onClick={() => {
            authorityManage('manager');
          }}
          className={styled.toggle}
        >
          <ManageAccountsIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </ThemeProvider>
  );
}
