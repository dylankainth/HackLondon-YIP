import React, { useState, forwardRef, useImperativeHandle } from 'react';

const Timeline = forwardRef((props, ref) => {
    const [entries, setEntries] = useState([]);
  
    // Function to update the timeline entries
    const addEntry = (entry) => {
      setEntries((prevEntries) => [...prevEntries, entry]);
    };
  
    useImperativeHandle(ref, () => ({
      addEntry
    }));
  
    return (
      <div className="overflow-auto h-full">
        {entries.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
    );
  });
  
  export default Timeline;