import Head from "next/head";
import styles from "../styles/Home.module.css";

import NavBar from "@/components/navbar/navbar";
import Banner from "@/components/banner/banner";
import SectionCards from "@/components/card/section-cards";

import { getPopularVideos, getVideos, getWatchItAgainVideos } from "@/lib/videos";
import useRedirectUser from "@/hooks/redirectUser";

export async function getServerSideProps(context) {
  const { token, userId } = await useRedirectUser(context);

  const watchItAgainVideos = await getWatchItAgainVideos(token, userId);
  const tinyDeskVideos = await getVideos("tiny desk");
  const liveSets = await getVideos("deep house live set in nature");
  const acoustic = await getVideos("acoustic sessions");
  const popularVideos = await getPopularVideos();

  return { props: { tinyDeskVideos, liveSets, acoustic, popularVideos, watchItAgainVideos } };
}

export default function Home({ tinyDeskVideos, liveSets, acoustic, popularVideos, watchItAgainVideos }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Work & Listen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar />

        <Banner videoId="QrR_gm6RqCo" title="Mac Miller" subTitle="Mac Miller Tiny Desk" imgUrl="/static/mac-miller-tiny-desk.webp" />

        <div className={styles.sectionWrapper}>
          <SectionCards title="Tiny Desks" videos={tinyDeskVideos} size="large" />
          <SectionCards title="Watch it again" videos={watchItAgainVideos} size="small" />
          <SectionCards title="Live Sets" videos={liveSets} size="small" />
          <SectionCards title="Acoustic Sessions" videos={acoustic} size="medium" />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>

      </div>

    </div>
  );
}