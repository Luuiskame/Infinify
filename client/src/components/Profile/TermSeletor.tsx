import React, { useState } from 'react';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

const TermSelector = ({ 
   onTimeRangeChange 
}: { 
  onTimeRangeChange: (range: TimeRange) => void 
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const range = event.target.value as TimeRange;
    onTimeRangeChange(range);
  };

  return (
    <select 
      onChange={handleChange} 
      className="
        bg-spotify-light-gray 
        text-white 
        p-6
        self-center
        rounded-md 
        border-none 
        outline-none 
        focus:ring-2 
        focus:ring-spotify-green
      "
    >
      <option value="long_term">All Time</option>
      <option value="medium_term">Last 6 Months</option>
      <option value="short_term">Last 4 Weeks</option>
    </select>
  );
};

export default TermSelector