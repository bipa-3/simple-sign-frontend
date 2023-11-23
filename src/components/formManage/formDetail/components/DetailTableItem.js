import styled from '../../../../styles/components/formManage/formDetail/components/DetailTableItems.module.css';
import DragDrop from './DragDrop';
import React, { useState, useEffect } from 'react';
import PopUp from '../../../common/PopUp';
import FormEdit from '../../formEditPopUp/FormEdit';
import { FiEdit } from 'react-icons/fi';
import PopUpFoot from '../../../common/PopUpFoot';
import Optionbox from '../../../common/Optionbox';
import Select from 'react-select';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useFormManage } from '../../../../contexts/FormManageContext';
import Button from '../../../common/Button';
import { MdOutlineFileDownload } from 'react-icons/md';
import { saveAs } from 'file-saver';

const customStyles = {
  control: (base) => ({
    ...base,
    height: '32px',
    minHeight: '32px',
  }),
  option: (styles) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center', // 세로 중앙 정렬 설정
    height: '27px',
  }),
  singleValue: (base) => ({
    ...base,
    height: '25px',
    lineHeight: '25px',
  }),
  indicatorSeparator: (base) => ({
    ...base,
    height: '20px',
    margin: '5px',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: '30px',
    margin: 0,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    height: '27px',
    padding: '3px',
    marginRight: '4px',
  }),
  menu: (base) => ({
    ...base,
    marginTop: '2px', // 옵션 목록의 상단 마진 조정
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: '200px', // 옵션 목록의 최대 높이 설정
  }),
};

const DetailBox = ({ children }) => {
  return (
    <div className={styled.detailBox} style={{ width: '100%' }}>
      {children}
    </div>
  );
};

const TitleBox = ({ title }) => {
  return (
    <div className={styled.titleBox}>
      <div className={styled.text}>{title}</div>
    </div>
  );
};

const SelectBox = ({ id, data, dataHandler, init }) => {
  const [selectedOption, setSelectedOption] = useState({});
  let initIndex = -1;

  data = data.map((ele, index) => {
    if (ele.id === init) {
      initIndex = index;
    }
    ele.value = ele.id;
    ele.label = ele.name;
    return ele;
  });

  useEffect(() => {
    setSelectedOption(data[initIndex]);
  }, [initIndex]);

  useEffect(() => {
    if (initIndex < 0) {
      initIndex = 0;
    }
  }, [data]);

  return (
    <div className={styled.dataBox}>
      <Select
        defaultValue={data[initIndex]}
        value={selectedOption}
        onChange={(selectedOption) => {
          setSelectedOption(selectedOption);
          dataHandler(id, selectedOption.value, selectedOption.label);
        }}
        options={data}
        isSearchable={true}
        className={styled.customSelect}
        styles={customStyles}
      />
    </div>
  );
};

const InputBox = ({ id, data, dataHandler, children, disabled }) => {
  return (
    <div className={styled.dataBox}>
      <div className={styled.viewUseField}>
        <input
          type="text"
          value={data}
          onChange={(e) => {
            dataHandler(id, e.target.value);
          }}
          disabled={disabled}
          className={styled.inputStyle}
        />
        {children}
      </div>
    </div>
  );
};

const AreaBox = ({ id, data, dataHandler, children }) => {
  return (
    <div className={styled.dataBox}>
      <div className={styled.viewUseField}>
        <div className={styled.viewItemBox}>
          {data.length > 0
            ? data.map((ele, index) => {
                return (
                  <Optionbox
                    key={index}
                    id={id}
                    initData={ele}
                    dataHandler={dataHandler}
                  ></Optionbox>
                );
              })
            : null}
        </div>
        {children}
      </div>
    </div>
  );
};

const FileBox = ({ id, name, data, dataHandler }) => {
  const { detailData } = useFormManage();
  const [formData, setFormData] = useState(data);
  const [formItems, setFormItems] = useState([]);
  const [fileData, setFileData] = useState('');
  const required = [1, 6, 10];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadEventHandler = () => {
    let subText = '';

    if (id === 'defaultForm') {
      subText = '_기본파일';
    } else if (id === 'mainForm') {
      subText = '_본문파일';
    }
    const blob = new Blob([detailData[id]]);
    saveAs(blob, `${detailData.formName}${subText}.html`);
  };

  const grayAndBlueBtn = [
    {
      label: '반영',
      onClick: () => {
        let confirmStatus = true;
        if (id === 'defaultForm') {
          for (let i of formItems) {
            if (required.includes(i.formListCode) && i.status === false) {
              confirmStatus = false;
            }
          }
        }
        if (confirmStatus) {
          dataHandler(id, formData);
          closeModal();
        } else {
          alert('필수 항목을 입력하세요');
        }
      },
      btnStyle: 'popup_blue_btn',
    },
    {
      label: '취소',
      onClick: () => {
        closeModal();
      },
      btnStyle: 'popup_blue_btn',
    },
  ];

  return (
    <div className={styled.dataBox}>
      <div className={styled.fileContent}>
        <DragDrop name={name} id={id} data={data} dataHandler={dataHandler} />
        <div className={styled.subBox}>
          <PopUp
            label={<FiEdit />}
            isModalOpen={isModalOpen}
            openModal={openModal}
            closeModal={closeModal}
            width={'1200px'}
            height={'700px'}
            title={'양식파일편집'}
            btnWidth="30px"
            btnHeihgt="30px"
            children={
              <>
                <FormEdit
                  id={id}
                  data={data}
                  dataHandler={setFormData}
                  curForm={formData}
                  formItems={formItems}
                  setFormItems={setFormItems}
                  requiredItems={id === 'defaultForm' ? required : []}
                  isModalOpen={isModalOpen}
                  isDefaultButton={id === 'defaultForm'}
                />
                <PopUpFoot buttons={grayAndBlueBtn} />
              </>
            }
          />
          <Button
            label={<MdOutlineFileDownload />}
            width={'30px'}
            onClick={downloadEventHandler}
          />
        </div>
      </div>
    </div>
  );
};

const RadioBox = ({ id, data, dataHandler }) => {
  const labelStyle = {
    fontSize: '13px', // 폰트 크기
    color: '#6c757d', // 폰트 색상
  };
  const labels = ['사용', '미사용'];

  const [selectedOption, setSelectedOption] = useState(labels[0]);

  useEffect(() => {
    setSelectedOption(data === 1 ? '사용' : '미사용');
  }, [data]);

  return (
    <div className={styled.dataBox}>
      <FormControl>
        <RadioGroup
          row
          aria-label="used"
          name="used"
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            dataHandler(id, e.target.value === '사용' ? 1 : 0);
          }}
        >
          {labels.map((label, index) => (
            <FormControlLabel
              key={index}
              value={labels[index]}
              control={<Radio size="small" style={{ color: '#6c757d' }} />}
              label={<span style={labelStyle}>{label}</span>}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export { DetailBox, TitleBox, SelectBox, InputBox, FileBox, AreaBox, RadioBox };
