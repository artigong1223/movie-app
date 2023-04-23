import React from 'react';
import propTypes from 'prop-types';

import Movie from '../Movie/Movie';

import './movie-list.css';

function FilmList(props) {
  FilmList.propTypes = {
    movie: propTypes.arrayOf(propTypes.node),
    genres: propTypes.arrayOf(propTypes.object),
    handleRatingChange: propTypes.func,
    loading: propTypes.bool,
    search: propTypes.string,
    errorMessage: propTypes.func,
  };
  const filmArr = props.movies.map((movie) => {
    const { id } = movie;
    return (
      <Movie
        key={id}
        {...movie}
        genresList={props.genres}
        handleRatingChange={(value) => props.handleRatingChange(value, id)}
      />
    );
  });
  if (props.loading) {
    return null;
  } else if (!props.movies && props.search.length !== 0) {
    return <div className="desc">No films found. Try another search request</div>;
  }
  return (
    <div className="movie-list">
      {props.errorMessage}
      {filmArr}
    </div>
  );
}

export default FilmList;
