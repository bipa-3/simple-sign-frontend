import { getAuthrity } from './getUser';
import { Navigate, Link } from 'react-router-dom';
import styled from '../styles/utils/AccessDenied.module.css';

export default function checkUserAuthority(authority, component) {
  return getAuthrity() > authority ? <AccessDenied /> : component;
}

const AccessDenied = () => {
  return (
    <div className={styled.accessDeniedContainer}>
      <div className={styled.accessDeniedContent}>
        <h2 className={styled.accessDeniedTitle}>접근 권한이 없습니다</h2>
        <p>이 페이지에 접근할 권한이 없습니다.</p>
        <Link to="/" className={styled.accessDeniedLink}>
          홈으로 이동
        </Link>
      </div>
    </div>
  );
};
