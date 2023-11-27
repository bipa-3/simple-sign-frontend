import React from 'react';
import InnerBox from '../common/InnerBox';
import TimeLineList from './components/TimeLineList';

export default function TimeLine() {
  return (
    <InnerBox
      width={'100%'}
      height={'100%'}
      text={'타임라인'}
      font_size="16px"
      childStyle={{ height: '100%', padding: '10px' }}
      children={
        <>
          <hr style={{ marginBottom: '10px', marginTop: '-10px' }} />
          <TimeLineList />
        </>
      }
    />
  );
}
