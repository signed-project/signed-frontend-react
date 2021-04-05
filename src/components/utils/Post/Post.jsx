import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import Reaction from '../Reaction/Reaction';
import style from './post.module.scss';

const Post = ({ name, text, date, likesCount, reportsCount }) => {
    return (
        <>
            <div className={style.post}>
                <AuthorBlock name={name} date={date} />
                <PostContent text={text} />
                <Reaction
                    likesCount={likesCount}
                    reportsCount={reportsCount} />
            </div>
        </>
    )
}


export default Post;