import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

export function useProgress(address: string | null) {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    if (!address) {
      setProgress(null);
      return;
    }

    const key = `airdrop_progress_${address.toLowerCase()}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse progress:', error);
        setProgress({
          address: address.toLowerCase(),
          completedTasks: [],
          mintedNFTs: [],
          playedGames: [],
          lastUpdated: new Date().toISOString()
        });
      }
    } else {
      setProgress({
        address: address.toLowerCase(),
        completedTasks: [],
        mintedNFTs: [],
        playedGames: [],
        lastUpdated: new Date().toISOString()
      });
    }
  }, [address]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    if (!progress) return;

    const newProgress = {
      ...progress,
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    setProgress(newProgress);
    
    const key = `airdrop_progress_${progress.address}`;
    localStorage.setItem(key, JSON.stringify(newProgress));
  };

  const markTaskCompleted = (taskId: string) => {
    if (!progress) return;
    
    if (!progress.completedTasks.includes(taskId)) {
      updateProgress({
        completedTasks: [...progress.completedTasks, taskId]
      });
    }
  };

  const markNFTMinted = (nftId: string) => {
    if (!progress) return;
    
    if (!progress.mintedNFTs.includes(nftId)) {
      updateProgress({
        mintedNFTs: [...progress.mintedNFTs, nftId]
      });
    }
  };

  const markGamePlayed = (gameId: string) => {
    if (!progress) return;
    
    if (!progress.playedGames.includes(gameId)) {
      updateProgress({
        playedGames: [...progress.playedGames, gameId]
      });
    }
  };

  return {
    progress,
    markTaskCompleted,
    markNFTMinted,
    markGamePlayed,
    updateProgress
  };
}