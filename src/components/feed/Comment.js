import React from "react";
import styled from 'styled-components';
import { FatText } from './../shared';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($id: Int!) {
        deleteComment(id: $id) {
            ok
        }
    }
`;

const CommentContainer = styled.div`
    margin-bottom: 7px;
`;

const CommentCaption = styled.span`
    margin-left: 10px;
    a {
        background-color: inherit;
        color: ${(props) => props.theme.accent};
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
`;

function Comment({ id, photoId, isMine, author, payload }) {
    const updateDeleteComment = (cache, result) => {
        const { data: { deleteComment: { ok } } } = result;
        if (ok) {
            // Apollo cache의 Comment:${id}를 삭제하는 function
            cache.evict({ id: `Comment:${id}` });
            // comment의 id
            cache.modify({
                id: `Photo:${photoId}`,
                // comment의 parent인 photo의 id
                fields: {
                    commentNumber(prev) {
                        return prev - 1;
                    },
                },
            });
        }
    };
    const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
        variables: {
            id,
        },
        update: updateDeleteComment,
    });
    const onDeleteClick = () => {
        deleteCommentMutation();
    };
    return (
        <CommentContainer>
            <Link to={`/users/${author}`}>
                <FatText>{author}</FatText>
            </Link>
            <CommentCaption>
                {payload.split(" ").map((word, index) =>
                    /#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g.test(word) ? (
                        <React.Fragment key={index}>
                            <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
                        </React.Fragment>
                    ) : (
                        // fragment에는 key를 추가할 수 없음
                        // 때문에 React.Fragment를 통해 key를 추가
                        <React.Fragment key={index}>{word} </React.Fragment>
                    )
                )}
            </CommentCaption>
            {isMine ? <button onClick={onDeleteClick}>❌</button> : null}
        </CommentContainer>
    );
}

Comment.propTypes = {
    id: PropTypes.number,
    photoId: PropTypes.number,
    isMine: PropTypes.bool,
    author: PropTypes.string.isRequired,
    payload: PropTypes.string.isRequired,
};

export default Comment;