import AuthorBlock from '../AuthorBlock/AuthorBlock';
import Content from '../Content/Content';
import Reaction from '../Reaction/Reaction';

const Post = () => {

    return (
        <>
            <div>
                <AuthorBlock />
                <Content />
                <Reaction />
            </div>

        </>
    )
}


export default Post;