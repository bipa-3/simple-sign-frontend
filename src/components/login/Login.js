import LoginUI from './LoginUI';
import Background from './Background';
import styled from '../../styles/components/login/Login.module.css';

const LoginView = () => {
  return (
    <div className={styled.loginBox}>
      <LoginUI />
    </div>
  );
};

export default function Login() {
  return (
    <div className={styled.loginView}>
      <Background>
        <LoginView />
      </Background>
    </div>
  );
}
