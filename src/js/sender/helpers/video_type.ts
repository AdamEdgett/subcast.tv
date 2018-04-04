interface Video {
  domain: string;
  subreddit: string;
  subredditId: string;
  id: string;
  author: string;
  numComments: number;
  score: number;
  title: string;
  url: string;
  name: string;
  createdUtc: number;
  permalink: string;
  thumbnail: string;
}

export default Video;
