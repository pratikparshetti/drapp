import { NextResponse } from 'next/server';
import { readPatients, writePatients, Visit, Patient } from '@/lib/storage';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patients = await readPatients();
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const patients = await readPatients();
  const patientIndex = patients.findIndex(p => p.id === id);

  if (patientIndex === -1) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  const newVisit: Visit = {
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString().split('T')[0],
    complaints: data.complaints,
    diagnosis: data.diagnosis,
    treatment: data.treatment,
    medicines: data.medicines || [],
    nextFollowUpDate: data.nextFollowUpDate
  };

  patients[patientIndex].visits.unshift(newVisit); // Add latest visit to top
  patients[patientIndex].lastVisitDate = newVisit.date;
  
  await writePatients(patients);

  return NextResponse.json(newVisit);
}
