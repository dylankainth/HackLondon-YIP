import React, { useState, forwardRef, useImperativeHandle } from 'react';

const Timeline = forwardRef((props, ref) => {
    const [entries, setEntries] = useState([]);
  
    // Function to update the timeline entries
    const addEntry = (text,time) => {
      const date = new Date(time);
      setEntries((prevEntries) => [...prevEntries, { time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text }]);
    };

    const setEntry = (idx, text) => {
        setEntries((prevEntries) => {
            if (idx < 0 || idx >= prevEntries.length) return prevEntries;
            return prevEntries.map((entry, index) =>
                index === idx ? { ...entry, text } : entry
            );
        });
        console.log(entries);
    };
  
    useImperativeHandle(ref, () => ({
      addEntry, setEntry
    }));
  
    return (
        <div className="relative border-l-2 border-gray-300 ml-4">
        {entries.map((entry, index) => (
        <React.Fragment key={index}>
          <div className="mb-10 ml-6">
            {/* Time */}
            <p className="mb-1 text-sm text-gray-500">{entry.time}</p>
            {/* Description */}
            <p className="text-base text-gray-900">{entry.text}</p>
          </div>
          {index !== entries.length - 1 && (
            <hr className="border-t border-gray-300 my-2" />
          )}
        </React.Fragment>
        ))}
        </div>
    );
  });
  
  export default Timeline;