import axios from 'axios';

export default class ApiService {
  getData = async (request, page) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=d89e45a2906da5dce8ae832c65d913fe&query=${request}&page=${page}`
    );
    return response.data;
  };
  getGenre = async () => {
    const response = await axios.get(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=d89e45a2906da5dce8ae832c65d913fe'
    );
    return response.data.genres;
  };
  createGuestSession = async () => {
    const response = await axios.get(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=d89e45a2906da5dce8ae832c65d913fe'
    );
    return response.data.guest_session_id;
  };
  rateMovie = async (value, id, sessionId) => {
    const requestBody = {
      value: value,
    };
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };
    const response = await axios.post(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=d89e45a2906da5dce8ae832c65d913fe&guest_session_id=${sessionId}`,
      requestBody,
      { headers }
    );
    return response;
  };

  getRatedMovies = async (sessionId) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=d89e45a2906da5dce8ae832c65d913fe&sort_by=created_at.asc`
    );
    return response.data;
  };
}
