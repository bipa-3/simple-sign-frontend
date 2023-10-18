import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';

export default function RowRadioButtonsGroup() {
  const { state, setState } = useApprovalBox();
  const labelStyle = {
    fontSize: '12.4px', // 폰트 크기
    color: '#6c757d', // 폰트 색상
  };

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      radioSortValue: event.target.value,
    }));
    console.log('Selected Value:', event.target.value); // 콘솔에서 선택된 값을 확인
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
      </RadioGroup>
    </FormControl>
  );
}
