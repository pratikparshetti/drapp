import { NextResponse } from 'next/server';
import { readPatients, writePatients, Patient, getNextPatientId } from '@/lib/storage';

export async function GET() {
  const patients = await readPatients();
  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  const data = await request.json();
  console.log('[POST /api/patients] Raw request data:', JSON.stringify(data, null, 2));

  const patients = await readPatients();
  console.log('[POST /api/patients] Current patient count:', patients.length);

  const id = await getNextPatientId();
  const today = new Date().toISOString().split('T')[0];

  const newPatient: Patient = {
    id,
    name: data.name,
    age: data.age,
    gender: data.gender,
    lastVisitDate: '', // No visit yet
    visits: [],        // Start with empty history
  };
  console.log('[POST /api/patients] New patient object:', JSON.stringify(newPatient, null, 2));

  patients.push(newPatient);
  await writePatients(patients);
  console.log('[POST /api/patients] Patient saved successfully. Total patients:', patients.length);

  return NextResponse.json(newPatient);
}
