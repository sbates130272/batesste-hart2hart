
import React, { useState, useEffect } from 'react';
import { Episode } from '../types';
import { getEpisodeSummary } from '../services/geminiService';
import Spinner from './Spinner';
import { CheckIcon } from './icons/CheckIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface EpisodeDetailProps {
  episode: Episode;
  isWatched: boolean;
  watchedOn?: Date;
  onToggleWatched: () => void;
}

const EpisodeDetail: React.FC<EpisodeDetailProps> = ({ episode, isWatched, watchedOn, onToggleWatched }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const generatedSummary = await getEpisodeSummary(episode.title, episode.season, episode.episode);
        setSummary(generatedSummary);
      } catch (err) {
        setError('Failed to load summary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [episode]);

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg p-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-700 pb-4 mb-4">
        <div>
            <p className="text-sm text-rose-400 font-semibold">
                Season {episode.season} &bull; Episode {episode.episode}
            </p>
            <h2 className="text-3xl font-bold text-white mt-1">{episode.title}</h2>
        </div>
        <div className="mt-4 sm:mt-0">
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
                <p className="text-xs text-gray-400 mt-2 text-center sm:text-right">
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
            <p className="mt-4 text-gray-400">Generating summary...</p>
          </div>
        ) : error ? (
           <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
        ) : (
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
        )}
      </div>
    </div>
  );
};

export default EpisodeDetail;
