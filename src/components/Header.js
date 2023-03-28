import { useReactiveVar } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faCompass } from "@fortawesome/free-regular-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isLoggedInVar } from "../apollo";
import routes from "../screens/routes";
import useUser from './../hooks/useUser';
import Avatar from "./Avatar";

const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div``;

const Icon = styled.span`
  margin-left: 15px;
`;

const Button = styled.span`
    background-color: ${(props) => props.theme.accent};
    border-radius: 4px;
    padding: 4px 15px;
    color: white;
    font-weight: 600;
`;

const IconsContainer = styled.div`
    display: flex;
    align-items: center;
`;

function Header() {
    const isLoggedIn = useReactiveVar(isLoggedInVar);
    const { data } = useUser();
    // state에 isLoggedIn을 갖고 있을 때만 알려줌
    // => Local Storage에 토큰이 있을 경우
    return (
        <SHeader>
            <Wrapper>
                <Column>
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                </Column>
                <Column>
                    {isLoggedIn ? (
                        // father가 없는 많은 요소를 반환하고 싶을 경우
                        // 아래와 같이 father를 부여해야 함 (called by fragment)
                        // 항상 component를 반환해 주어야 함
                        <IconsContainer>
                            <Icon>
                                <FontAwesomeIcon icon={faHome} size="lg" />
                            </Icon>
                            <Icon>
                                <FontAwesomeIcon icon={faCompass} size="lg" />
                            </Icon>
                            <Icon>
                                <Avatar url={data?.me?.avatar} />
                            </Icon>
                        </IconsContainer>
                    ) : (
                        <Link href={routes.home}>
                            <Button>로그인</Button>
                        </Link>
                    )}
                </Column>
            </Wrapper>
        </SHeader>
    );
}
export default Header;