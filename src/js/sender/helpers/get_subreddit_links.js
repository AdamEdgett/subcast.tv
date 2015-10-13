import { isEmpty } from 'underscore';
import reqwest from 'reqwest';

function getSubredditLinks({subreddit, sort, time, count}, successHandler) {
  let requestUrl = 'https://www.reddit.com/';
  if (!isEmpty(subreddit)) {
    requestUrl += `r/${subreddit}/`;
  }
  if (!isEmpty(sort)) {
    requestUrl += `${sort}`;
  }
  requestUrl += '.json';

  const data = {};

  if (time) {
    data.t = time;
  }

  if (count) {
    data.count = count;
  }

  reqwest({
    url: requestUrl,
    method: 'get',
    type: 'json',
    crossOrigin: true,
    data: data,
    success: successHandler
  });
}

export default getSubredditLinks;
