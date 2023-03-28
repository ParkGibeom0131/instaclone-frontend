import { faInstagram, } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthLayout from './../components/auth/AuthLayout';
import Button from './../components/auth/Button';
import Input from './../components/auth/Input';
import FormBox from './../components/auth/FormBox';
import BottomBox from './../components/auth/BottomBox';
import routes from './routes';
import styled from 'styled-components';
import { FatLink } from "../components/shared";
import PageTitle from './../components/PageTitle';

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Subtitle = styled(FatLink)`
    font-size: 17px;
    text-align: center;
    margin-top: 10px;
`;

const SignUp = () => {
    return (
        <AuthLayout>
            <PageTitle title="가입하기" />
            <FormBox>
                <HeaderContainer>
                    <FontAwesomeIcon icon={faInstagram} size="3x" />
                    <Subtitle>
                        친구들의 사진과 동영상을 보려면 가입하세요.
                    </Subtitle>
                </HeaderContainer>
                <form>
                    <Input type="text" placeholder="휴대폰 번호 또는 이메일 주소" />
                    <Input type="text" placeholder="성명" />
                    <Input type="text" placeholder="사용자 이름" />
                    <Input type="password" placeholder="비밀번호" />
                    <Button type="submit" value="가입" />
                </form>
            </FormBox>
            <BottomBox
                cta={"계정이 있으신가요?"}
                link={routes.home}
                linkText="로그인"
            />
        </AuthLayout>
    );
};
export default SignUp;