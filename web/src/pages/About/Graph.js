import React from 'react';
import graphWords from 'assets/images/graph-words.svg';

function Graph(props) {
  return (
    <div className="graph">
      <img className="graph-img" src={graphWords} alt="" />
      <div className="graph-overlay"/>
    </div>
  );
}

export default Graph;
