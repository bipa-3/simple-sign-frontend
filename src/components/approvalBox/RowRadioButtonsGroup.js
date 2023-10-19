import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';
import { useLocation } from 'react-router';

export default function RowRadioButtonsGroup() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const boxNamesString = queryParams.get('name');
  const boxName = boxNamesString ? boxNamesString.split(',')[0] : ''; // 배열로 나누지 않고 바로 문자열로 가져옵니다.

  const { state, setState } = useApprovalBox();
  const labelStyle = {
    fontSize: '12.4px',
    color: '#6c757d',
  };

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      radioSortValue: event.target.value,
    }));
  };

  const getRadioButtonsForBoxName = () => {
    if (boxName === '수신참조문서') {
      return (
        <>
          <FormControlLabel
            value="alldoc"
            control={<Radio size="small" style={{ color: '#6c757d' }} />}
            label={<span style={labelStyle}>모든문서</span>}
          />
          <FormControlLabel
            value="readdoc"
            control={<Radio size="small" style={{ color: '#6c757d' }} />}
            label={<span style={labelStyle}>열람문서</span>}
          />
          <FormControlLabel
            value="notreaddoc"
            control={<Radio size="small" style={{ color: '#6c757d' }} />}
            label={<span style={labelStyle}>미열람문서</span>}
          />
        </>
      );
    } else {
      return (
        <>
          <FormControlLabel
            value="alldoc"
            control={<Radio size="small" style={{ color: '#6c757d' }} />}
            label={<span style={labelStyle}>모든문서</span>}
          />
          <FormControlLabel
            value="ongoingdoc"
            control={<Radio size="small" style={{ color: '#6c757d' }} />}
            label={<span style={labelStyle}>진행문서</span>}
          />
          <FormControlLabel
            value="writtendoc"
            control={<Radio size="small" style={{ color: '#6c757d' }} />}
            label={<span style={labelStyle}>종결문서</span>}
          />
        </>
      );
    }
  };

  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={state.radioSortValue}
        onChange={handleChange}
      >
        {getRadioButtonsForBoxName()}
      </RadioGroup>
    </FormControl>
  );
}
