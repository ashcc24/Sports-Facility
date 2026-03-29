import axios from 'axios';
const BASE = 'http://localhost:8080/api';
export const API = {
  students:     axios.create({ baseURL: `${BASE}/students` }),
  sports:       axios.create({ baseURL: `${BASE}/sports` }),
  coaches:      axios.create({ baseURL: `${BASE}/coaches` }),
  courses:      axios.create({ baseURL: `${BASE}/courses` }),
  enrollments:  axios.create({ baseURL: `${BASE}/enrollments` }),
  courts:       axios.create({ baseURL: `${BASE}/courts` }),
  bookings:     axios.create({ baseURL: `${BASE}/bookings` }),
  payments:     axios.create({ baseURL: `${BASE}/payments` }),
  achievements: axios.create({ baseURL: `${BASE}/achievements` }),
  performances: axios.create({ baseURL: `${BASE}/performances` }),
};