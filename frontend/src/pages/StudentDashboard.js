import React, { useState, useEffect } from 'react';
import { API } from '../api';
import './Dashboard.css';

export default function StudentDashboard({ user, setUser }) {
  const [tab, setTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [courts, setCourts] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.courses.get('').then(r => setCourses(r.data)).catch(()=>{});
    API.courts.get('').then(r => setCourts(r.data)).catch(()=>{});
    API.achievements.get('').then(r => setAchievements(r.data)).catch(()=>{});
    API.enrollments.get(`/student/${user.studentId}`).then(r => setMyEnrollments(r.data)).catch(()=>{});
    API.bookings.get(`/student/${user.studentId}`).then(r => setMyBookings(r.data)).catch(()=>{});
    API.payments.get(`/student/${user.studentId}`).then(r => setMyPayments(r.data)).catch(()=>{});
  }, [user]);

  const enroll = async (course) => {
    try {
      await API.enrollments.post('', {
        student: { studentId: user.studentId },
        course: { courseId: course.courseId },
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
      await API.payments.post('', {
        student: { studentId: user.studentId },
        course: { courseId: course.courseId },
        amount: course.fee,
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      });
      setMsg(`Enrolled in ${course.sport?.sportName} course! Payment pending.`);
      API.enrollments.get(`/student/${user.studentId}`).then(r => setMyEnrollments(r.data)).catch(()=>{});
    } catch(e) { setMsg('Enrollment failed: ' + e.message); }
  };

  const bookCourt = async (court) => {
    const date = prompt('Enter date (YYYY-MM-DD):');
    const start = prompt('Start time (e.g. 08:00):');
    const end = prompt('End time (e.g. 10:00):');
    if (!date || !start || !end) return;
    try {
      await API.bookings.post('', {
        student: { studentId: user.studentId },
        court: { courtId: court.courtId },
        bookingDate: date, startTime: start, endTime: end
      });
      setMsg(`Court "${court.location}" booked!`);
      API.bookings.get(`/student/${user.studentId}`).then(r => setMyBookings(r.data)).catch(()=>{});
    } catch(e) { setMsg('Booking failed: ' + e.message); }
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <span>🏆 Sports Facility</span>
        <span>Welcome, {user.name}</span>
        <button onClick={() => setUser(null)}>Logout</button>
      </header>
      <nav className="dash-nav">
        {['courses','courts','my-enrollments','my-bookings','my-payments','achievements'].map(t => (
          <button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>
            {t.replace('-',' ').toUpperCase()}
          </button>
        ))}
      </nav>
      {msg && <div className="msg-banner">{msg} <button onClick={()=>setMsg('')}>✕</button></div>}
      <div className="dash-body">
        {tab==='courses' && (
          <div className="card-grid">
            {courses.map(c => (
              <div className="card" key={c.courseId}>
                <h3>{c.sport?.sportName}</h3>
                <p>Coach: {c.coach?.name}</p>
                <p>Time: {c.startTime} – {c.endTime}</p>
                <p>Duration: {c.duration} months</p>
                <p className="fee">₹{c.fee}</p>
                <p>Max Students: {c.maxStudents}</p>
                <button onClick={()=>enroll(c)}>Enroll Now</button>
              </div>
            ))}
          </div>
        )}
        {tab==='courts' && (
          <div className="card-grid">
            {courts.map(c => (
              <div className="card" key={c.courtId}>
                <h3>{c.sport?.sportName} Court</h3>
                <p>📍 {c.location}</p>
                <p className={c.status==='Available'?'status-ok':'status-busy'}>{c.status}</p>
                <button onClick={()=>bookCourt(c)}>Book Court</button>
              </div>
            ))}
          </div>
        )}
        {tab==='my-enrollments' && (
          <table className="data-table">
            <thead><tr><th>Course</th><th>Sport</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>{myEnrollments.map(e => (
              <tr key={e.enrollmentId}>
                <td>{e.course?.courseId}</td>
                <td>{e.course?.sport?.sportName}</td>
                <td>{e.enrollmentDate}</td>
                <td><span className="badge">{e.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {tab==='my-bookings' && (
          <table className="data-table">
            <thead><tr><th>Court</th><th>Date</th><th>From</th><th>To</th></tr></thead>
            <tbody>{myBookings.map(b => (
              <tr key={b.bookingId}>
                <td>{b.court?.location}</td>
                <td>{b.bookingDate}</td>
                <td>{b.startTime}</td>
                <td>{b.endTime}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {tab==='my-payments' && (
          <table className="data-table">
            <thead><tr><th>Course</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>{myPayments.map(p => (
              <tr key={p.paymentId}>
                <td>{p.course?.sport?.sportName}</td>
                <td>₹{p.amount}</td>
                <td>{p.paymentDate}</td>
                <td><span className={`badge ${p.status==='Paid'?'paid':'pending'}`}>{p.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {tab==='achievements' && (
          <div className="card-grid">
            {achievements.map(a => (
              <div className="card trophy" key={a.achievementId}>
                <span className="trophy-icon">🏅</span>
                <h3>{a.title}</h3>
                <p>{a.sport?.sportName}</p>
                <p>{a.student?.name}</p>
                <p>{a.dateWon}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}