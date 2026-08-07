import { PageTitle, SiteFooter, SiteHeader } from "../_components/SiteChrome";
import { VideoCard } from "../_components/VideoCard";
import { videos as fallbackVideos } from "../_data/site";
import {
  getYoutubeVideos,
  YOUTUBE_UPLOADS_PLAYLIST,
  type ArchiveVideo,
} from "../_lib/youtube";

export const revalidate = 1800;

export default async function ArchivePage() {
  const youtubeVideos = await getYoutubeVideos();
  const videos: ArchiveVideo[] = youtubeVideos.length > 0
    ? youtubeVideos
    : fallbackVideos.map((video) => ({ ...video }));

  return (
    <main className="site-shell">
      <SiteHeader active="archive" />
      <PageTitle>Archive</PageTitle>

      <section className="archive-library-block">
        <header>
          <p>Video archive / YouTube</p>
          <span>Full upload library</span>
        </header>
        <div className="archive-channel-player">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${YOUTUBE_UPLOADS_PLAYLIST}`}
            title="Radio ACCU complete YouTube archive"
          />
        </div>
      </section>

      <section className="archive-section-heading">
        <p>Latest recorded transmissions</p>
        <span>{String(videos.length).padStart(2, "0")} recent signals</span>
      </section>
      <section className="archive-page-grid">
        {videos.map((video) => <VideoCard key={video.id} video={video} />)}
      </section>

      <section className="archive-library-block soundcloud-library">
        <header>
          <p>Audio archive / SoundCloud</p>
          <span>All published mixes</span>
        </header>
        <div className="soundcloud-library-player">
          <iframe
            allow="autoplay; encrypted-media"
            loading="lazy"
            scrolling="no"
            src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Fusers%2F1657728122&color=%23b9ff00&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false"
            title="Radio ACCU complete SoundCloud archive"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
