
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import InfoAuthor from "../InfoAuthor/InfoAuthor";
import Avatar from "../Avatar/Avatar";
import PostContent from "../PostContent/PostContent";
import RepostBlock from "../Post/RepostBlock";
import icon from "../../../assets/svg/icon";
import { getReadFormat } from "../../../libs/date.js";
import styles from "./notification.module.scss";
import useTargetPost from "../../customHooks/useTargetPost";
import useSourcePost from "../../customHooks/useSourcePost";
import Preview from "../Preview/Preview";
import getImgArr from "../../customHooks/getImgSources";
import NotificationTargetPost from "./NotificationTargetPost";
import Button from '../Button/Button';
import { inboxAction } from '../../../api/storage/inbox';

const Notification = ({
    post,
    handleShowMenu,
    handleEditPost,
}) => {
    const {
        id, type, text, likesCount,
        repostsCount, attachments, hash, createdAt,
        source: { address, publicName, avatar },
        target: { postHash }
    } = post;

    // let sourceCurrentPost = useSourcePost(address);
    let targetPost = useTargetPost(postHash);

    console.log('targetPo222222222222222222222.address', postHash);
    console.log('targetPo222222222222222222222.address', targetPost);
    console.log('targetPost?.source?.address', targetPost?.source?.address);
    let sourceTargetPost = useSourcePost(targetPost?.source?.address);
    const dispatch = useDispatch();
    const [imgPreview, setImgPreview] = useState([]);
    const { source: userSource } = useSelector((state) => state.user);

    useEffect(() => {
        const imgSources = getImgArr(attachments);
        setImgPreview(imgSources);
    }, [attachments]);

    useEffect(() => {
        if (targetPost?.attachments?.length > 0) {
            const imgSources = getImgArr(targetPost.attachments);
            setImgPreview(imgSources);
        }
    }, [targetPost]);

    if (!postHash) {
        targetPost = {
            likesCount: likesCount,
            repostsCount: repostsCount,
        };
    }

    const statuses = {
        reject: 'reject',
        accept: 'accept'
    };

    console.log('post', post);
    console.log('targetPost', targetPost);
    console.log('sourceTargetPost', sourceTargetPost);

    const setPermission = ({ address, id, status }) => {

        dispatch()

    }




    return (
        <> {targetPost && sourceTargetPost &&
            <div className={styles.post}>
                {(targetPost.type === "post" || targetPost.type === "reply") && (
                    <>
                        <div className={styles.typePost}>
                            <div className={styles.avatarBlock}>
                                <Avatar avatar={post.source.avatar} address={post.source.address} />
                            </div>
                            <div className={styles.postMain}>
                                <div className={styles.hover}>
                                    <InfoAuthor
                                        createdAt={getReadFormat(createdAt)}
                                        name={post.source.publicName} address={post.source.address}
                                        typeTargetPost={targetPost.type}
                                        typePost={type} />
                                    <div className={styles.menuIconWrapper}
                                        onClick={() => handleShowMenu(hash)}
                                        data-hash={hash}
                                    >
                                    </div>
                                </div>
                                <div className={styles.bodyWrapper}>
                                    <NotificationTargetPost
                                        text={targetPost.text}
                                    />
                                    {sourceTargetPost.hosts && <PostContent
                                        hostAssets={sourceTargetPost.hosts[0]?.assets}
                                        postHash={hash}
                                        text={text}
                                        type={type}
                                        imgHostArr={imgPreview}
                                    />}
                                    <div className={styles.buttonWrapper}>
                                        <Button className="clean_white grey"
                                            onClick={() => setPermission({ address: userSource.address, id, status: statuses.reject })}
                                        >Reject</Button>
                                        <Button className="clean_white"
                                            onClick={() => setPermission({ address: userSource.address, id, status: statuses.accept })}
                                        >Repost</Button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/*  {type === "like" && targetPost && sourceTargetPost && (
                    <>
                        <div className={styles.typeLike}>
                            <LikeMark createdAt={getReadFormat(createdAt)} name={sourcePost.publicName} address={address} />
                            <div className={styles.avatarWrapper}>
                                <div className={styles.avatarBlock}>
                                    <Avatar avatar={sourceTargetPost.avatar} address={address} />
                                    <div
                                        className={`${styles.verticalLine}    ${type === "like" && styles.verticalLineRemove
                                            }`}
                                    ></div>
                                </div>
                                <div className={styles.postBody}>
                                    <div className={styles.hover}>
                                        <InfoAuthor
                                            address={targetPost.source.address}
                                            createdAt={getReadFormat(targetPost.createdAt)}
                                            name={sourceTargetPost.publicName}
                                        />
                                    </div>
                                    <div className={styles.bodyWrapper}>
                                        <PostContent
                                            hostAssets={targetPost.source.hosts[0].assets}
                                            postHash={targetPost.hash}
                                            text={targetPost?.text}
                                            type={type}
                                            imgPrevSrc={imgPreview[0]?.imagePreviewUrl}
                                        />
                                        <Preview
                                            uploadImgArr={imgPreview}
                                            postHash={targetPost.hash}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {type === "repost" && targetPost && (
                    <>
                        <div className={styles.typePost}>
                            <div className={styles.avatarBlock}>
                                <Avatar avatar={sourcePost.avatar} address={address} />
                                <div
                                    className={`${styles.verticalLine}  ${comments.length === 0 && styles.verticalLineRemove
                                        }`}
                                ></div>
                            </div>
                            <div className={styles.postMain}>
                                <div className={styles.hover}>
                                    <InfoAuthor createdAt={getReadFormat(createdAt)} name={sourcePost.publicName} address={address} />
                                    <img
                                        src={icon.menu}
                                        alt="menu icon"
                                        className={styles.menuIcon}
                                    />
                                </div>
                                <div className={styles.bodyWrapper}>
                                    <PostContent
                                        hostAssets={sourcePost?.hosts[0]?.assets}
                                        postHash={hash}
                                        text={text}
                                        type={type}
                                        imgPrevSrc={imgPreview[0]?.imagePreviewUrl}
                                    />
                                </div>
                                <RepostBlock postHash={targetPost.hash} />
                            </div> 
                        </div>
                    </>
                )}*/}
            </div>
        }
        </>
    );
};



export default Notification;
