import URI from "urijs";
import { last } from "underscore";

function parseYoutubeUrl(url: string): { videoId: string, start?: string } {
  const uri = URI(url);
  const query = URI.parseQuery(uri.query()) as { v: string, t: string };

  if (uri.domain() === "youtu.be") {
    const videoId = last(uri.path().split("/")) as string;
    return { videoId, start: query.t };
  } else {
    return { videoId: query.v, start: query.t };
  }
}

export default parseYoutubeUrl;
