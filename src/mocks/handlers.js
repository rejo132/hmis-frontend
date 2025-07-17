import { http, passthrough } from 'msw';

// Mock data
let patients = [
  { id: 1, name: 'John Doe', dob: '1990-01-01', contact: '1234567890', address: '123 Main St', medical_history: 'None', allergies: 'None' },
];
let appointments = [
  { id: 1, patient_id: '1', appointment_time: '2025-07-17T10:00', status: 'Scheduled' },
];
let records = [
  { id: 1, patient_id: '1', diagnosis: 'Flu', vital_signs: 'Normal', prescription: '' },
];
let bills = [
  { id: 1, patient_id: '1', amount: '100', description: 'Consultation', payment_status: 'Pending' },
];
let labOrders = [
  { id: 1, patient_id: '1', test_type: 'Blood Test', status: 'Ordered', sample_collected: false, results: null },
];
let radiologyOrders = [
  { id: 1, patient_id: '1', imaging_type: 'X-Ray', status: 'Ordered', report: null, scan_url: null },
];
let beds = [
  { id: 1, ward: 'General', status: 'Available', patient_id: null },
];
let assets = [
  { id: 1, name: 'MRI Machine', status: 'In Use', maintenance_date: '2025-12-01' },
];
let inventory = [
  { id: 1, name: 'Syringes', quantity: 100, reorder_level: 20, vendor: 'MediCorp', expiry: '2026-12-31' },
];
let employees = [
  { id: 1, name: 'Dr. Smith', role: 'Doctor', schedule: 'Mon-Fri 9-5', salary: 5000 },
];
let auditLogs = [
  { id: 1, user_id: 'admin', action: 'Login', timestamp: '2025-07-17T10:00:00Z' },
];
let vitals = [
  { id: 1, patient_id: '1', heart_rate: 72, blood_pressure: '120/80', temperature: 36.6, timestamp: '2025-07-17T10:00:00Z', recorded_by: 'nurse' },
];
let medications = [
  { id: 1, patient_id: '1', medication: 'Paracetamol', dosage: '500mg', time: '2025-07-17T10:00:00Z', administered_by: 'nurse' },
];
let shifts = [
  { id: 1, nurse_id: 'nurse1', date: '2025-07-17', time: '08:00-16:00', tasks: ['Monitor vitals', 'Administer meds'], created_by: 'admin' },
];
let labSamples = [
  { id: 1, lab_order_id: '1', sample_type: 'Blood', collection_time: '2025-07-17T10:00:00Z', status: 'Collected', collected_by: 'lab' },
];
let settings = [
  { hospital_name: 'General Hospital', timezone: 'UTC', updated_by: 'admin' },
];
let userRoles = [
  { id: 1, username: 'admin', role: 'Admin', permissions: ['all'] },
];
let securityLogs = [
  { id: 1, event: 'Login attempt', user: 'admin', status: 'Success', timestamp: '2025-07-17T10:00:00Z' },
];
let financeExpenses = [
  { id: 1, description: 'Equipment purchase', amount: 5000, date: '2025-07-17', recorded_by: 'accountant' },
];
let financeReimbursements = [
  { id: 1, claim_id: 'claim123', amount: 1000, status: 'Approved' },
];
let financePayroll = [
  { id: 1, employee: 'Dr. Smith', amount: 5000, date: '2025-07-17' },
];
let messages = [
  { id: 1, sender: 'admin', recipient: 'doctor', content: 'Patient update', timestamp: '2025-07-17T10:00:00Z' },
];

export const handlers = [
  // Passthrough for root URL and static assets
  http.get('http://localhost:3000/*', () => {
    console.log('Passthrough request to http://localhost:3000/*');
    return passthrough();
  }),

  // Login
  http.post('http://localhost:5000/login', async ({ request }) => {
    const { username, password } = await request.json();
    console.log('Login request:', JSON.stringify({ username, password }, null, 2));
    const users = [
      { username: 'admin', password: 'admin123', role: 'Admin', token: 'mock-admin-token' },
      { username: 'doctor', password: 'doctor123', role: 'Doctor', token: 'mock-doctor-token' },
      { username: 'nurse', password: 'nurse123', role: 'Nurse', token: 'mock-nurse-token' },
      { username: 'lab', password: 'lab123', role: 'Lab', token: 'mock-lab-token' },
      { username: 'patient', password: 'patient123', role: 'Patient', token: 'mock-patient-token' },
      { username: 'pharmacist', password: 'pharma123', role: 'Pharmacist', token: 'mock-pharma-token' },
      { username: 'receptionist', password: 'recep123', role: 'Receptionist', token: 'mock-recep-token' },
      { username: 'billing', password: 'bill123', role: 'Billing', token: 'mock-bill-token' },
      { username: 'it', password: 'it123', role: 'IT', token: 'mock-it-token' },
      { username: 'accountant', password: 'acc123', role: 'Accountant', token: 'mock-acc-token' },
    ];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return new Response(
        JSON.stringify({
          access_token: user.token,
          user: { username, role: user.role },
        }),
        { status: 200 }
      );
    }
    return new Response(
      JSON.stringify({ message: 'Invalid credentials' }),
      { status: 401 }
    );
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
        patients,
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
    const patient = { id: patients.length + 1, ...patientData };
    patients.push(patient);
    auditLogs.push({ id: auditLogs.length + 1, user_id: patientData.registeredBy || 'unknown', action: 'Patient created', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(patient),
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
    const index = patients.findIndex((p) => p.id === parseInt(id));
    if (index !== -1) {
      patients[index] = { id: parseInt(id), ...patientData };
      auditLogs.push({ id: auditLogs.length + 1, user_id: patientData.updatedBy || 'unknown', action: 'Patient updated', timestamp: new Date().toISOString() });
      return new Response(
        JSON.stringify(patients[index]),
        { status: 200 }
      );
    }
    return new Response(
      JSON.stringify({ message: 'Patient not found' }),
      { status: 404 }
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
        appointments,
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
    const appointment = { id: appointments.length + 1, ...appointmentData, status: 'Scheduled' };
    appointments.push(appointment);
    auditLogs.push({ id: auditLogs.length + 1, user_id: appointmentData.createdBy || 'unknown', action: 'Appointment created', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(appointment),
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
        records,
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
    const record = { id: records.length + 1, ...recordData };
    records.push(record);
    auditLogs.push({ id: auditLogs.length + 1, user_id: recordData.createdBy || 'unknown', action: 'Record created', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(record),
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
        bills,
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
    const bill = { id: bills.length + 1, ...billData, payment_status: 'Pending' };
    bills.push(bill);
    auditLogs.push({ id: auditLogs.length + 1, user_id: billData.createdBy || 'unknown', action: 'Bill created', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(bill),
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
    const index = bills.findIndex((b) => b.id === parseInt(id));
    if (index !== -1) {
      bills[index] = { ...bills[index], payment_status };
      auditLogs.push({ id: auditLogs.length + 1, user_id: 'unknown', action: 'Bill updated', timestamp: new Date().toISOString() });
      return new Response(
        JSON.stringify(bills[index]),
        { status: 200 }
      );
    }
    return new Response(
      JSON.stringify({ message: 'Bill not found' }),
      { status: 404 }
    );
  }),
  http.post('http://localhost:5000/bills/refunds', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const refundData = await request.json();
    console.log('POST /bills/refunds request, Authorization:', authHeader, 'Data:', JSON.stringify(refundData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    auditLogs.push({ id: auditLogs.length + 1, user_id: refundData.processedBy || 'unknown', action: 'Refund processed', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify({ message: 'Refund processed', bill_id: refundData.billId }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/bills/claims', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const claimData = await request.json();
    console.log('POST /bills/claims request, Authorization:', authHeader, 'Data:', JSON.stringify(claimData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const claim = { id: financeReimbursements.length + 1, ...claimData, status: 'Submitted' };
    financeReimbursements.push(claim);
    auditLogs.push({ id: auditLogs.length + 1, user_id: claimData.processedBy || 'unknown', action: 'Insurance claim submitted', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify({ message: 'Insurance claim submitted', claim_id: claim.id }),
      { status: 200 }
    );
  }),

  // Lab Orders
  http.get('http://localhost:5000/lab-orders', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /lab-orders request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        labOrders,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/lab-orders', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const labOrderData = await request.json();
    console.log('POST /lab-orders request, Authorization:', authHeader, 'Data:', JSON.stringify(labOrderData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const labOrder = { id: labOrders.length + 1, ...labOrderData, sample_collected: false, results: null };
    labOrders.push(labOrder);
    auditLogs.push({ id: auditLogs.length + 1, user_id: labOrderData.createdBy || 'unknown', action: 'Lab order created', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(labOrder),
      { status: 201 }
    );
  }),

  // Lab Samples
  http.get('http://localhost:5000/lab-samples', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /lab-samples request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        labSamples,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/lab-samples', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const sampleData = await request.json();
    console.log('POST /lab-samples request, Authorization:', authHeader, 'Data:', JSON.stringify(sampleData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const sample = { id: labSamples.length + 1, ...sampleData };
    labSamples.push(sample);
    auditLogs.push({ id: auditLogs.length + 1, user_id: sampleData.collectedBy || 'unknown', action: 'Lab sample recorded', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(sample),
      { status: 201 }
    );
  }),

  // Radiology Orders
  http.get('http://localhost:5000/radiology', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /radiology request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        radiologyOrders,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/radiology', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const radiologyData = await request.json();
    console.log('POST /radiology request, Authorization:', authHeader, 'Data:', JSON.stringify(radiologyData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const radiologyOrder = { id: radiologyOrders.length + 1, ...radiologyData, report: null, scan_url: null };
    radiologyOrders.push(radiologyOrder);
    auditLogs.push({ id: auditLogs.length + 1, user_id: radiologyData.createdBy || 'unknown', action: 'Radiology order created', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(radiologyOrder),
      { status: 201 }
    );
  }),

  // Beds
  http.get('http://localhost:5000/beds', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /beds request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        beds,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/beds', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const bedData = await request.json();
    console.log('POST /beds request, Authorization:', authHeader, 'Data:', JSON.stringify(bedData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const bed = { id: beds.length + 1, ...bedData };
    beds.push(bed);
    auditLogs.push({ id: auditLogs.length + 1, user_id: bedData.createdBy || 'unknown', action: 'Bed added', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(bed),
      { status: 201 }
    );
  }),

  // Assets
  http.get('http://localhost:5000/assets', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /assets request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        assets,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/assets', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const assetData = await request.json();
    console.log('POST /assets request, Authorization:', authHeader, 'Data:', JSON.stringify(assetData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const asset = { id: assets.length + 1, ...assetData };
    assets.push(asset);
    auditLogs.push({ id: auditLogs.length + 1, user_id: assetData.createdBy || 'unknown', action: 'Asset added', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(asset),
      { status: 201 }
    );
  }),

  // Inventory
  http.get('http://localhost:5000/inventory', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /inventory request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        inventory,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/inventory', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const inventoryData = await request.json();
    console.log('POST /inventory request, Authorization:', authHeader, 'Data:', JSON.stringify(inventoryData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const item = { id: inventory.length + 1, ...inventoryData };
    inventory.push(item);
    auditLogs.push({ id: auditLogs.length + 1, user_id: inventoryData.createdBy || 'unknown', action: 'Inventory item added', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(item),
      { status: 201 }
    );
  }),
  http.post('http://localhost:5000/inventory/dispense', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const dispenseData = await request.json();
    console.log('POST /inventory/dispense request, Authorization:', authHeader, 'Data:', JSON.stringify(dispenseData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const index = inventory.findIndex((i) => i.id === parseInt(dispenseData.itemId));
    if (index !== -1 && inventory[index].quantity >= dispenseData.quantity) {
      inventory[index].quantity -= dispenseData.quantity;
      auditLogs.push({ id: auditLogs.length + 1, user_id: dispenseData.dispensedBy || 'unknown', action: 'Medication dispensed', timestamp: new Date().toISOString() });
      return new Response(
        JSON.stringify({ message: 'Dispensed successfully', itemId: dispenseData.itemId }),
        { status: 200 }
      );
    }
    return new Response(
      JSON.stringify({ message: 'Insufficient quantity or item not found' }),
      { status: 400 }
    );
  }),

  // Employees
  http.get('http://localhost:5000/employees', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /employees request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        employees,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/employees', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const employeeData = await request.json();
    console.log('POST /employees request, Authorization:', authHeader, 'Data:', JSON.stringify(employeeData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const employee = { id: employees.length + 1, ...employeeData };
    employees.push(employee);
    auditLogs.push({ id: auditLogs.length + 1, user_id: employeeData.createdBy || 'unknown', action: 'Employee added', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(employee),
      { status: 201 }
    );
  }),

  // Vitals
  http.get('http://localhost:5000/vitals', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /vitals request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        vitals,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/vitals', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const vitalData = await request.json();
    console.log('POST /vitals request, Authorization:', authHeader, 'Data:', JSON.stringify(vitalData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const vital = { id: vitals.length + 1, ...vitalData };
    vitals.push(vital);
    auditLogs.push({ id: auditLogs.length + 1, user_id: vitalData.recordedBy || 'unknown', action: 'Vitals recorded', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(vital),
      { status: 201 }
    );
  }),

  // Medications
  http.get('http://localhost:5000/medications', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /medications request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        medications,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/medications', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const medicationData = await request.json();
    console.log('POST /medications request, Authorization:', authHeader, 'Data:', JSON.stringify(medicationData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const medication = { id: medications.length + 1, ...medicationData };
    medications.push(medication);
    auditLogs.push({ id: auditLogs.length + 1, user_id: medicationData.administeredBy || 'unknown', action: 'Medication recorded', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(medication),
      { status: 201 }
    );
  }),

  // Shifts
  http.get('http://localhost:5000/shifts', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /shifts request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        shifts,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/shifts', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const shiftData = await request.json();
    console.log('POST /shifts request, Authorization:', authHeader, 'Data:', JSON.stringify(shiftData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const shift = { id: shifts.length + 1, ...shiftData };
    shifts.push(shift);
    auditLogs.push({ id: auditLogs.length + 1, user_id: shiftData.createdBy || 'unknown', action: 'Shift created', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(shift),
      { status: 201 }
    );
  }),

  // Audit Logs
  http.get('http://localhost:5000/audit-logs', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /audit-logs request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        auditLogs,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),

  // Settings
  http.get('http://localhost:5000/settings', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /settings request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify(settings[0]),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/settings', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const settingsData = await request.json();
    console.log('POST /settings request, Authorization:', authHeader, 'Data:', JSON.stringify(settingsData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    settings[0] = { ...settings[0], ...settingsData };
    auditLogs.push({ id: auditLogs.length + 1, user_id: settingsData.updatedBy || 'unknown', action: 'Settings updated', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify({ message: 'Settings updated', ...settings[0] }),
      { status: 200 }
    );
  }),

  // User Roles
  http.get('http://localhost:5000/users/roles', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /users/roles request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        userRoles,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/users/roles', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const roleData = await request.json();
    console.log('POST /users/roles request, Authorization:', authHeader, 'Data:', JSON.stringify(roleData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const role = { id: userRoles.length + 1, ...roleData };
    userRoles.push(role);
    auditLogs.push({ id: auditLogs.length + 1, user_id: roleData.updatedBy || 'unknown', action: 'User role updated', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify({ message: 'Role updated', ...role }),
      { status: 201 }
    );
  }),

  // Security Logs
  http.get('http://localhost:5000/security-logs', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /security-logs request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        securityLogs,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),

  // Finance
  http.get('http://localhost:5000/finance/expenses', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /finance/expenses request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        financeExpenses,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.get('http://localhost:5000/finance/reimbursements', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /finance/reimbursements request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        financeReimbursements,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.get('http://localhost:5000/finance/payroll', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /finance/payroll request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        financePayroll,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/finance/expenses', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const expenseData = await request.json();
    console.log('POST /finance/expenses request, Authorization:', authHeader, 'Data:', JSON.stringify(expenseData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const expense = { id: financeExpenses.length + 1, ...expenseData };
    financeExpenses.push(expense);
    auditLogs.push({ id: auditLogs.length + 1, user_id: expenseData.recordedBy || 'unknown', action: 'Expense recorded', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(expense),
      { status: 201 }
    );
  }),

  // Messages
  http.get('http://localhost:5000/messages', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('GET /messages request, Authorization:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    return new Response(
      JSON.stringify({
        messages,
        page: 1,
        pages: 1,
      }),
      { status: 200 }
    );
  }),
  http.post('http://localhost:5000/messages', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const messageData = await request.json();
    console.log('POST /messages request, Authorization:', authHeader, 'Data:', JSON.stringify(messageData, null, 2));
    if (!authHeader || !authHeader.startsWith('Bearer mock')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    const message = { id: messages.length + 1, ...messageData, timestamp: new Date().toISOString() };
    messages.push(message);
    auditLogs.push({ id: auditLogs.length + 1, user_id: messageData.sender || 'unknown', action: 'Message sent', timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify(message),
      { status: 201 }
    );
  }),

  // Fallback for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url} with headers:`, request.headers);
    return new Response(
      JSON.stringify({ message: `No handler for ${request.method} ${request.url}` }),
      { status: 404 }
    );
  }),
];