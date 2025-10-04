
import React from 'react';
import { Episode, WatchedStatus } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface EpisodeListProps {
  episodes: Episode[];
  selectedEpisode: Episode | null;
  onSelectEpisode: (episode: Episode) => void;
  watchedStatus: WatchedStatus;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, selectedEpisode, onSelectEpisode, watchedStatus }) => {
  const groupedBySeason: { [key: number]: Episode[] } = episodes.reduce((acc, episode) => {
    (acc[episode.season] = acc[episode.season] || []).push(episode);
    return acc;
  }, {} as { [key: number]: Episode[] });

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Episodes</h2>
        </div>
      <div className="overflow-y-auto">
        {Object.keys(groupedBySeason).map(seasonNumber => (
          <div key={seasonNumber}>
            <h3 className="text-lg font-bold text-rose-400 bg-gray-800 px-4 py-2 sticky top-0">
              Season {seasonNumber}
            </h3>
            <ul>
              {groupedBySeason[parseInt(seasonNumber)].map((episode) => {
                const isSelected = selectedEpisode?.title === episode.title;
                const episodeId = `S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}`;
                const isWatched = !!watchedStatus[episodeId];
                
                return (
                  <li key={episode.title}>
                    <button
                      onClick={() => onSelectEpisode(episode)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors duration-200 ${
                        isSelected
                          ? 'bg-rose-500/20 text-white'
                          : 'hover:bg-gray-700/50 text-gray-300'
                      }`}
                    >
                      <div className="flex-1 overflow-hidden">
                        <p className={`font-medium truncate ${isSelected ? 'text-rose-300' : 'text-gray-200'}`}>
                           E{episode.episode.toString().padStart(2, '0')}: {episode.title}
                        </p>
                      </div>
                      {isWatched && <CheckIcon className="h-5 w-5 text-green-400 flex-shrink-0 ml-2" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
