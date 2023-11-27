import List from '@mui/material/List';
import FolderIcon from '@mui/icons-material/Folder';
import ListItemText from '@mui/material/ListItemText';
import styled from '../../../styles/components/approvalManage/formList/FormListItem.module.css';
import React from 'react';

export default function FormListItem({ handleFormCategory }) {
  const category = [
    { id: '01', category_name: '공통' },
    { id: '02', category_name: '인사' },
    { id: '03', category_name: '교육' },
    { id: '04', category_name: '급여' },
  ];
  return (
    <List>
      <div
        className={styled.align}
        onClick={() => {
          handleFormCategory('00');
        }}
      >
        <FolderIcon
          className={styled.icon}
          sx={{ color: 'rgb(247, 184, 75)' }}
        />
        <ListItemText primary="전체양식" className={styled.font} />
      </div>
      {category.map((ele, idx) => {
        return (
          <div
            className={`${styled.align} ${styled.submenu}`}
            onClick={() => {
              handleFormCategory(ele.id);
            }}
          >
            <FolderIcon
              className={styled.icon}
              sx={{ color: 'rgb(247, 184, 75)' }}
            />
            <ListItemText primary={ele.category_name} className={styled.font} />
          </div>
        );
      })}
    </List>
  );
}
