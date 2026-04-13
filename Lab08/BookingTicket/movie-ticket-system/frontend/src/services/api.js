import axios from 'axios';

const userAPI = axios.create({ baseURL: 'http://localhost:8081' });
const movieAPI = axios.create({ baseURL: 'http://localhost:8082' });
const bookingAPI = axios.create({ baseURL: 'http://localhost:8083' });
const notifAPI = axios.create({ baseURL: 'http://localhost:8085' });

// Tự động gắn token vào header
[bookingAPI].forEach(api => {
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
});

export const authService = {
  register: (data) => userAPI.post('/register', data),
  login: (data) => userAPI.post('/login', data),
};

export const movieService = {
  getMovies: (params) => movieAPI.get('/movies', { params }),
  getMovie: (id) => movieAPI.get(`/movies/${id}`),
  addMovie: (data) => movieAPI.post('/movies', data),
};

export const bookingService = {
  createBooking: (data) => bookingAPI.post('/bookings', data),
  getMyBookings: () => bookingAPI.get('/bookings/my'),
  getBooking: (id) => bookingAPI.get(`/bookings/${id}`),
};

export const notificationService = {
  getNotifications: (userId) => notifAPI.get(`/notifications/${userId}`),
};
