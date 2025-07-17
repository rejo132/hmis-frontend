import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { fetchAppointments } from '../slices/appointmentSlice';
import toast from 'react-hot-toast';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AppointmentsCalendar = () => {
  const dispatch = useDispatch();
  const { appointments, error } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchAppointments())
      .unwrap()
      .then(() => toast.success('Appointments Loaded'))
      .catch((err) => toast.error(`Failed to load appointments: ${err.message}`));
  }, [dispatch]);

  const events = appointments.map((appt) => ({
    id: appt.id,
    title: `Patient ID: ${appt.patient_id}, Status: ${appt.status}`,
    start: new Date(appt.appointment_time),
    end: new Date(appt.appointment_time),
  }));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Appointments Calendar</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        className="bg-white p-4 rounded-lg shadow"
      />
    </div>
  );
};

export default AppointmentsCalendar;