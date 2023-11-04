import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from '../../styles/pages/ApprovalBoxSetPage.module.css';
import getCompanyList from '../../apis/commonAPI/getCompanyList';
import getUserCompany from '../../apis/approvalBoxAPI/getUserCompany';
import { getAuthrity } from '../../utils/getUser';
import { useApprovalBoxManage } from '../../contexts/ApprovalBoxManageContext';

function Datalist({
  onCompanyChange,
  selectedCompId,
  readonly,
  insertState,
  boxId,
}) {
  const authority = getAuthrity();
  const [selectedOption, setSelectedOption] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const { state, setState } = useApprovalBoxManage();

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

  // 데이터 로딩
  useEffect(() => {
    if (authority === '1') {
      getCompanyList()
        .then((response) => response.json())
        .then(handleCompanyData)
        .catch(handleError);
    } else if (authority === '2') {
      getUserCompany().then(handleCompanyData).catch(handleError);
    } else {
      setCompanyOptions([]);
      setSelectedOption(null);
    }
  }, [selectedCompId, authority]);

  // selectedOption 변경 감지
  useEffect(() => {
    if (selectedOption && typeof onCompanyChange === 'function') {
      onCompanyChange(selectedOption.value);
    }
  }, [selectedOption]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (typeof onCompanyChange === 'function') {
      onCompanyChange(selectedOption.value);
    }
  };
  function handleError(error) {
    console.error('Error fetching company data:', error);
  }

  function handleCompanyData(data) {
    let transformedData;

    if (authority === '1') {
      transformedData = data.map((company) => ({
        value: company.id,
        label: company.name,
      }));

      const selectedOptionFromCompId = transformedData.find(
        (option) => option.value === selectedCompId
      );

      if (insertState != 1) {
        if (selectedCompId) {
          setSelectedOption(selectedOptionFromCompId);
        } else {
          transformedData.unshift({
            value: 0,
            label: '전체',
          });
          setSelectedOption(
            selectedOptionFromCompId || { value: 0, label: '전체' }
          );
        }
      } else {
        setCompanyOptions(transformedData);
        setSelectedOption(selectedOptionFromCompId || transformedData[0]);
        setState((prevState) => ({
          ...prevState,
          compId: transformedData[0],
        }));
      }
    } else if (authority === '2') {
      transformedData = data.map((company) => ({
        value: company.id,
        label: company.name,
      }));
      setSelectedOption(transformedData[0]);
    } else {
      return;
    }

    setCompanyOptions(transformedData);
  }

  useEffect(() => {
    if (boxId && authority === '1') {
      const correspondingOption = companyOptions.find(
        (option) => option.value === boxId
      );
      if (correspondingOption) {
        setSelectedOption(correspondingOption);
      }
    }
  }, [boxId, companyOptions, onCompanyChange, authority]);

  return (
    <div className={styled.selectbox}>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={companyOptions}
        isSearchable={true}
        isDisabled={readonly} // 읽기 전용 설정
        className={styled.customSelect}
        styles={customStyles}
      />
    </div>
  );
}

export default Datalist;
