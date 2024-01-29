import styles from "../../styles/MyList.module.css";

import NavBar from "@/components/navbar/navbar";
import Head from "next/head";
import SectionCards from "@/components/card/section-cards";

import useRedirectUser from "@/hooks/redirectUser";
import { getFavouritedVideos } from "@/lib/videos";


export async function getServerSideProps(context) {
    const { token, userId } = await useRedirectUser(context);

    const myListVideos = await getFavouritedVideos(token, userId);
    return { props: { myListVideos } };
}

const MyList = ({myListVideos}) => {
    return (
        <div>
            <Head>
                <title>My list</title>
            </Head>
            <main className={styles.main}>
                <NavBar />
                <div className={styles.sectionWrapper}>
                    <SectionCards title="My List" videos={myListVideos} size="small" shouldWrap={true} shouldScale={false} />
                </div>
            </main>
        </div>
    )
};

export default MyList;