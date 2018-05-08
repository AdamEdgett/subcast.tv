import { isEmpty } from 'underscore';
import reqwest from 'reqwest';

function getSubredditLinks({ subreddit, sort, time, after }, successHandler) {
  let requestUrl = 'https://www.reddit.com/';
  if (!isEmpty(subreddit)) {
    requestUrl += `r/${subreddit}/`;
  }
  if (!isEmpty(sort)) {
    requestUrl += `${sort}`;
  }
  requestUrl += '.json';

  const data = {
    limit: 100
  };

  if (time) {
    data.t = time;
  }
  if (after) {
    data.after = after;
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
