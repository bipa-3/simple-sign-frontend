import styled from '../../styles/components/login/Background.module.css';

export default function Background({ children }) {
  return <div className={styled.background}>{children}</div>;
}
