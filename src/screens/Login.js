import styled from "styled-components";
import { faFacebookSquare, faInstagram, } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthLayout from './../components/auth/AuthLayout';
import Button from './../components/auth/Button';
import Separator from "../components/auth/Separator";
import Input from './../components/auth/Input';
import FormBox from './../components/auth/FormBox';
import BottomBox from './../components/auth/BottomBox';
import routes from './routes';
import PageTitle from "../components/PageTitle";

const FacebookLogin = styled.div`
    color: #385285;
    span {
        margin-left: 10px;
        font-weight: 600;
    }
`;

const Login = () => {
    return (
        <AuthLayout>
            <PageTitle title="로그인" />
            <FormBox>
                <div>
                    <FontAwesomeIcon icon={faInstagram} size="3x" />
                </div>
                <form>
                    <Input type="text" placeholder="전화번호, 사용자 이름 또는 이메일" />
                    <Input type="password" placeholder="비밀번호" />
                    <Button type="submit" value="로그인" />
                </form>
                <Separator />
                <FacebookLogin>
                    <FontAwesomeIcon icon={faFacebookSquare} />
                    <span>Facebook으로 로그인</span>
                </FacebookLogin>
            </FormBox>
            <BottomBox
                cta={"계정이 없으신가요?"}
                link={routes.signUp}
                linkText="가입하기"
            />
        </AuthLayout>
    );
};
export default Login;