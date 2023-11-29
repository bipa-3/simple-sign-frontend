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
      childStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      children={
        <>
          <hr style={{ margin: 0 }}></hr>
          <TimeLineList />
        </>
      }
    />
  );
}
