import React, { useState, useEffect } from 'react';
import styled from '../../../styles/components/home/RecommendForm.module.css';
import { GrDocumentText } from 'react-icons/gr';
import getFavorites from '../../../apis/approvalManageAPI/getFavorites';
import { useLoading } from '../../../contexts/LoadingContext';
import { IoIosMore } from 'react-icons/io';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    showLoading();
    getFavorites()
      .then((res) => {
        // res가 배열인지 확인
        if (Array.isArray(res)) {
          setFavorites(res);
        } else {
          // res가 배열이 아니라면, 적절하게 처리
          console.error('Expected an array from getFavorites, but got:', res);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        hideLoading();
      });
  }, []);

  // favorites가 배열인지 확인 후 slice 사용
  const firstThreeFavorites = Array.isArray(favorites)
    ? favorites.slice(0, 3)
    : [];

  function goFormList() {
    navigate(`/FL?name=${'결재하기'}`);
  }

  return (
    <div className={styled.favoritescontainer}>
      {firstThreeFavorites.map((ele, index) => (
        <div
          key={ele.formCode}
          className={`styled.favoriteSection${index + 1}`}
        >
          <RecommentContent
            icon={<HiOutlineDocumentText />}
            name={ele.formName}
            formCode={ele.formCode}
          />
        </div>
      ))}

      <div className={styled.favoriteSection4}>
        <IoIosMore
          fontSize="25px"
          color="#98a6ad"
          onClick={() => goFormList()}
        />
      </div>
    </div>
  );
}

function RecommentContent({ icon, name, formCode }) {
  return (
    <Link to={`/FL/${formCode}`} className={styled.recommentContentBox}>
      <div className={styled.contenticonF}>{icon}</div>
      <div className={styled.contenttextF}>{name}</div>
    </Link>
  );
}
