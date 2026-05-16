import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const MEDICINES_FILE = path.join(DATA_DIR, 'medicines.json');

export interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  lastVisitDate: string;
  visits: Visit[];
}

export interface Prescription {
  medicine: string;
  instructions: string;
}

export interface Visit {
  id: string;
  date: string;
  complaints: string;
  diagnosis: string;
  treatment: string;
  medicines: Prescription[];
  nextFollowUpDate: string;
}

export async function readPatients(): Promise<Patient[]> {
  try {
    const data = await fs.readFile(PATIENTS_FILE, 'utf8');
    return JSON.parse(data).patients;
  } catch (error) {
    console.error('Error reading patients:', error);
    return [];
  }
}

export async function writePatients(patients: Patient[]): Promise<void> {
  await fs.writeFile(PATIENTS_FILE, JSON.stringify({ patients }, null, 2), 'utf8');
}

export async function readMedicines(): Promise<string[]> {
  try {
    const data = await fs.readFile(MEDICINES_FILE, 'utf8');
    return JSON.parse(data).medicines;
  } catch (error) {
    console.error('Error reading medicines:', error);
    return [];
  }
}

export async function writeMedicines(medicines: string[]): Promise<void> {
  await fs.writeFile(MEDICINES_FILE, JSON.stringify({ medicines }, null, 2), 'utf8');
}

export async function getNextPatientId(): Promise<string> {
  const patients = await readPatients();
  if (patients.length === 0) return 'PID-001';
  
  const lastId = patients[patients.length - 1].id;
  const lastNum = parseInt(lastId.split('-')[1], 10);
  return `PID-${String(lastNum + 1).padStart(3, '0')}`;
}
