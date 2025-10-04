import React, { useState, useEffect } from 'react';
import { Episode, EpisodeDetails } from '../types';
import { getEpisodeDetails } from '../services/geminiService';
import Spinner from './Spinner';
import { CheckIcon } from './icons/CheckIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';

interface EpisodeDetailProps {
  episode: Episode;
  isWatched: boolean;
  watchedOn?: Date;
  onToggleWatched: () => void;
}

const EpisodeDetail: React.FC<EpisodeDetailProps> = ({ episode, isWatched, watchedOn, onToggleWatched }) => {
  const [details, setDetails] = useState<EpisodeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      setDetails(null);
      try {
        const generatedDetails = await getEpisodeDetails(episode.title, episode.season, episode.episode);
        setDetails(generatedDetails);
      } catch (err) {
        setError('Failed to load episode details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [episode]);

  const handleWatchClick = () => {
    if (!isWatched) {
      onToggleWatched();
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg p-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-gray-700 pb-4 mb-4 gap-4">
        <div className="flex-1">
            <p className="text-sm text-rose-400 font-semibold">
                Season {episode.season} &bull; Episode {episode.episode}
            </p>
            <h2 className="text-3xl font-bold text-white mt-1">{episode.title}</h2>
        </div>
        <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto flex-shrink-0">
            {details?.youtubeLink && (
                 <a
                    href={details.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWatchClick}
                    className="flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                >
                    <YoutubeIcon className="h-5 w-5 mr-2" />
                    Watch on YouTube
                </a>
            )}
            <button
                onClick={onToggleWatched}
                className={`flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors duration-200 w-full sm:w-auto ${
                    isWatched 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
            >
                <CheckIcon className="h-5 w-5 mr-2" />
                {isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
            </button>
            {isWatched && watchedOn && (
                <p className="text-xs text-gray-400 mt-1 text-center sm:text-right">
                    Watched on: {watchedOn.toLocaleDateString()}
                </p>
            )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-2 text-rose-400" />
            AI Generated Summary
        </h3>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <Spinner />
            <p className="mt-4 text-gray-400">Generating details...</p>
          </div>
        ) : error ? (
           <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
        ) : (
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{details?.summary}</p>
        )}
      </div>
    </div>
  );
};

export default EpisodeDetail;
