
import React, { useState, useEffect, useCallback } from 'react';
import { Episode, WatchedStatus } from './types';
import { getEpisodeList } from './services/geminiService';
import EpisodeList from './components/EpisodeList';
import EpisodeDetail from './components/EpisodeDetail';
import Spinner from './components/Spinner';
import { TvIcon } from './components/icons/TvIcon';

const App: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [watchedStatus, setWatchedStatus] = useState<WatchedStatus>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEpisodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const episodeList = await getEpisodeList();
      setEpisodes(episodeList);
      if (episodeList.length > 0) {
        setSelectedEpisode(episodeList[0]);
      }
    } catch (err) {
      setError('Failed to fetch episode list. Please check your API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEpisodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleWatchedStatus = (episode: Episode) => {
    const episodeId = `S${episode.season.toString().padStart(2, '0')}E${episode.episode.toString().padStart(2, '0')}`;
    setWatchedStatus(prevStatus => {
      const newStatus = { ...prevStatus };
      if (newStatus[episodeId]) {
        delete newStatus[episodeId];
      } else {
        newStatus[episodeId] = { watchedOn: new Date() };
      }
      return newStatus;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <TvIcon className="h-8 w-8 text-rose-500" />
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Hart to Hart Episode Tracker
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Spinner />
            <p className="mt-4 text-lg text-gray-400">Fetching episode list...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-96">
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p className="font-bold">An Error Occurred</p>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="md:col-span-1 lg:col-span-1">
              <EpisodeList
                episodes={episodes}
                selectedEpisode={selectedEpisode}
                onSelectEpisode={setSelectedEpisode}
                watchedStatus={watchedStatus}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              {selectedEpisode ? (
                <EpisodeDetail
                  key={selectedEpisode.title} // Re-mount component on episode change
                  episode={selectedEpisode}
                  isWatched={!!watchedStatus[`S${selectedEpisode.season.toString().padStart(2, '0')}E${selectedEpisode.episode.toString().padStart(2, '0')}`]}
                  watchedOn={watchedStatus[`S${selectedEpisode.season.toString().padStart(2, '0')}E${selectedEpisode.episode.toString().padStart(2, '0')}`]?.watchedOn}
                  onToggleWatched={() => toggleWatchedStatus(selectedEpisode)}
                />
              ) : (
                 <div className="flex items-center justify-center h-full bg-gray-800/50 rounded-lg p-8">
                    <p className="text-gray-400">Select an episode to see the details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
