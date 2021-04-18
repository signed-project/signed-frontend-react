import style from './postContent.module.scss';

const PostContent = ({ text }) => {
    return (
        <>
            <div className={style.postContent}>
                <span>{text}</span>
            </div>
        </>
    )
}

export default PostContent;