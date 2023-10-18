import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styled from '../../styles/components/sidebar/MenuItem.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';
import { usePage } from '../../contexts/PageContext';
import { useLocation } from 'react-router-dom';
import ViewCount from '../approvalBox/viewDocuments/ViewCount';

function MenuItem({ item, isSubMenuVisible, toggleSubMenu }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state: pageState, setState: setPageState } = usePage();

  const { customBoxViewItemState, setCustomBoxViewItemState } =
    useApprovalBox();
  const { state, setState } = useApprovalBox();
  const navigate = useNavigate();
  const [clickStates, setClickStates] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const viewItemMapping = {
    상신내역: 'send',
    미결내역: 'pend',
    '기결내역-종결': 'end',
    '기결내역-진행': 'progress',
    수신참조내역: 'reference',
    반려내역: 'reject',
  };

  useEffect(() => {
    if (!isSubMenuVisible[item.id - 1]) {
      // isSubMenuVisible이 false일 때, 모든 clickStates를 false로 초기화
      setClickStates(Array(clickStates.length).fill(false));
    }
  }, [isSubMenuVisible]);

  const clickMenu = (index, name) => {
    setPageState((prevState) => ({
      ...prevState,
      curPage: name,
    }));

    setState((prevState) => ({
      ...prevState,
      view: false,
      radioSortValue: 'alldoc',
    }));

    const customBoxNames = customBoxViewItemState.map(
      (box) => box.approvalBoxName
    );
    const updateClickStates = clickStates.map((state, i) =>
      i === index ? true : false
    );
    if (name === '기안양식관리') {
      navigate(`/EAM?name=${name}`);
    } else if (name === '문서채번관리') {
      navigate(`/SAM?name=${name}`);
    } else if (name === '결재함설정') {
      navigate(`/ABS?name=${name}`);
    } else if (name === '상신문서') {
      navigate(`/ABV?viewItems=send&name=${name}`);
    } else if (name === '임시보관문서') {
      navigate(`/ABV?viewItems=tempor&name=${name}`);
    } else if (name === '미결문서') {
      navigate(`/ABV?viewItems=pend&name=${name}`);
    } else if (name === '기결문서') {
      navigate(`/ABV?viewItems=concluded&name=${name}`);
    } else if (name === '수신참조문서') {
      navigate(`/ABV?viewItems=reference&name=${name}`);
    }
    if (customBoxNames.includes(name)) {
      const matchedBox = customBoxViewItemState.find(
        (box) => box.approvalBoxName === name
      );
      const matchedViewItems = matchedBox ? matchedBox.viewItems : [];

      const transformedViewItems = matchedViewItems.map(
        (item) => viewItemMapping[item] || item
      );

      //viewItems 배열을 콤마로 구분된 문자열로 전환
      const viewItemsString = transformedViewItems.join(',');
      navigate(`/ABV?viewItems=${viewItemsString}&name=${name}`);
    }
  };

  useEffect(() => {
    switch (currentPath) {
      case '/ABV':
        setPageState((prevState) => ({
          ...prevState,
          isApprovalBox: true,
        }));
        break;
      default:
        setPageState((prevState) => ({
          ...prevState,
          isApprovalBox: false,
        }));
    }
  }, [currentPath]);

  return (
    <List className={styled.list}>
      <ListItemButton
        className={`${styled.mainmenu} ${
          isSubMenuVisible[item.id - 1] ? styled.color : ''
        }`}
        onClick={() => {
          toggleSubMenu(item.id);
        }}
      >
        <ListItemText primary={item.name} className={styled.menutext} />
        {isSubMenuVisible[item.id - 1] ? (
          <KeyboardArrowDownIcon htmlColor="#3bafda;" />
        ) : (
          <KeyboardArrowRightIcon htmlColor="#6e768e" />
        )}
      </ListItemButton>
      {item.submenu && isSubMenuVisible[item.id - 1] && (
        <div className={styled.submenu}>
          {item.submenu.map((subitem, index) => (
            <ListItemButton
              key={subitem.id}
              className={`${styled.subitem} ${
                clickStates[index] ? styled.color : ''
              }`}
              onClick={() => {
                clickMenu(index, subitem.name);
                setState((prevState) => ({ ...prevState, searchInput: '' }));
              }}
            >
              <div className={styled.subItemContainer}>
                <ListItemText
                  primary={subitem.name}
                  className={styled.sub_menutext}
                ></ListItemText>
                <ViewCount count="5"></ViewCount>
              </div>
            </ListItemButton>
          ))}
        </div>
      )}
    </List>
  );
}

export default MenuItem;
