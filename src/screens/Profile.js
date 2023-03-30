import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client';
import { PHOTO_FRAGMENT } from './../fragments';
import styled from 'styled-components';
import { FatText } from './../components/shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import Button from './../components/auth/Button';
import PageTitle from '../components/PageTitle';
import useUser from './../hooks/useUser';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';

const Header = styled.div`
    display: flex;
`;

const Avatar = styled.img`
    margin-left: 50px;
    height: 160px;
    width: 160px;
    border-radius: 50%;
    margin-right: 150px;
    background-color: #2c2c2c;
`;

const Column = styled.div``;

const Username = styled.h3`
    font-size: 28px;
    font-weight: 400;
`;

const Row = styled.div`
    margin-bottom: 20px;
    font-size: 16px;
    display: flex;
`;

const List = styled.ul`
    display: flex;
`;

const Item = styled.li`
    margin-right: 20px;
`;

const Value = styled(FatText)`
    font-size: 16px;
`;

const Name = styled(FatText)`
    font-size: 20px;
`;

const Grid = styled.div`
    display: grid;
    grid-auto-rows: 290px;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-top: 50px;
    cursor: pointer;
`;

const Photo = styled.div`
    background-image: url(${(props) => props.bg});
    background-size: cover;
    position: relative;
`;

const Icons = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    opacity: 0;
    &:hover {
      opacity: 1;
    }
`;

const Icon = styled.span`
    font-size: 18px;
    display: flex;
    align-items: center;
    margin: 0px 5px;
    svg {
      font-size: 14px;
      margin-right: 5px;
    }
`;

const ExitIcon = styled.span`
    font-size: 18px;
    display: flex;
    align-items: center;
    margin: 0px 5px 0px 15px;
    svg {
      font-size: 14px;
      margin-right: 5px;
    }
    cursor: pointer;
`;

const SSeparator = styled.div`
    margin: 20px 0px 30px 0px;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    div {
        width: 100%;
        height: 1px;
        background-color: rgb(219, 219, 219);
    }
`;

const ProfileBtn = styled(Button).attrs({
    as: "span",
})`
    margin-left: 10px;
    margin-top: 0px;
    cursor: pointer;
`;

// 첫번째 parameter는 frontend를 위한 코드, Apollo validation 처리를 도와주기 위해 만든 코드
// 다음줄 parameter는 backend를 위한 코드
const SEE_PROFILE_QUERY = gql`
    query seeProfile($username: String!) { 
        seeProfile(username: $username) {
            firstName
            lastName
            username
            bio
            avatar
            photos {
                ...PhotoFragment
            }
            totalFollowing
            totalFollowers
            isMe
            isFollowing
        }
    }
    ${PHOTO_FRAGMENT}
`;

const FOLLOW_USER_MUTATION = gql`
    mutation followUser($username: String!) {
        followUser(username: $username) {
            ok
        }
    }
`;

const UNFOLLOW_USER_MUTATION = gql`
    mutation unfollowUser($username: String!) {
        unfollowUser(username: $username) {
            ok
        }
    }
`;

function Profile() {
    const { username } = useParams();
    const { data: userData } = useUser();
    const client = useApolloClient();
    const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
        variables: {
            username,
        },
    });

    const unfollowUserUpdate = (cache, result) => {
        const { data: { unfollowUser: { ok } } } = result;
        if (!ok) {
            return;
        }
        cache.modify({
            id: `User:${username}`,
            // Cache modify의 대상은 현재 로그인 되어 있는 유저
            fields: {
                // fields는 cache에 저장되어 있는 user 즉, user의 모든 fields를 담는 객체
                isFollowing(prev) {
                    return false;
                },
                totalFollowers(prev) {
                    return prev - 1;
                },
            },
        });
        const { me } = userData;
        cache.modify({
            id: `User:${me.username}`,
            fields: {
                totalFollowing(prev) {
                    return prev - 1;
                },
            },
        });
    };
    const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
        variables: {
            username,
        },
        update: unfollowUserUpdate,
    });

    const followUserCompleted = (data) => {
        // onCompleted 함수는 cache를 보내주지 않고 data만 보내줌
        const { followUser: { ok } } = data;
        if (!ok) {
            return;
        }
        const { cache } = client;
        // update 함수 이외에 cache에 접근할 수 있는 다양한 방법이 있음
        cache.modify({
            id: `User:${username}`,
            fields: {
                isFollowing(prev) {
                    return true;
                },
                totalFollowers(prev) {
                    return prev + 1;
                },
            },
        });
        const { me } = userData;
        cache.modify({
            id: `User:${me.username}`,
            fields: {
                totalFollowing(prev) {
                    return prev + 1;
                },
            },
        });
    };
    const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
        variables: {
            username,
        },
        // Query 전체를 불러오기 때문에 간단한 query에는 사용 무관
        // 복잡한 계산이나 pagination 작업을 처리해야 할 경우, 거대한 query에는 매우 비효율적
        onCompleted: followUserCompleted,
    });

    const getButton = (seeProfile) => {
        const { isMe, isFollowing } = seeProfile;
        if (isMe) {
            return (
                <>
                    <ProfileBtn>프로필 편집</ProfileBtn>
                    <ExitIcon>
                        <FontAwesomeIcon icon={faDoorOpen} />
                    </ExitIcon>
                </>
            );
        }
        if (isFollowing) {
            return <ProfileBtn onClick={unfollowUser}>팔로우 취소</ProfileBtn>;
        } else {
            return <ProfileBtn onClick={followUser}>팔로우</ProfileBtn>;
        }
    };
    return (
        <div>
            <PageTitle title={loading ? "로딩중..." : `${data?.seeProfile?.username}`} />
            <Header>
                <Avatar src={data?.seeProfile?.avatar} />
                <Column>
                    <Row>
                        <Username>{data?.seeProfile?.username}</Username>
                        {data?.seeProfile ? getButton(data.seeProfile) : null}
                    </Row>
                    <Row>
                        <List>
                            <Item>
                                <span>
                                    게시물 <Value>{data?.seeProfile?.photos.length}</Value>
                                </span>
                            </Item>
                            <Item>
                                <span>
                                    팔로워 <Value>{data?.seeProfile?.totalFollowers}</Value>
                                </span>
                            </Item>
                            <Item>
                                <span>
                                    팔로우 <Value>{data?.seeProfile?.totalFollowing}</Value>
                                </span>
                            </Item>
                        </List>
                    </Row>
                    <Row>
                        <Name>
                            {data?.seeProfile?.firstName}
                            {"  "}
                            {data?.seeProfile?.lastName}
                        </Name>
                    </Row>
                    <Row>{data?.seeProfile?.bio}</Row>
                </Column>
            </Header>
            <SSeparator>
                <div></div>
            </SSeparator>
            <Grid>
                {data?.seeProfile?.photos.map((photo) => (
                    <Photo key={photo.id} bg={photo.file}>
                        <Icons>
                            <Icon>
                                <FontAwesomeIcon icon={faHeart} />
                                {photo.likes}
                            </Icon>
                            <Icon>
                                <FontAwesomeIcon icon={faComment} />
                                {photo.commentNumber}
                            </Icon>
                        </Icons>
                    </Photo>
                ))}
            </Grid>
        </div>
    );
}

export default Profile;