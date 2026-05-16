import { NextResponse } from 'next/server';
import { readMedicines, writeMedicines } from '@/lib/storage';

export async function GET() {
  const medicines = await readMedicines();
  return NextResponse.json(medicines);
}

export async function POST(request: Request) {
  try {
    const { medicines } = await request.json();
    if (!Array.isArray(medicines)) {
      return NextResponse.json({ error: 'Medicines must be an array' }, { status: 400 });
    }
    await writeMedicines(medicines);
    return NextResponse.json({ success: true, medicines });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update medicines' }, { status: 500 });
  }
}
