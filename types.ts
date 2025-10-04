export interface Episode {
  season: number;
  episode: number;
  title: string;
}

export interface WatchedStatus {
  [episodeId: string]: {
    watchedOn: Date;
  };
}

export interface EpisodeDetails {
    summary: string;
    youtubeLink: string;
}
