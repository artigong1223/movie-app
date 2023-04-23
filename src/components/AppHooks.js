// import React, { useState, useEffect } from 'react';
// import { debounce } from 'lodash';
// import { Col, Spin, Alert, Pagination, Tabs } from 'antd';
// import { Online, Offline } from 'react-detect-offline';

// import ApiService from '../api/ApiService';

// import SearchMovie from './SearchMovie';
// import MovieList from './MovieList';
// import RatedList from './RatedList';

// function App() {
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [ratedFilms, setRatedFilms] = useState([]);
//   const [sessionId, setSessionId] = useState('');
//   const api = new ApiService();
//   useEffect(() => {
//     const api = new ApiService();
//     api
//       .getData(search, page)
//       .then((movies) => {
//         setLoading(false);
//         setMovies(movies);
//         movies.length ? setTotal(movies[0].totalFilms) : null;
//       })
//       .catch((e) => {
//         console.log(e);
//         setError(true);
//         setLoading(false);
//       });
//   }, [search, page, error, total]);
//   useEffect(() => {
//     const api = new ApiService();
//     api.createGuestSession().then((id) => {
//       setSessionId(id);
//       localStorage.clear();
//     });
//   }, []);
//   const onSearch = debounce((e) => {
//     setSearch(e);
//     setLoading(true);
//     setError(false);
//     setPage(1);
//   }, 600);
//   const onPagination = (page) => {
//     setPage(page);
//   };
//   const handleRatingChange = (value, id) => {
//     api.rateMovie(value, id, sessionId).catch((err) => {
//       console.log('error frompost request', err);
//     });
//     if (localStorage.getItem('ratedFilms') === null) {
//       const obj = {};
//       obj[id] = value;
//       localStorage.setItem('ratedFilms', JSON.stringify(obj));
//     } else {
//       const obj = JSON.parse(localStorage.getItem('ratedFilms') ? localStorage.getItem('ratedFilms') : null);
//       obj[id] = value;
//       localStorage.setItem('ratedFilms', JSON.stringify(obj));
//     }
//   };
//   const getRatingMovies = (key) => {
//     if (key === '1') {
//       const api = new ApiService();
//       api
//         .getData(search, page)
//         .then((movies) => {
//           setLoading(false);
//           setMovies(movies);
//           movies.length ? setTotal(movies[0].totalFilms) : null;
//         })
//         .catch((e) => {
//           console.log(e);
//           setError(true);
//           setLoading(false);
//         });
//     }
//     if (key === '2') {
//       api.getRatedMovies(sessionId).then((ratedMovies) => {
//         setLoading(false);
//         setMovies(ratedMovies);
//         setRatedFilms(ratedMovies);
//       });
//     }
//   };
//   const errorMessage = error ? (
//     <Alert
//       style={{ position: 'absolute', zIndex: 100, width: '100vw' }}
//       message="Ошибка!"
//       description="Проверьте правильность набранных данных"
//       type="info"
//     />
//   ) : null;
//   const spinner = loading ? (
//     <div>
//       <Spin style={{ marginTop: 60 }} tip="Loading" size="large">
//         <div className="content" />
//       </Spin>
//     </div>
//   ) : null;
//   const items = [
//     {
//       key: '1',
//       label: 'Search',
//       children: (
//         <>
//           <Col>
//             <Online>
//               <SearchMovie onSearch={onSearch} />
//               {spinner}
//               <MovieList
//                 movies={movies}
//                 loading={loading}
//                 handleRatingChange={handleRatingChange}
//                 search={search}
//                 errorMessage={errorMessage}
//               />
//               {Object.keys(movies).length && !loading ? (
//                 <Pagination
//                   style={{ marginTop: 60, textAlign: 'center' }}
//                   onChange={onPagination}
//                   defaultCurrent={1}
//                   pageSize={20}
//                   total={total}
//                 />
//               ) : null}
//             </Online>
//             <Offline>
//               <Alert message="Ошибка!" description="Нет подключения к Интернету" type="info" />
//             </Offline>
//           </Col>
//         </>
//       ),
//     },
//     {
//       key: '2',
//       label: 'Rated',
//       children: (
//         <>
//           <Col>
//             <Online>
//               {spinner}
//               <MovieList
//                 movies={movies}
//                 loading={loading}
//                 handleRatingChange={handleRatingChange}
//                 search={search}
//                 errorMessage={errorMessage}
//               />
//               <RatedList rated={ratedFilms} />
//             </Online>
//             <Offline>
//               <Alert message="Ошибка!" description="Нет подключения к Интернету" type="info" />
//             </Offline>
//           </Col>
//         </>
//       ),
//     },
//   ];
//   return (
//     <div>
//       <Tabs style={{ alignItems: 'center' }} onChange={(key) => getRatingMovies(key)} items={items} />
//     </div>
//   );
// }
// export default App;
