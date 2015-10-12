import URI from 'urijs';

const parseYoutubeUrl = function (url) {
  const query = URI.parseQuery(URI(url).query());
  return { videoId: query.v, start: query.t };
}

export default parseYoutubeUrl;
