import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItem from './MenuItem';
import BasicButton from './Button';
import AuthorityBtn from './AuthorityBtn';
import styled from '../../styles/components/sidebar/Sidebar.module.css';
import { useEffect } from 'react';
import getApprovalBoxList from '../../apis/approvalBoxAPI/getApprovalBoxList';
import { useApprovalBox } from '../../contexts/ApprovalBoxContext';
import getDocumentsCount from '../../apis/approvalBoxAPI/getDocumentCount';
import { getAuthrity } from '../../utils/getUser';

//추후 backend data변경예정
const userData = [
  {
    id: '1',
    name: '상신/보관함',
    submenu: [
      { id: 1, name: '상신문서' },
      { id: 2, name: '임시보관문서' },
    ],
  },
  {
    id: '2',
    name: '결재수신함',
    submenu: [
      { id: 1, name: '미결문서' },
      { id: 2, name: '기결문서' },
      { id: 3, name: '수신참조문서' },
    ],
  },
  {
    id: '3',
    name: '결재분류함',
    submenu: [],
  },
];

const managerData = [
  {
    id: '1',
    name: '결재함관리',
    submenu: [{ id: 1, name: '결재함설정' }],
  },
  {
    id: '2',
    name: '결재양식관리',
    submenu: [
      { id: 1, name: '기안양식관리' },
      { id: 2, name: '문서채번관리' },
    ],
  },
];

function Sidebar() {
  let [data, setData] = useState(userData);
  const [isSubMenuVisible, setSubMenuVisible] = useState([false, false, false]);
  const { customBoxViewItemState, setCustomBoxViewItemState, setCount, state } =
    useApprovalBox();

  //결재분류함(커스텀) 데이터 받아오기
  useEffect(() => {
    getApprovalBoxList()
      .then((response) => {
        const newSubmenu = response.boxList.map((item) => {
          return {
            id: item.approvalBoxId,
            name: item.approvalBoxName,
          };
        });

        const updatedUserData = [...userData];
        updatedUserData[2].submenu = newSubmenu;
        setData(updatedUserData);

        const newCustomBoxViewItems = response.boxList.map((item) => ({
          boxId: item.approvalBoxId,
          approvalBoxName: item.approvalBoxName,
          viewItems: response.viewItems
            .filter((viewItem) => viewItem.boxId === item.approvalBoxId)
            .map((viewItem) => viewItem.codeValue),
        }));

        setCustomBoxViewItemState(newCustomBoxViewItems);
      })
      .catch((error) =>
        console.error('Error fetching approval box list:', error)
      );
  }, []);

  useEffect(() => {
    // 결재분류함 데이터를 가져오는 로직 ...

    const fetchData = async () => {
      try {
        let response;

        response = await getDocumentsCount('상신문서');
        const sendCountValue = response.data;

        response = await getDocumentsCount('미결문서');
        const pendCountValue = response.data;

        response = await getDocumentsCount('기결문서');
        const concludedCountValue = response.data;

        response = await getDocumentsCount('수신참조문서');
        const referenceCountValue = response.data;

        setCount({
          sendCount: sendCountValue,
          pendCount: pendCountValue,
          concludedCount: concludedCountValue,
          referenceCount: referenceCountValue,
        });
      } catch (error) {
        console.error('Error fetching document counts:', error);
      }
    };

    fetchData();
  }, [state.isReadDoc]);

  const authorityManage = (value) => {
    if (value == 'user') {
      setData(userData);
    } else {
      setData(managerData);
    }
  };

  const toggleSubMenu = (id) => {
    const updateSubMenuVisible = isSubMenuVisible.map((state, i) =>
      i == id - 1 ? true : false
    );
    setSubMenuVisible(updateSubMenuVisible);
  };

  const navigate = useNavigate();
  const goApproval = function () {
    navigate('/FL');
  };

  return (
    <div className={styled.sidebar}>
      <BasicButton name="결재하기" goApproval={goApproval} />
      {data.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          isSubMenuVisible={isSubMenuVisible}
          boxName={item.name}
          toggleSubMenu={() => {
            toggleSubMenu(item.id);
          }}
        />
      ))}

      {getAuthrity() < 3 ? (
        <AuthorityBtn authorityManage={authorityManage} />
      ) : null}
    </div>
  );
}

export default Sidebar;
