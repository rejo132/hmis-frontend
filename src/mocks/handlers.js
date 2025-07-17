import { http } from 'msw';

export const handlers = [
  // Login
  http.post('http://localhost:5000/login', async ({ request }) => {
    const { username, password } = await request.json();
    console.log('Login request:', JSON.stringify({ username, password }, null, 2));
    if (username === 'admin' && password === 'admin123') {
      return new Response(
        JSON.stringify({
          access_token: 'mock-admin-token',
          user: { username, role: 'Admin' },
        }),
        { status: 200 }
      );
    } else if (username === 'doctor' && password === 'doctor123') {
      return new Response(
        JSON.stringify({
          access_token: 'mock-doctor-token',
          user: { username, role: 'Doctor' },
        }),
        { status: 200 }
      );
    } else if (username === 'nurse' && password === 'nurse123') {
      return new Response(
        JSON.stringify({
          access_token: 'mock-nurse-token',
          user: { username, role: 'Nurse' },
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 401 }
      );
    }
  }),

  // Patients
  http.get('http://localhost:5000/patients', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /patients request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        patients: [
          {
            id: 1,
            name: 'John Doe',
            dob: '1990-01-01',
            contact: '1234567890',
            address: '123 Main St',
            medical_history: 'None',
            allergies: 'None',
          },
        ],
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/patients', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const patientData = await request.json();
    console.log('POST /patients request, Authorization:', authHeader, 'Data:', JSON.stringify(patientData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({ id: 2, ...patientData }),
      { status: 201 }
    );
  }),
  http.put('http://localhost:5000/patients/:id', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    const { id } = params;
    const patientData = await request.json();
    console.log('PUT /patients/:id request, Authorization:', authHeader, 'Data:', JSON.stringify({ id, ...patientData }, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({ id, ...patientData }),
      { status: 200 }
    );
  }),

  // Appointments
  http.get('http://localhost:5000/appointments', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /appointments request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        appointments: [{ id: 1, patient_id: '1', appointment_time: '2025-07-17T10:00', status: 'Scheduled' }],
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/appointments', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const appointmentData = await request.json();
    console.log('POST /appointments request, Authorization:', authHeader, 'Data:', JSON.stringify(appointmentData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({ id: 2, ...appointmentData, status: 'Scheduled' }),
      { status: 201 }
    );
  }),

  // Records
  http.get('http://localhost:5000/records', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /records request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        records: [{ id: 1, patient_id: '1', diagnosis: 'Flu', vital_signs: 'Normal', prescription: '' }],
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/records', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const recordData = await request.json();
    console.log('POST /records request, Authorization:', authHeader, 'Data:', JSON.stringify(recordData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({ id: 2, ...recordData }),
      { status: 201 }
    );
  }),

  // Bills
  http.get('http://localhost:5000/bills', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /bills request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        bills: [{ id: 1, patient_id: '1', amount: '100', description: 'Consultation', payment_status: 'Pending' }],
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/bills', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const billData = await request.json();
    console.log('POST /bills request, Authorization:', authHeader, 'Data:', JSON.stringify(billData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({ id: 2, ...billData, payment_status: 'Pending' }),
      { status: 201 }
    );
  }),
  http.put('http://localhost:5000/bills/:id', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    const { id } = params;
    const { payment_status } = await request.json();
    console.log('PUT /bills/:id request, Authorization:', authHeader, 'Data:', JSON.stringify({ id, payment_status }, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({ id, payment_status }),
      { status: 200 }
    );
  }),

  // Fallback for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return new Response(
      JSON.stringify({ message: 'No handler for this request' }),
      { status: 404 }
    );
  }),
];