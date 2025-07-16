import { rest } from 'msw';

let patients = [
  { id: 1, name: 'John Doe', dob: '1990-01-01', contact: '1234567890', address: '', medical_history: '', allergies: '' },
  { id: 2, name: 'Jane Smith', dob: '1985-05-15', contact: '0987654321', address: '', medical_history: '', allergies: '' },
];
let appointments = [
  { id: 1, patient_id: '1', patient_name: 'John Doe', appointment_time: '2025-07-17T10:00', status: 'Scheduled' },
];
let bills = [
  { id: 1, patient_id: '1', patient_name: 'John Doe', amount: '100', description: 'Consultation', payment_status: 'Pending' },
];
let records = [
  { id: 1, patient_id: '1', patient_name: 'John Doe', diagnosis: 'Flu', prescription: 'Rest', vital_signs: 'Normal' },
];

export const handlers = [
  rest.post('http://localhost:5000/api/login', (req, res, ctx) => {
    const { username, password } = req.body;
    console.log('Login request:', { username, password }); // Debug log
    if (username === 'admin' && password === 'admin123') {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.json({
          access_token: 'mock-admin-token',
          user: { username: 'admin', role: 'Admin' },
        })
      );
    }
    if (username === 'doctor' && password === 'doctor123') {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.json({
          access_token: 'mock-doctor-token',
          user: { username: 'doctor', role: 'Doctor' },
        })
      );
    }
    if (username === 'nurse' && password === 'nurse123') {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.json({
          access_token: 'mock-nurse-token',
          user: { username: 'nurse', role: 'Nurse' },
        })
      );
    }
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.status(401),
      ctx.json({ message: 'Invalid credentials' })
    );
  }),
  rest.get('http://localhost:5000/api/patients', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1', 10);
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json({
        patients: patients.slice(start, end),
        page,
        pages: Math.ceil(patients.length / perPage),
      })
    );
  }),
  rest.post('http://localhost:5000/api/patients', (req, res, ctx) => {
    const newPatient = { id: patients.length + 1, ...req.body };
    patients.push(newPatient);
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json(newPatient)
    );
  }),
  rest.put('http://localhost:5000/api/patients/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id, 10);
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.status(404),
        ctx.json({ message: 'Patient not found' })
      );
    }
    patients[index] = { id, ...req.body };
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json(patients[index])
    );
  }),
  rest.get('http://localhost:5000/api/appointments', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1', 10);
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json({
        appointments: appointments.slice(start, end),
        page,
        pages: Math.ceil(appointments.length / perPage),
      })
    );
  }),
  rest.post('http://localhost:5000/api/appointments', (req, res, ctx) => {
    const { patient_id, appointment_time, status } = req.body;
    const patient = patients.find((p) => p.id === parseInt(patient_id));
    if (!patient) {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.status(404),
        ctx.json({ message: 'Patient not found' })
      );
    }
    const newAppointment = {
      id: appointments.length + 1,
      patient_id,
      patient_name: patient.name,
      appointment_time,
      status: status || 'Scheduled',
    };
    appointments.push(newAppointment);
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json(newAppointment)
    );
  }),
  rest.get('http://localhost:5000/api/bills', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1', 10);
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json({
        bills: bills.slice(start, end),
        page,
        pages: Math.ceil(bills.length / perPage),
      })
    );
  }),
  rest.post('http://localhost:5000/api/bills', (req, res, ctx) => {
    const { patient_id, amount, description, payment_status } = req.body;
    const patient = patients.find((p) => p.id === parseInt(patient_id));
    if (!patient) {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.status(404),
        ctx.json({ message: 'Patient not found' })
      );
    }
    const newBill = {
      id: bills.length + 1,
      patient_id,
      patient_name: patient.name,
      amount,
      description,
      payment_status: payment_status || 'Pending',
    };
    bills.push(newBill);
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json(newBill)
    );
  }),
  rest.put('http://localhost:5000/api/bills/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id, 10);
    const { payment_status } = req.body;
    const index = bills.findIndex((b) => b.id === id);
    if (index === -1) {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.status(404),
        ctx.json({ message: 'Bill not found' })
      );
    }
    bills[index] = { ...bills[index], payment_status };
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json(bills[index])
    );
  }),
  rest.get('http://localhost:5000/api/records', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer mock-')) {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.status(401),
        ctx.json({ message: 'Unauthorized' })
      );
    }
    const page = parseInt(req.url.searchParams.get('page') || '1', 10);
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json({
        records: records.slice(start, end),
        page,
        pages: Math.ceil(records.length / perPage),
      })
    );
  }),
  rest.post('http://localhost:5000/api/records', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer mock-')) {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.status(401),
        ctx.json({ message: 'Unauthorized' })
      );
    }
    const { patient_id, diagnosis, prescription, vital_signs } = req.body;
    const patient = patients.find((p) => p.id === parseInt(patient_id));
    if (!patient) {
      return res(
        ctx.set('Access-Control-Allow-Origin', '*'),
        ctx.status(404),
        ctx.json({ message: 'Patient not found' })
      );
    }
    const newRecord = {
      id: records.length + 1,
      patient_id,
      patient_name: patient.name,
      diagnosis,
      prescription,
      vital_signs,
    };
    records.push(newRecord);
    return res(
      ctx.set('Access-Control-Allow-Origin', '*'),
      ctx.json(newRecord)
    );
  }),
];