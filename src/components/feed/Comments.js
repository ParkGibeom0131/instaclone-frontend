import PropTypes from "prop-types";
import styled from 'styled-components';
import Comment from './Comment';
import { useForm } from 'react-hook-form';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import useUser from './../../hooks/useUser';

const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($photoId: Int!, $payload: String!) {
        createComment(photoId: $photoId, payload: $payload) {
            ok
            error
            id
        }
    }
`;

const CommentsContainer = styled.div`
    margin-top: 20px;
    margin-left: 2px;
`;

const CommentCount = styled.span`
    opacity: 0.7;
    margin: 10px 0px;
    display: block;
    font-weight: 600;
    font-size: 10px;
`;

const PostCommentContainer = styled.div`
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 10px;
    border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
    width: 100%;
    &::placeholder {
      font-size: 12px;
    }
`;

function Comments({ photoId, author, caption, commentNumber, comments }) {
    const { data: userData } = useUser();
    const { register, handleSubmit, setValue, getValues } = useForm();
    const createCommentUpdate = (cache, result) => {
        const { payload } = getValues();
        setValue("payload", "");
        const { data: { createComment: { ok, id }, }, } = result;
        if (ok && userData?.me) {
            const newComment = {
                // array 안에 comment처럼 보이는 object를 추가하는 것 뿐임
                // frontend에 error는 없으나 cache에 comment가 없어 
                // 이후에 comment를 지울 수 없음 => cache 안에 comment를 만들어야 함
                __typename: "Comment",
                createdAt: Date.now() + "",
                id,
                isMine: true,
                payload,
                user: {
                    ...userData.me,
                },
            };
            const newCacheComment = cache.writeFragment({
                data: newComment,
                fragment: gql`
                    fragment BSName on Comment {
                        id
                        createdAt
                        isMine
                        payload
                        user {
                            username
                            avatar
                        }
                    }
                `,
            });
            cache.modify({
                // cache.modify() 안에 있는 fields object의 각 property는 function임.
                id: `Photo:${photoId}`,
                fields: {
                    comments(prev) {
                        // 모든 fields는 이전 값, 즉 cache에 있는 fields 값을 가지고 
                        // 이전 array에 newComment를 붙여서 만든 새 array를 return
                        return [...prev, newCacheComment];
                    },
                    commentNumber(prev) {
                        return prev + 1;
                    },
                },
            });
        }
    };
    const [createCommentMutation, { loading }] = useMutation(CREATE_COMMENT_MUTATION, {
        update: createCommentUpdate,
    });
    const onValid = (data) => {
        // data는 form이 가진 값을 나타냄
        const { payload } = data;
        if (loading) {
            return;
        }
        createCommentMutation({
            variables: {
                photoId,
                payload,
            },
        });
    };
    return (
        // Comment.js의 id와 isMine을 isRequired 할 수 없음
        // photo의 caption을 Comment component로 나타내고 있기 때문
        <CommentsContainer>
            <Comment author={author} payload={caption} />
            <CommentCount>
                {`댓글 ${commentNumber}개`}
            </CommentCount>
            {comments?.map(comment => (
                <Comment
                    key={comment.id}
                    id={comment.id}
                    photoId={photoId}
                    author={comment.user.username}
                    payload={comment.payload}
                    isMine={comment.isMine}
                />
            ))}
            <PostCommentContainer>
                <form onSubmit={handleSubmit(onValid)}>
                    <PostCommentInput
                        {...register("payload", {
                            required: true,
                        })}
                        name="payload"
                        type="text"
                        placeholder="댓글 달기..."
                    />
                </form>
            </PostCommentContainer>
        </CommentsContainer>
    );
}

Comments.propTypes = {
    photoId: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    caption: PropTypes.string,
    commentNumber: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            user: PropTypes.shape({
                avatar: PropTypes.string,
                username: PropTypes.string.isRequired
            }),
            payload: PropTypes.string.isRequired,
            isMine: PropTypes.bool.isRequired,
            createdAt: PropTypes.string.isRequired,
        })
    ),
};

export default Comments;