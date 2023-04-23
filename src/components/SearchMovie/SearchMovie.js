import React from 'react';
import propTypes from 'prop-types';
import { Input } from 'antd';

import './search-movie.css';

export default class SearchMovie extends React.Component {
  static propTypes = {
    onSearch: propTypes.func,
  };
  render() {
    return (
      <Input
        className="search-movie"
        placeholder="Type to search..."
        onChange={(e) => this.props.onSearch(e.target.value)}
      />
    );
  }
}
