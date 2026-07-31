import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro, SiteFooter, SiteHeader } from "../../../_components/SiteChrome";
import { videos as fallbackVideos } from "../../../_data/site";
import { getYoutubeVideos } from "../../../_lib/youtube";

type WatchPageProps = {
  params: Promise<{ videoId: string }>;
};

export const revalidate = 1800;

export default async function WatchPage({ params }: WatchPageProps) {
  const { videoId } = await params;
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) notFound();

  const liveArchive = await getYoutubeVideos();
  const video = liveArchive.find((item) => item.id === videoId)
    ?? fallbackVideos.find((item) => item.id === videoId);
  const title = video?.title ?? "Recorded transmission";
  const date = video?.date ?? "Radio ACCU archive";

  return (
    <main className="site-shell">
      <SiteHeader active="archive" />
      <PageIntro
        eyebrow="Signal history / Video"
        title={title}
        description={`${date}. This full broadcast plays inside the Radio ACCU archive.`}
      />
      <section className="archive-watch">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          title={`${title} — Radio ACCU`}
        />
      </section>
      <Link className="page-wide-link" href="/archive">
        <span>← Return to signal archive</span>
        <span>Video / Audio</span>
      </Link>
      <SiteFooter />
    </main>
  );
}
