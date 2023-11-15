import React, { useState, useEffect } from 'react';
import styled from '../../../styles/components/home/RecommendForm.module.css';
import { Link } from 'react-router-dom';
import { GrDocumentText } from 'react-icons/gr';
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
              <Link
                key={index}
                to={`./FL/${ele.formCode}`}
                className={styled.shortCutBtn}
              >
                <RecommentContent
                  icon={<GrDocumentText />}
                  name={ele.formName}
                />
              </Link>
            );
          })
        : null}
    </div>
  );
}

function RecommentContent({ icon, name }) {
  return (
    <div className={styled.recommentContentBox}>
      {icon} {name}
    </div>
  );
}
