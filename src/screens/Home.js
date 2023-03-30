import { gql, useQuery } from '@apollo/client';
import PageTitle from '../components/PageTitle';
import Photo from './../components/feed/Photo';
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from './../fragments';

const FEED_QUERY = gql`
    query seeFeed($lastId: Int) {
        seeFeed(lastId: $lastId) {
            ...PhotoFragment
            user {
                username
                avatar
            }
            caption
            comments {
                ...CommentFragment     
            }
            createdAt
            isMine
        }
    }
    ${PHOTO_FRAGMENT}
    ${COMMENT_FRAGMENT}
`;

const Home = () => {
    const { data } = useQuery(FEED_QUERY);
    return (
        <div>
            <PageTitle title="Home" />
            {data?.seeFeed?.map((photo) => <Photo key={photo.id} {...photo} />)}
        </div>
    );
};
export default Home;