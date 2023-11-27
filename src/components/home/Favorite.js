import React from 'react';
import InnerBox from '../common/InnerBox';
import FavoritesList from './components/FavoritesList';

export default function Favorite() {
  return (
    <InnerBox
      width={'100%'}
      height={'100%'}
      text={'즐겨찾기'}
      font_size="16px"
      children={<FavoritesList />}
      childStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'scroll',
        paddingBottom: '10px',
      }}
    />
  );
}
