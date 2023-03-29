import { gql, useQuery } from '@apollo/client';
import PageTitle from '../components/PageTitle';
import Photo from './../components/feed/Photo';

const FEED_QUERY = gql`
    query seeFeed($lastId: Int) {
        seeFeed(lastId: $lastId) {
            id
            user {
                username
                avatar
            }
            file
            caption
            likes
            comments
            createdAt
            isMine
            isLiked
        }
    }
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