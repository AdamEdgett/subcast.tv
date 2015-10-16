import URI from 'urijs';
import { last } from 'underscore';

const parseYoutubeUrl = function (url) {
  const uri = URI(url);
  const query = URI.parseQuery(uri.query());

  if (uri.domain() === 'youtu.be') {
    const videoId = last(uri.path().split('/'));
    return { videoId, start: query.t };
  } else {
    return { videoId: query.v, start: query.t };
  }
}

export default parseYoutubeUrl;
