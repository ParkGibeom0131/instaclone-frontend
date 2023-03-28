import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { isLoggedInVar, logUserOut } from './../apollo';

const ME_QUERY = gql`
    query me {
        me {
            id
            username
            avatar
        },
    },
`;

// Reactjs 상에서 user가 로그인 했는 지 확인
// user가 페이지에 로그인 하기 위해 해야할 건 Local Storage에 token을 가지는 것
// 그러나 user를 완전히 신뢰하지 않기 때문에 useUser hook을 생성

// 자바스크립트는 undefined, null, false를 거짓으로 설정함
function useUser() {
    const hasToken = useReactiveVar(isLoggedInVar);
    const { data } = useQuery(ME_QUERY, {
        skip: !hasToken,
    });
    useEffect(() => {
        if (data?.me === null) {
            logUserOut();
        }
    }, [data])
    return { data };
}

export default useUser;