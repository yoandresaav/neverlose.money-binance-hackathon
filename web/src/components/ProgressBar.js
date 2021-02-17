import React, { useState, useEffect } from 'react';

const ProgressBar = (props) => {
  const [width, setWidth] = useState(0);
  const {
    className,
    height = 6,
    progress = 50,
    backgroundColor = '#a8acb0',
    filledColor = '#f0b90b',
    style,
  } = props;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth(Math.min(progress, 100));
    }, 100);

    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div className={`progress-bar ${className}`} style={{ height, backgroundColor, ...style }}>
      <div className="filled" style={{ width: `${width}%`, backgroundColor: filledColor }} />
    </div>
  );
};

export default ProgressBar;
