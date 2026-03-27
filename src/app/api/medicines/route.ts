import { NextResponse } from 'next/server';
import { readMedicines } from '@/lib/storage';

export async function GET() {
  const medicines = await readMedicines();
  return NextResponse.json(medicines);
}
