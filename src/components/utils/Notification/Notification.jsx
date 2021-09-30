
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import InfoAuthor from "../InfoAuthor/InfoAuthor";
import Avatar from "../Avatar/Avatar";
import PostContent from "../PostContent/PostContent";
import { getReadFormat } from "../../../libs/date.js";
import styles from "./notification.module.scss";
import useTargetPost from "../../customHooks/useTargetPost";
import useSourcePost from "../../customHooks/useSourcePost";
import getImgArr from "../../customHooks/getImgSources";
import NotificationTargetPost from "./NotificationTargetPost";
import ButtonBlock from "./ButtonBlock";
import { inboxActions } from '../../../api/storage/inbox';

const Notification = ({
    status,
    post,
    handleShowMenu,
}) => {
    const {
        id, type, text, likesCount,
        repostsCount, attachments, hash, createdAt,
        source: { address, publicName, avatar },
        target: { postHash }
    } = post;

    // let sourceCurrentPost = useSourcePost(address);

    let targetPost = useTargetPost(postHash);

    let sourceTargetPost = useSourcePost(targetPost?.source?.address);
    const dispatch = useDispatch();
    const [imgPreviewTargetPost, setImgPreviewTargetPost] = useState([]);
    const [imgPreview, setImgPreview] = useState([]);
    const { source: userSource } = useSelector((state) => state.user);
    const inbox = useSelector((state) => state.inbox.inbox);

    useEffect(() => {
        const imgSources = getImgArr(targetPost.attachments);
        setImgPreviewTargetPost(imgSources);
    }, [targetPost, inbox]);

    useEffect(() => {
        const imgSources = getImgArr(attachments);
        setImgPreview(imgSources);
    }, [attachments]);

    if (!postHash) {
        targetPost = {
            likesCount: likesCount,
            repostsCount: repostsCount,
        };
    }

    const setPermission = ({ authorAddress, destinationAddress, id, status }) => {
        dispatch(inboxActions.sendPermissionDecision({ id, status, destinationAddress, authorAddress, post }))
    }

    return (
        <> {targetPost && sourceTargetPost &&
            <div className={` ${styles.post} ${status === 'rejected' && styles.transparent} `}>
                {(targetPost.type === "post" || targetPost.type === "reply") && (type !== 'like') && (
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
                                        typePost={type}
                                        targetPostText={targetPost.text}
                                        postHash={postHash} />
                                    <div className={styles.menuIconWrapper}
                                        onClick={() => handleShowMenu(hash)}
                                        data-hash={hash}
                                    >
                                    </div>
                                </div>
                                <div className={styles.bodyWrapper}>
                                    {/* <NotificationTargetPost img={imgPreviewTargetPost.length > 0 ? imgPreviewTargetPost[0].imagePreviewUrl : ''}
                                        text={targetPost.text}
                                        postHash={targetPost.hash}
                                    /> */}
                                    {sourceTargetPost.hosts &&
                                        <PostContent
                                            text={text}
                                            type={type}
                                            imgHostArr={imgPreview.length > 0 ? imgPreview : ''}
                                        />}
                                    <ButtonBlock
                                        status={status}
                                        setPermission={setPermission}
                                        destinationAddress={userSource.address}
                                        authorAddress={post.source.address}
                                        id={id} />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {type === "like" && targetPost && sourceTargetPost && (
                    <>
                        <div className={styles.typeLike}>
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
                                            typePost={type}
                                            typeTargetPost={targetPost.type}
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
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        }
        </>
    );
};



export default Notification;
