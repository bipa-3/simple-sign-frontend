import React, { useState, useEffect } from 'react';
import styled from '../../../styles/components/home/RecommendForm.module.css';
import { Link } from 'react-router-dom';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import getRecommendForm from '../../../apis/commonAPI/getRecommendForm';
import { getOrgUserId } from '../../../utils/getUser';
import { useLoading } from '../../../contexts/LoadingContext';

export default function FormShortCut() {
  const [shorCutBtns, setShortCutBtns] = useState([]);
  const { showLoading, hideLoading } = useLoading();

  const getRecommendFormData = () => {
    return getRecommendForm({ orgUserId: getOrgUserId() });
  };

  useEffect(() => {
    showLoading();
    getRecommendFormData()
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setShortCutBtns(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        hideLoading();
      });
  }, []);

  return (
    <div className={styled.container}>
      {shorCutBtns.length > 0
        ? shorCutBtns.map((ele, index) => {
            return (
              <React.Fragment key={index}>
                <Link
                  to={`./FL/${ele.formCode}`}
                  className={styled.shortCutBtn}
                >
                  <RecommentContent
                    icon={<HiOutlineDocumentText />}
                    name={ele.formName}
                  />
                </Link>
                {index !== shorCutBtns.length - 1 && (
                  <div
                    style={{
                      fontSize: '30px',
                      fontWeight: '100',
                      color: '#e6e6e6',
                    }}
                  >
                    |
                  </div>
                )}
              </React.Fragment>
            );
          })
        : null}
    </div>
  );
}

function RecommentContent({ icon, name }) {
  return (
    <div className={styled.recommentContentBox}>
      <div className={styled.contenticon}>{icon}</div>
      <div className={styled.contenttext}>{name}</div>
    </div>
  );
}
