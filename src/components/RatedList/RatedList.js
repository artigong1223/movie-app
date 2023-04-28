import React from 'react';
import propTypes from 'prop-types';

import './rated-list.css';

function RatedList(props) {
  RatedList.propTypes = {
    rated: propTypes.arrayOf(propTypes.object),
  };
  if (props.rated.length === 0) {
    return (
      <>
        <h1 className="rated-list">No rated films</h1>
      </>
    );
  } else {
    return null;
  }
}

export default RatedList;
