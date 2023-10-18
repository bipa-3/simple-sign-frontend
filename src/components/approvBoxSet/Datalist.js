import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from '../../styles/pages/ApprovalBoxSetPage.module.css';
import getCompanyList from '../../apis/commonAPI/getCompanyList';

function Datalist({ onCompanyChange, selectedCompId }) {
  const [selectedOption, setSelectedOption] = useState({
    value: 0,
    label: '전체',
  });
  const [companyOptions, setCompanyOptions] = useState([]);

  const defaultValue = companyOptions[0];

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

  useEffect(() => {
    getCompanyList()
      .then((response) => response.json())
      .then((data) => {
        const transformedData = data.map((company) => ({
          value: company.id,
          label: company.name,
        }));

        transformedData.unshift({
          value: '0',
          label: '전체',
        });

        setCompanyOptions(transformedData);

        // 선택된 회사의 id를 상위 컴포넌트로 전달
        const initialOption = transformedData.find(
          (option) => option.value === selectedCompId
        ) || { value: 0, label: '전체' };

        setSelectedOption(initialOption);

        if (typeof onCompanyChange === 'function') {
          onCompanyChange(initialOption.value);
        }
      })
      .catch((error) => {
        console.error('Error fetching company list:', error);
      });
  }, [selectedCompId]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (typeof onCompanyChange === 'function') {
      onCompanyChange(selectedOption.value); // 선택된 회사의 id를 상위 컴포넌트로 전달
    }
  };

  return (
    <div className={styled.selectbox}>
      <Select
        defaultValue={defaultValue}
        value={selectedOption}
        onChange={handleChange}
        options={companyOptions}
        isSearchable={true}
        className={styled.customSelect}
        styles={customStyles}
      />
    </div>
  );
}

export default Datalist;
