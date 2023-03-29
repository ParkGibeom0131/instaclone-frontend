import PropTypes from "prop-types";
import styled from 'styled-components';
import { faBookmark, faComment, faHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from './../Avatar';
import { FatText } from './../shared';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id: Int!) {
        toggleLike(id: $id) {
            ok
            error
        }
    }
`;

const PhotoContainer = styled.div`
    background-color: white;
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 4px;
    margin-bottom: 60px;
    max-width: 615px;
`;

const PhotoHeader = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
    margin-left: 15px;
`;

const PhotoFile = styled.img`
    width: 100%;
`;

const PhotoData = styled.div`
    padding: 12px 15px;
`;

const PhotoActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
        display: flex;
        align-items: center;
    }
    svg {
        font-size: 20px;
    }
`;

const PhotoAction = styled.div`
    margin-right: 10px;
    cursor: pointer;
`;

const Likes = styled(FatText)`
    margin-top: 10px;
    display: block;
`;


function Photo({ id, user, file, isLiked, likes }) {
    const updateToggleLike = (cache, result) => {
        const {
            data: {
                toggleLike: { ok },
            },
        } = result;
        if (ok) {
            const fragmentId = `Photo:${id}`;
            const fragment = gql`
                fragment BSName on Photo {
                    isLiked
                    likes
                }
            `;
            const result = cache.readFragment({
                id: fragmentId,
                fragment,
            });
            if ("isLiked" in result && "likes" in result) {
                const { isLiked: cacheIsLiked, likes: cacheLikes } = result;
                //Local scope안에 있기 때문에 props에 있는 것과 다름
                cache.writeFragment({
                    // fragment, write => cache에서 특정 object의 일부분을 수정
                    id: fragmentId,
                    fragment,
                    data: {
                        isLiked: !cacheIsLiked,
                        likes: cacheIsLiked ? cacheLikes - 1 : cacheLikes + 1,
                    },
                });
            }
        }
    };
    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
        variables: {
            id,
        },
        // refetchQueries: [{ query: FEED_QUERY}],
        // Feed query 전체를 refetch하기 때문에 좋은 방법은 아님
        // 정말 작은 규모의 경우 사용해도 무방
        // => fragment를 사용
        update: updateToggleLike,
        //backend에서 받은 데이터를 주는 function, apollo cache에 직접 link 해줌
    });
    return (
        <PhotoContainer key={id}>
            <PhotoHeader>
                <Avatar lg url={user.avatar} />
                <Username>{user.username}</Username>
            </PhotoHeader>
            <PhotoFile src={file} />
            <PhotoData>
                <PhotoActions>
                    <div>
                        <PhotoAction onClick={toggleLikeMutation}>
                            <FontAwesomeIcon
                                style={{ color: isLiked ? "tomato" : "inherit" }}
                                icon={isLiked ? SolidHeart : faHeart}
                            />
                        </PhotoAction>
                        <PhotoAction>
                            <FontAwesomeIcon icon={faComment} />
                        </PhotoAction>
                        <PhotoAction>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </PhotoAction>
                    </div>
                    <div>
                        <FontAwesomeIcon size={"2x"} icon={faBookmark} />
                    </div>
                </PhotoActions>
                <Likes>{`좋아요 ${likes}개`}</Likes>
            </PhotoData>
        </PhotoContainer >
    );
}

Photo.propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired
    }),
    file: PropTypes.string.isRequired,
    isLiked: PropTypes.bool.isRequired,
    likes: PropTypes.number.isRequired,
}

export default Photo;