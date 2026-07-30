import { PageIntro, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { VideoCard } from "../_components/VideoCard";
import { videos, YOUTUBE_CHANNEL_URL } from "../_data/site";

export default function ArchivePage() {
  return (
    <main className="site-shell">
      <SiteHeader active="archive" />
      <PageIntro
        eyebrow="Module 03 / Signal history"
        title="Video archive"
        description="Previous Radio ACCU live broadcasts, documented as video. Every card opens the original full transmission on YouTube."
      />
      <section className="archive-page-grid">
        {videos.map((video) => <VideoCard key={video.id} video={video} />)}
      </section>
      <a className="page-wide-link" href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">
        Continue on Radio ACCU YouTube <span>↗</span>
      </a>
      <SiteFooter />
    </main>
  );
}
