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
import { useForm } from "react-hook-form";
import FormError from './../components/auth/FormError';
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router-dom";

const FacebookLogin = styled.div`
    color: #385285;
    span {
        margin-left: 10px;
        font-weight: 600;
    }
`;

const Notification = styled.div`
    display: flex;
    align-items: center;
    position: fixed;
    padding: 20px;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    font-weight: 600;
    color: #2ecc71;
`;

const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ok
            token
            error
        }
    }
`;

function Login() {
    const location = useLocation();
    const { register, handleSubmit, formState, setError, clearErrors } = useForm({
        mode: "onChange",
        defaultValues: {
            username: location?.state?.username || "",
            password: location?.state?.password || "",
        }
    });
    const onCompleted = (data) => {
        const { login: { ok, error, token } } = data;
        if (!ok) {
            setError("result", {
                message: error,
            });
        }
        if (token) {
            logUserIn(token);
        }
    };
    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted,
    });
    const onSubmitValid = (data) => {
        if (loading) {
            return;
        }
        const { username, password } = data;
        login({
            variables: { username, password },
        });
    };
    // const clearLoginError = () => {
    //     clearErrors("result");
    // };
    return (
        <AuthLayout>
            <PageTitle title="로그인" />
            <FormBox>
                <div>
                    <FontAwesomeIcon icon={faInstagram} size="3x" />
                </div>
                <Notification>{location?.state?.message}</Notification>
                <form onSubmit={handleSubmit(onSubmitValid)}>
                    <Input
                        {...register("username", {
                            required: "Username is required.",
                            minLength: {
                                value: 4,
                                message: "Username should be longer than 4 chars.",
                            },
                            onChange() {
                                clearErrors("result");
                            },
                        })}

                        name="username"
                        type="text"
                        placeholder="전화번호, 사용자 이름 또는 이메일"
                        hasError={Boolean(formState.errors?.username?.message)}
                    />
                    <FormError message={formState.errors?.username?.message} />
                    <Input
                        {...register("password", {
                            required: "Password is required.",
                            onChange() {
                                clearErrors("result");
                            },
                        })}

                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        hasError={Boolean(formState.errors?.password?.message)}
                    />
                    <FormError message={formState.errors?.password?.message} />
                    <Button type="submit" value={loading ? "로딩중..." : "로그인"} disabled={!formState.isValid || loading} />
                    <FormError message={formState.errors?.result?.message} />
                </form>
                <Separator />
                <FacebookLogin>
                    <FontAwesomeIcon icon={faFacebookSquare} />
                    <span>Facebook으로 로그인</span>
                </FacebookLogin>
            </FormBox>
            <BottomBox
                cta={"계정이 없으신가요?"}
                linkText="가입하기"
                link={routes.signUp}
            />
        </AuthLayout>
    );
};
export default Login;