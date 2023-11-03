// import '../../../styles/components/common/Title.module.css';
import React from 'react';

export default function Title({ text, font_size, marginLeft }) {
  return (
    <div
      style={{
        fontSize: `${font_size}`,
        fontWeight: 'bold',
        padding: '14px 5px',
        marginLeft: marginLeft,
      }}
    >
      {text}
    </div>
  );
}
