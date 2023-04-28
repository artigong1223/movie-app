import React from 'react';
import { debounce } from 'lodash';
import { Col, Spin, Alert, Pagination, Tabs } from 'antd';
import { Offline } from 'react-detect-offline';

import ApiService from '../../api/ApiService';
import SearchMovie from '../SearchMovie/SearchMovie';
import MovieList from '../MovieList/MovieList';
import RatedList from '../RatedList/RatedList';

import './app.css';

export default class App extends React.Component {
  state = {
    movies: [],
    loading: false,
    error: false,
    search: '',
    page: 1,
    total: 0,
    ratedFilms: [],
    sessionId: localStorage.getItem('id') ? JSON.parse(JSON.stringify(localStorage.getItem('id'))) : '',
    genres: [],
  };
  _transformData = (data) => {
    const _transformedArr = [];
    data.results.forEach((film) => {
      const transformedFilm = {
        id: film.id,
        title: film.title,
        date: film.release_date,
        picture: film.poster_path,
        description: film.overview,
        genres: film.genre_ids,
        totalFilms: data.total_results,
        votes: film.vote_average,
        rating: film.rating,
      };
      _transformedArr.push(transformedFilm);
    });
    return _transformedArr;
  };
  componentDidUpdate = (_, a) => {
    if (
      this.state.search !== a.search ||
      this.state.page !== a.page ||
      this.state.error !== a.error ||
      this.state.total !== a.total
    ) {
      this.updateSearch();
    }
  };
  componentDidMount() {
    this.updateGuestSession();
  }
  updateSearch() {
    const api = new ApiService();
    api
      .getGenre()
      .then((a) => {
        this.setState({
          genres: a,
        });
      })
      .catch((e) => {
        console.log(e, 'genres');
      });
    api
      .getData(this.state.search, this.state.page)
      .then((b) => {
        this.setState(() => {
          return {
            loading: false,
            movies: this._transformData(b),
            total: this._transformData(b).length ? this._transformData(b)[0].totalFilms : null,
          };
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          error: true,
          loading: false,
        });
      });
  }
  updateGuestSession() {
    const api = new ApiService();
    api
      .getGenre()
      .then((a) => {
        this.setState({
          genres: a,
        });
      })
      .catch((e) => {
        console.log(e, 'genres');
      });
    api
      .createGuestSession()
      .then((id) => {
        this.setState({
          sessionId: localStorage.getItem('id') ? JSON.parse(JSON.stringify(localStorage.getItem('id'))) : id,
        });
        !localStorage.getItem('id') ? localStorage.setItem('id', id) : null;
      })
      .catch((e) => {
        console.log(e, 'GuestSession');
        this.setState({
          error: true,
          loading: false,
        });
      });
  }
  onSearch = debounce((e) => {
    this.setState({
      search: e,
      loading: true,
      error: false,
      page: 1,
    });
  }, 600);
  onPagination = (page) => {
    this.setState({
      page: page,
    });
  };
  handleRatingChange = (value, id) => {
    const api = new ApiService();
    api.rateMovie(value, id, this.state.sessionId).catch((err) => {
      console.log('error frompost request', err);
    });
  };
  getRatingMovies = (key) => {
    if (key === '1') {
      const api = new ApiService();
      api
        .getData(this.state.search, this.state.page)
        .then((b) => {
          this.setState({
            loading: false,
            movies: this._transformData(b),
            total: this._transformData(b).length ? this._transformData(b)[0].totalFilms : null,
          });
        })
        .catch((e) => {
          this.setState({
            error: true,
            loading: false,
          });
          console.log(e);
        });
    }
    if (key === '2') {
      const api = new ApiService();
      api
        .getRatedMovies(this.state.sessionId)
        .then((ratedMovies) => {
          this.setState({
            loading: false,
            movies: this._transformData(ratedMovies),
            ratedFilms: this._transformData(ratedMovies),
          });
        })
        .catch((e) => {
          this.setState({
            error: true,
            loading: false,
          });
          console.log(e);
        });
    }
  };
  render() {
    const { movies, genres, loading, search, total, ratedFilms } = this.state;
    const spinner = this.state.loading ? (
      <div>
        <Spin className="spinner" tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </div>
    ) : null;
    const errorMessage = this.state.error ? (
      <Alert
        className="errorMessage"
        message="Ошибка!"
        description="Проверьте правильность набранных данных"
        type="info"
      />
    ) : null;
    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <>
            <Col>
              <SearchMovie onSearch={this.onSearch} />
              {spinner}
              <MovieList
                ratedFilms={ratedFilms}
                movies={movies}
                genres={genres}
                loading={loading}
                handleRatingChange={this.handleRatingChange}
                search={search}
                errorMessage={errorMessage}
              />
              {Object.keys(movies).length && !loading ? (
                <Pagination
                  className="pagination"
                  onChange={this.onPagination}
                  defaultCurrent={1}
                  pageSize={20}
                  total={total}
                />
              ) : null}
            </Col>
          </>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <>
            <Col>
              {spinner}
              <MovieList
                ratedFilms={ratedFilms}
                movies={movies}
                genres={genres}
                loading={loading}
                handleRatingChange={this.handleRatingChange}
                search={search}
                errorMessage={errorMessage}
              />
              <RatedList rated={ratedFilms} />
              {Object.keys(movies).length && !loading ? (
                <Pagination
                  className="pagination"
                  onChange={this.onPagination}
                  defaultCurrent={1}
                  pageSize={20}
                  total={movies.length}
                />
              ) : null}
            </Col>
          </>
        ),
      },
    ];
    return (
      <div>
        <Tabs className="tabs" onChange={(key) => this.getRatingMovies(key)} items={items} />
        <Offline>
          <Alert className="offline" message="Ошибка!" description="Нет подключения к Интернету" type="info" />
        </Offline>
      </div>
    );
  }
}
