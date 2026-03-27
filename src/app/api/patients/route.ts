import { NextResponse } from 'next/server';
import { readPatients, writePatients, Patient, getNextPatientId } from '@/lib/storage';

export async function GET() {
  const patients = await readPatients();
  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  const data = await request.json();
  const patients = await readPatients();

  const id = await getNextPatientId();
  const today = new Date().toISOString().split('T')[0];

  // Create initial visit from onboarding form data
  const visits = [];
  if (data.complaints || data.diagnosis || data.treatment) {
    visits.push({
      id: Math.random().toString(36).substring(2, 9),
      date: today,
      complaints: data.complaints || '',
      diagnosis: data.diagnosis || '',
      treatment: data.treatment || '',
      medicines: data.medicines || [],
      nextFollowUpDate: data.nextFollowUpDate || '',
    });
  }

  const newPatient: Patient = {
    id,
    name: data.name,
    age: data.age,
    gender: data.gender,
    lastVisitDate: today,
    visits,
  };

  patients.push(newPatient);
  await writePatients(patients);

  return NextResponse.json(newPatient);
}
