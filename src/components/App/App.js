import React from 'react';
import { debounce } from 'lodash';
import { Col, Spin, Alert, Pagination, Tabs } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import ApiService from '../../api/ApiService';
import SearchMovie from '../SearchMovie/SearchMovie';
import MovieList from '../MovieList/MovieList';
import RatedList from '../RatedList/RatedList';

import './app.css';

export default class App extends React.Component {
  api = new ApiService();
  state = {
    movies: [],
    loading: false,
    error: false,
    search: '',
    page: 1,
    total: 0,
    ratedFilms: [],
    sessionId: '',
    genres: [],
  };
  componentDidUpdate = (_, a) => {
    if (this.state.search !== a.search || this.state.page !== a.page) {
      this.updateSearch();
      this.updateGuestSession();
    }
  };
  updateSearch() {
    this.api.getGenre().then((a) => {
      this.setState({
        genres: a,
      });
    });
    this.api
      .getData(this.state.search, this.state.page)
      .then((b) => {
        this.setState(() => {
          return {
            loading: false,
            movies: b,
            total: b.length ? b[0].totalFilms : null,
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
    this.api.createGuestSession().then((id) => {
      this.setState({
        sessionId: id,
      });
      localStorage.clear();
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
    this.api.rateMovie(value, id, this.state.sessionId).catch((err) => {
      console.log('error frompost request', err);
    });
    if (localStorage.getItem('ratedFilms') === null) {
      const obj = {};
      obj[id] = value;
      localStorage.setItem('ratedFilms', JSON.stringify(obj));
    } else {
      const obj = JSON.parse(localStorage.getItem('ratedFilms') ? localStorage.getItem('ratedFilms') : null);
      obj[id] = value;
      localStorage.setItem('ratedFilms', JSON.stringify(obj));
    }
  };
  getRatingMovies = (key) => {
    if (key === '1') {
      this.api
        .getData(this.state.search, this.state.page)
        .then((movies) => {
          this.setState({
            loading: false,
            movies: movies,
            total: movies.length ? movies[0].totalFilms : null,
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
      this.api.getRatedMovies(this.state.sessionId).then((ratedMovies) => {
        this.setState({
          loading: false,
          movies: ratedMovies,
          ratedFilms: ratedMovies,
        });
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
              <Online>
                <SearchMovie onSearch={this.onSearch} />
                {spinner}
                <MovieList
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
              </Online>
              <Offline>
                <Alert className="offline" message="Ошибка!" description="Нет подключения к Интернету" type="info" />
              </Offline>
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
              <Online>
                {spinner}
                <MovieList
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
                    total={movies.length}
                  />
                ) : null}
                <RatedList rated={ratedFilms} />
              </Online>
              <Offline>
                <Alert className="offline" message="Ошибка!" description="Нет подключения к Интернету" type="info" />
              </Offline>
            </Col>
          </>
        ),
      },
    ];
    return (
      <div>
        <Tabs className="tabs" onChange={(key) => this.getRatingMovies(key)} items={items} />
      </div>
    );
  }
}
