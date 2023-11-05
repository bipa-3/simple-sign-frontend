import React, { useState, useEffect } from 'react';
import styled from '../../../styles/components/home/RecommendForm.module.css';
import { GrDocumentText } from 'react-icons/gr';
import getFavorites from '../../../apis/approvalManageAPI/getFavorites';
import { useLoading } from '../../../contexts/LoadingContext';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    showLoading();
    getFavorites()
      .then((res) => {
        setFavorites(res);
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
      {favorites.length > 0
        ? favorites.map((ele, index) => {
            return (
              <RecommentContent icon={<GrDocumentText />} name={ele.formName} />
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
