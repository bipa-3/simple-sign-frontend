import React from 'react';
import InnerBox from '../common/InnerBox';
import FormShortCut from './components/FormShortCut';

export default function RecommendForm() {
  return (
    <InnerBox
      width={'100%'}
      height={'100%'}
      text={'추천양식'}
      font_size="16px"
      childStyle={{ height: '100%', padding: '10px' }}
      children={<FormShortCut />}
    />
  );
}
