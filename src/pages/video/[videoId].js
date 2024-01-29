
import { useRouter } from "next/router";
import Modal from "react-modal";
import clsx from "classnames";

import styles from "../../styles/Video.module.css";
import { getYoutubeVideoById } from "@/lib/videos";
import NavBar from "@/components/navbar/navbar";
import Like from "@/components/icons/like-icon";
import DisLike from "@/components/icons/dislike-icon";
import { useEffect, useState } from "react";

Modal.setAppElement('#__next');


export async function getStaticProps(context) {
    const videoId = context.params.videoId;

    const videoArray = await getYoutubeVideoById(videoId);

    return {
        props: {
            video: videoArray.length > 0 ? videoArray[0] : {},
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 10, // In seconds
    }
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
    const videos = ["QrR_gm6RqCo"]

    // Get the paths we want to pre-render
    const paths = videos.map((videoId) => ({
        params: { videoId },
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
}


const Video = ({ video }) => {
    const router = useRouter();
    const { videoId } = router.query;
    const { title, publishTime, description, channelTitle, statistics: { viewCount } = { viewCount: 0 } } = video;
    const [toggleLike, setToggleLike] = useState(false);
    const [toggleDislike, setToggleDislike] = useState(false);

    useEffect(() => {
        const setRatingInitialValue = async () => {
            const response = await fetch(`/api/stats?videoId=${videoId}`);
            const data = await response.json();

            if (data.videoStats?.length > 0) {
                const favourited = data.videoStats[0].favourited;
                if (favourited === 1) {
                    setToggleLike(true);
                } else {
                    setToggleDislike(true);
                }
            }
        }
        setRatingInitialValue();
    },[])

    const runRatingService = async (favourited) => {
        return await fetch(`/api/stats?videoId=${videoId}`, {
            method: "POST",
            body: JSON.stringify({
                favourited: favourited,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    const handleOnToggleLike = async () => {
        if (!toggleLike) {
            const val = !toggleLike;
            setToggleLike(val);
            setToggleDislike(toggleLike);
    
            const favourited = val ? 1 : 0;
            const response = await runRatingService(favourited);
        }
    }

    const handleOnToggleDislike = async () => {
        if (!toggleDislike) {
            const val = !toggleDislike;
            setToggleDislike(val);
            setToggleLike(toggleDislike);
    
            const favourited = val ? 0 : 1;
            const response = await runRatingService(favourited);
        }
    }

    return (
        <div className={styles.container}>
            <NavBar />

            <Modal
                isOpen={true}
                contentLabel="Watch video"
                onRequestClose={() => router.back()}
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <iframe
                    id="player"
                    className={styles.videoPlayer}
                    type="text/html"
                    width="100%"
                    height="390"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&rel=0&controls=0`}
                    frameborder="0"
                >
                </iframe>

                <div className={styles.likeDislikeBtnWrapper}>
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={handleOnToggleLike}>
                            <div className={styles.btnWrapper}>
                                <Like selected={toggleLike}/>
                            </div>
                        </button>
                    </div>
                    <button onClick={handleOnToggleDislike}>
                        <div className={styles.btnWrapper}>
                            <DisLike selected={toggleDislike}/>
                        </div>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>{publishTime}</p>
                            <p className={styles.title}>{title}</p>
                            <p className={styles.description}>{description}</p>
                        </div>
                        <div className={styles.col2}>
                            <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>Cast: </span>
                                <span className={styles.channelTitle}>{channelTitle}</span>
                            </p>
                            <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>View Count: </span>
                                <span className={styles.channelTitle}>{viewCount}</span>
                            </p>
                        </div>
                    </div>
                </div>

            </Modal>
        </div>
    );
};

export default Video;