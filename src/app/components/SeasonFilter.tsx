"use client";

import React from 'react';

interface SeasonFilterProps {
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
  seasons: string[];
}

const SeasonFilter: React.FC<SeasonFilterProps> = ({
  selectedSeason,
  onSeasonChange,
  seasons,
}) => {
  return (
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onSeasonChange('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedSeason === 'All'
              ? 'bg-[#F1BDC3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Seasons
        </button>
        {seasons.map((season) => (
          <button
            key={season}
            onClick={() => onSeasonChange(season)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSeason === season
                ? 'bg-[#F1BDC3] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {season}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeasonFilter;
