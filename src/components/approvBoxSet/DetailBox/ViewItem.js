import React, { useEffect, useState } from 'react';
import ViewItemPopup from '../ViewItemPopup';
import Optionbox from '../../common/Optionbox';
import styled from '../../../styles/pages/ApprovalBoxSetPage.module.css';
import getViewItems from '../../../apis/approvalBoxAPI/getViewItems';
import { useApprovalBox } from '../../../contexts/ApprovalBoxContext';
import { useApprovalBoxManage } from '../../../contexts/ApprovalBoxManageContext';

const BASE_RADIX = 10;

function ViewItem(props) {
  const [data, setData] = useState([]);
  const [viewItemsLocal, setViewItemsLocal] = useState([]);
  const [viewItemsLocal2, setViewItemsLocal2] = useState([]);
  const [error, setError] = useState(null);
  const { state, setState } = useApprovalBox();
  const { state: manageState, setState: setManageState } =
    useApprovalBoxManage();
  const { approvalBoxState, initDataState, setInitDataState } =
    useApprovalBoxManage();
  const [initDataItems, setInitDataItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedBoxId = parseInt(props.boxId, BASE_RADIX);
        if (!isNaN(parsedBoxId)) {
          const response = await getViewItems(parsedBoxId);

          let updatedViewItem = [];

          response.data.forEach((viewItem) => {
            if (viewItem.codeId.includes('01')) {
              updatedViewItem.push(viewItem.codeValue);
            } else if (viewItem.codeId.includes('02')) {
              updatedViewItem.push(viewItem.codeValue);
            } else if (viewItem.codeId.includes('03')) {
              updatedViewItem.push(viewItem.codeValue);
            } else if (viewItem.codeId.includes('04')) {
              updatedViewItem.push(viewItem.codeValue);
            } else if (viewItem.codeId.includes('05')) {
              updatedViewItem.push(viewItem.codeValue);
            } else if (viewItem.codeId.includes('06')) {
              updatedViewItem.push(viewItem.codeValue);
            }
          });

          setInitDataState((prevState) => ({
            ...prevState,
            name: updatedViewItem,
          }));

          setViewItemsLocal2((prevItems) => {
            return updatedViewItem;
          });
          setState((prevState) => ({
            ...prevState,
            boxViewItems: updatedViewItem,
          }));
        }
      } catch (err) {
        setError(err);
        console.error('Error fetching box details:', err);
      }
    };
    fetchData();
  }, [props.boxId]);

  useEffect(() => {
    setInitDataItems(approvalBoxState.viewItems || []);
  }, [approvalBoxState.viewItems]);

  useEffect(() => {
    if (approvalBoxState && approvalBoxState.viewItems) {
      setViewItemsLocal(approvalBoxState.viewItems); // approvalBoxState.viewItems 값이 변경될 때마다 로컬 상태 업데이트
    }
  }, [approvalBoxState.viewItems, approvalBoxState]); // approvalBoxState.viewItems 값의 변경을 감지

  function onSave(selectedItems) {
    setViewItemsLocal2(selectedItems);
  }

  let itemsToRender;

  if (manageState.insertStatus != 1) {
    itemsToRender = viewItemsLocal2;
  } else if (viewItemsLocal && viewItemsLocal.length > 0) {
    itemsToRender = viewItemsLocal;
  } else {
    itemsToRender = initDataState.name
      ? initDataState.name.map((item) => item.codeValue)
      : [];
  }

  function handleDataChange(name) {
    if (manageState.insertStatus != 1) {
      setViewItemsLocal2((prevState) => {
        return prevState.filter((item) => item !== name);
      });
    } else {
      setViewItemsLocal((prevState) => {
        return prevState.filter((item) => item !== name);
      });
    }
  }

  return (
    <div className={styled.inputItem}>
      <div style={props.commonCellStyle}>
        <div className={styled.text}>조회항목</div>
      </div>
      <div style={props.commonDataStyle}>
        <div className={styled.viewUseField}>
          <div className={styled.viewItemBox}>
            {itemsToRender.map((viewItemValue, index) => (
              <Optionbox
                id={viewItemValue}
                key={index}
                initData={
                  initDataItems[index]
                    ? initDataItems[index]
                    : initDataState.name
                    ? initDataState.name[index]
                    : null
                }
                name={viewItemValue}
                dataHandler={handleDataChange}
              />
            ))}
          </div>

          <ViewItemPopup
            checkedItems={data}
            currentViewItems={itemsToRender}
            onSave={onSave}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewItem;
