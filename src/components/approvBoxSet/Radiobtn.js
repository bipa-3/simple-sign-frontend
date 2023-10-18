import React from 'react';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

function Radiobtn({ labels, values = labels, selectedOption, onChange }) {
  const labelStyle = {
    fontSize: '13px', // 폰트 크기
    color: '#6c757d', // 폰트 색상
  };

  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectedOption}
        onChange={onChange}
      >
        {labels.map((label, index) => (
          <FormControlLabel
            key={index}
            value={values[index]}
            control={<Radio size="small" style={{ color: '#6c757d' }} />}
            label={<span style={labelStyle}>{label}</span>}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default Radiobtn;
