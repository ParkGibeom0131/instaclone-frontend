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
import { useForm } from 'react-hook-form';
import FormError from './../components/auth/FormError';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { useHistory } from "react-router-dom";

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

const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount(
        $firstName: String!
        $lastName: String
        $username: String!
        $email: String!
        $password: String!
    ) {
        createAccount(
            firstName: $firstName
            lastName: $lastName
            username: $username
            email: $email
            password: $password
        ) {
            ok
            error
        }
    }
`;

const SignUp = () => {
    const { register, handleSubmit, formState, clearErrors, setError, getValues } = useForm({
        mode: "onChange",
    });
    const history = useHistory();
    const onCompleted = (data) => {
        const { username, password } = getValues();
        const { createAccount: { ok, error }, } = data;
        if (!ok) {
            setError("result", {
                message: error,
            });
        }
        history.push(routes.home, {
            message: "Account Created. Please log in.",
            username,
            password,
        });
    };
    const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
        onCompleted,
    });
    const onSubmitValid = (data) => {
        if (loading) {
            return;
        }
        createAccount({
            variables: {
                ...data,
            },
        });
    };
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
                <form onSubmit={handleSubmit(onSubmitValid)}>
                    <Input {...register("firstName", {
                        required: "First Name is required.",
                        onChange() {
                            clearErrors("result");
                        },
                        validate: currrentValue => currrentValue.length < 20
                    })} name="firstName" type="text" placeholder="이름"
                        hasError={Boolean(formState.errors?.firstName?.message)}
                    />
                    <FormError message={formState.errors?.firstName?.message} />

                    <Input {...register("lastName", {
                        validate: currrentValue => currrentValue.length < 20
                    })} name="lastName" type="text" placeholder="성" />

                    <Input {...register("email", {
                        required: "Email is required.",
                        onChange() {
                            clearErrors("result");
                        },
                        validate: currrentValue => currrentValue.length < 20
                    })} name="email" type="text" placeholder="이메일"
                        hasError={Boolean(formState.errors?.email?.message)}
                    />
                    <FormError message={formState.errors?.email?.message} />

                    <Input {...register("username", {
                        required: "Username is required.",
                        onChange() {
                            clearErrors("result");
                        },
                        validate: currrentValue => currrentValue.length < 20
                    })} name="username" type="text" placeholder="사용자 이름"
                        hasError={Boolean(formState.errors?.username?.message)}
                    />
                    <FormError message={formState.errors?.username?.message} />

                    <Input {...register("password", {
                        required: "Password is required.",
                        onChange() {
                            clearErrors("result");
                        },
                        validate: currrentValue => currrentValue.length < 20
                    })} name="password" type="password" placeholder="비밀번호"
                        hasError={Boolean(formState.errors?.password?.message)}
                    />
                    <FormError message={formState.errors?.password?.message} />

                    <Button type="submit" value={loading ? "로딩중..." : "가입"} disabled={!formState.isValid || loading} />
                    <FormError message={formState.errors?.result?.message} />
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