
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
