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
  const [performances, setPerformances] = useState([]);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('info');

  const showMsg = (text, type = 'info') => { setMsg(text); setMsgType(type); };

  const refreshEnrollments = () =>
    API.enrollments.get(`/student/${user.studentId}`).then(r => setMyEnrollments(r.data)).catch(() => {});

  const refreshPayments = () =>
    API.payments.get(`/student/${user.studentId}`).then(r => setMyPayments(r.data)).catch(() => {});

  useEffect(() => {
    API.courses.get('').then(r => setCourses(r.data)).catch(() => {});
    API.courts.get('').then(r => setCourts(r.data)).catch(() => {});
    API.achievements.get('').then(r => setAchievements(r.data)).catch(() => {});
    API.performances.get(`/student/${user.studentId}`).then(r => setPerformances(r.data)).catch(() => {});
    refreshEnrollments();
    API.bookings.get(`/student/${user.studentId}`).then(r => setMyBookings(r.data)).catch(() => {});
    refreshPayments();
  }, [user]);

  const isAlreadyEnrolled = (courseId) =>
    myEnrollments.some(e => e.course?.courseId === courseId);

  const getPaymentStatusForCourse = (courseId) => {
    const payment = myPayments.find(p => p.course?.courseId === courseId);
    return payment ? payment.status : null;
  };

  const enroll = async (course) => {
    if (isAlreadyEnrolled(course.courseId)) {
      showMsg(`You are already enrolled in the ${course.sport?.sportName} course!`, 'error');
      return;
    }
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
      showMsg(`Enrolled in ${course.sport?.sportName} course! Payment pending.`, 'info');
      refreshEnrollments();
      refreshPayments();
    } catch (e) {
      const msg = typeof e.response?.data === 'string' ? e.response.data : e.response?.data?.message || e.message;
      showMsg('Enrollment failed: ' + msg, 'error');
    }
  };

  const deleteEnrollment = async (enrollmentId) => {
    if (!window.confirm('Cancel this enrollment?')) return;
    try {
      await API.enrollments.delete(`/${enrollmentId}`);
      showMsg('Enrollment cancelled!', 'info');
      refreshEnrollments();
      refreshPayments();
    } catch(e) { showMsg('Failed to cancel enrollment', 'error'); }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.bookings.delete(`/${bookingId}`);
      showMsg('Booking cancelled!', 'info');
      API.bookings.get(`/student/${user.studentId}`).then(r => setMyBookings(r.data)).catch(() => {});
    } catch(e) { showMsg('Failed to cancel booking', 'error'); }
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
      showMsg(`Court "${court.location}" booked!`, 'info');
      API.bookings.get(`/student/${user.studentId}`).then(r => setMyBookings(r.data)).catch(() => {});
    } catch (e) {
      const msg = typeof e.response?.data === 'string' ? e.response.data : e.response?.data?.message || e.message;
      showMsg('Booking failed: ' + msg, 'error');
    }
  };

  const coursesBySport = courses.reduce((acc, c) => {
    const sport = c.sport?.sportName || 'Unknown';
    if (!acc[sport]) acc[sport] = [];
    acc[sport].push(c);
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <header className="dash-header">
        <span>🏆 Sports Facility</span>
        <span>Welcome, {user.name}</span>
        <button onClick={() => setUser(null)}>Logout</button>
      </header>
      <nav className="dash-nav">
        {['courses', 'courts', 'my-enrollments', 'my-bookings', 'my-payments', 'achievements', 'performance'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </nav>
      {msg && (
        <div className={`msg-banner ${msgType === 'error' ? 'msg-error' : ''}`}>
          {msg} <button onClick={() => setMsg('')}>✕</button>
        </div>
      )}
      <div className="dash-body">

        {/* COURSES TAB */}
        {tab === 'courses' && (
          <div>
            {Object.entries(coursesBySport).map(([sportName, sportCourses]) => (
              <div key={sportName} className="sport-section">
                <h3 className="sport-title">{sportName}</h3>
                <div className="course-row">
                  {sportCourses.map(c => {
                    const enrolled = isAlreadyEnrolled(c.courseId);
                    const paymentStatus = getPaymentStatusForCourse(c.courseId);
                    return (
                      <div className="card" key={c.courseId}>
                        <h3>{c.sport?.sportName}</h3>
                        <p>👤 Coach: {c.coach?.name || 'TBA'}</p>
                        <p>🕐 Time: {c.startTime} – {c.endTime}</p>
                        <p>📅 Duration: {c.duration} months</p>
                        <p className="fee">₹{c.fee}</p>
                        <p>👥 Max Students: {c.maxStudents}</p>
                        {enrolled ? (
                          <div>
                            <span className="badge paid">✓ Enrolled</span>
                            {paymentStatus && (
                              <span className={`badge ${paymentStatus === 'Paid' ? 'paid' : 'pending'}`} style={{ marginLeft: '6px' }}>
                                Payment: {paymentStatus}
                              </span>
                            )}
                          </div>
                        ) : (
                          <button onClick={() => enroll(c)}>Enroll Now</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COURTS TAB */}
        {tab === 'courts' && (
          <div className="card-grid">
            {courts.map(c => (
              <div className="card" key={c.courtId}>
                <h3>{c.sport?.sportName} Court</h3>
                <p>📍 {c.location}</p>
                <p className={c.status === 'Available' ? 'status-ok' : 'status-busy'}>{c.status}</p>
                <button onClick={() => bookCourt(c)}>Book Court</button>
              </div>
            ))}
          </div>
        )}

        {/* MY ENROLLMENTS TAB */}
        {tab === 'my-enrollments' && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Sport</th>
                <th>Enrollment Date</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myEnrollments.map(e => {
                const paymentStatus = getPaymentStatusForCourse(e.course?.courseId);
                return (
                  <tr key={e.enrollmentId}>
                    <td>{e.course?.courseId}</td>
                    <td>{e.course?.sport?.sportName}</td>
                    <td>{e.enrollmentDate}</td>
                    <td><span className="badge">{e.status}</span></td>
                    <td>
                      {paymentStatus ? (
                        <span className={`badge ${paymentStatus === 'Paid' ? 'paid' : 'pending'}`}>
                          {paymentStatus}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      <button className="del-btn" onClick={() => deleteEnrollment(e.enrollmentId)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* MY BOOKINGS TAB */}
        {tab === 'my-bookings' && (
          <table className="data-table">
            <thead><tr><th>Court</th><th>Date</th><th>From</th><th>To</th><th>Action</th></tr></thead>
            <tbody>{myBookings.map(b => (
              <tr key={b.bookingId}>
                <td>{b.court?.location}</td>
                <td>{b.bookingDate}</td>
                <td>{b.startTime}</td>
                <td>{b.endTime}</td>
                <td><button className="del-btn" onClick={() => deleteBooking(b.bookingId)}>Cancel</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {/* MY PAYMENTS TAB */}
        {tab === 'my-payments' && (
          <table className="data-table">
            <thead><tr><th>Course</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>{myPayments.map(p => (
              <tr key={p.paymentId}>
                <td>{p.course?.sport?.sportName}</td>
                <td>₹{p.amount}</td>
                <td>{p.paymentDate}</td>
                <td>
                  <span className={`badge ${p.status === 'Paid' ? 'paid' : 'pending'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {/* ACHIEVEMENTS TAB */}
        {tab === 'achievements' && (
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

        {/* PERFORMANCE TAB */}
        {tab === 'performance' && (
          performances.length === 0
            ? <p style={{ color: '#888', padding: '1rem' }}>No performance records yet. Enroll in a course to get started!</p>
            : <table className="data-table">
                <thead>
                  <tr>
                    <th>Sport</th>
                    <th>Matches Played</th>
                    <th>Wins</th>
                    <th>Runs / Points (Cricket)</th>
                    <th>Wickets / Sets (Cricket/Badminton)</th>
                    <th>Catches / Assists+Reb (Cricket/Basketball)</th>
                    <th>Points (Badminton/Basketball)</th>
                    <th>Sets / Assists+Reb</th>
                  </tr>
                </thead>
                <tbody>
                  {performances.map(p => {
                    const sport = p.sport?.sportName?.toUpperCase();
                    return (
                      <tr key={p.performanceId}>
                        <td><strong>{p.sport?.sportName}</strong></td>
                        <td>{p.matchesPlayed ?? '—'}</td>
                        <td>{p.wins ?? '—'}</td>
                        {sport === 'CRICKET' && (
                          <>
                            <td>{p.runsScored ?? '—'} runs</td>
                            <td>{p.wicketsTaken ?? '—'} wkts</td>
                            <td>{p.catchesTaken ?? '—'} catches</td>
                            <td>—</td>
                            <td>—</td>
                          </>
                        )}
                        {sport === 'BADMINTON' && (
                          <>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>{p.pointsScored ?? '—'} pts</td>
                            <td>{p.setsWon ?? '—'} sets</td>
                          </>
                        )}
                        {sport === 'BASKETBALL' && (
                          <>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td>{p.pointsScoredBasketball ?? '—'} pts</td>
                            <td>{p.assists ?? '—'} ast / {p.rebounds ?? '—'} reb</td>
                          </>
                        )}
                        {sport !== 'CRICKET' && sport !== 'BADMINTON' && sport !== 'BASKETBALL' && (
                          <><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
        )}

      </div>
    </div>
  );
}