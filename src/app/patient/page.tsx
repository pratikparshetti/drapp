'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Prescription {
  medicine: string;
  instructions: string;
}

interface Visit {
  id: string;
  date: string;
  complaints: string;
  diagnosis: string;
  treatment: string;
  medicines: Prescription[];
  nextFollowUpDate: string;
}

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  visits: Visit[];
}

function PatientDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('id');
  const isNew = !patientId;

  console.log('[DEBUG] PatientPage - patientId:', patientId, 'isNew:', isNew);


  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicinesList, setMedicinesList] = useState<string[]>([]);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [complaints, setComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{ medicine: '', instructions: '' }]);

  useEffect(() => {
    async function fetchData() {
      // Fetch medicines
      const medRes = await fetch('/api/medicines');
      const meds = await medRes.json();
      setMedicinesList(meds);

      if (patientId) {
        setLoading(true);
        try {
          const res = await fetch(`/api/patients/${patientId}`);
          if (res.ok) {
            const data = await res.json();
            setPatient(data);
            setPatientName(data.name);
            setPatientAge(data.age);
            setPatientGender(data.gender);
          } else {
            alert('Patient not found');
            router.push('/');
          }
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [patientId, router]);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: '', instructions: '' }]);
  };

  const updatePrescription = (index: number, field: keyof Prescription, value: string) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload;
      if (isNew) {
        payload = {
          name: patientName,
          age: patientAge,
          gender: patientGender,
        };
      } else {
        payload = {
          complaints,
          diagnosis,
          treatment,
          medicines: prescriptions.filter(p => p.medicine.trim() !== ''),
          nextFollowUpDate,
        };
      }

      let res;
      if (isNew) {
        res = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/patients/${patientId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(isNew ? 'Patient onboarded successfully!' : 'Visit recorded successfully!');
        router.push('/');
      } else {
        alert('Failed to save data. Check console.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !patient) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>{isNew ? 'New Patient Onboarding' : `Visit Records: ${patient?.name}`}</h1>
          {!isNew && <p className="badge">ID: {patientId}</p>}
        </div>
        <Link href="/" className="btn btn-outline">Back to List</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: patient?.visits?.length ? '1.5fr 1fr' : '1fr', gap: '2rem' }}>
        <form onSubmit={handleSubmit} className="card">
          <h3>Patient Basic Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text" className="input" value={patientName} onChange={e => setPatientName(e.target.value)}
                disabled={!isNew} required placeholder="Enter full name"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Age</label>
              <input
                type="number" className="input" value={patientAge} onChange={e => setPatientAge(e.target.value)}
                disabled={!isNew} required placeholder="Years"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Gender</label>
              <select
                className="input" value={patientGender} onChange={e => setPatientGender(e.target.value)}
                disabled={!isNew}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {!isNew && (
            <>
              <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

              <h3>Visit Information</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Complaints</label>
                <textarea
                  className="input" rows={2} value={complaints} onChange={e => setComplaints(e.target.value)}
                  placeholder="What is the patient experiencing?" required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Diagnosis</label>
                <textarea
                  className="input" rows={2} value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                  placeholder="What is the diagnosis?" required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Suggested Treatment</label>
                <textarea
                  className="input" rows={2} value={treatment} onChange={e => setTreatment(e.target.value)}
                  placeholder="Plan of action?" required
                />
              </div>

              <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Medicines / Prescription</h3>
                <button type="button" onClick={addPrescription} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}>+ Add Row</button>
              </div>

              {prescriptions.map((pres, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr auto', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Medicine Name</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        list="medicine-list"
                        className="input"
                        value={pres.medicine}
                        onChange={e => updatePrescription(idx, 'medicine', e.target.value)}
                        placeholder="Search or type name"
                      />
                      <datalist id="medicine-list">
                        {medicinesList.map(med => <option key={med} value={med} />)}
                      </datalist>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Instructions (e.g. 1-0-1 After Food)</label>
                    <input
                      type="text" className="input" value={pres.instructions}
                      onChange={e => updatePrescription(idx, 'instructions', e.target.value)}
                      placeholder="When to take?"
                    />
                  </div>
                  {prescriptions.length > 1 && (
                    <button
                      type="button" onClick={() => removePrescription(idx)}
                      className="btn btn-outline" style={{ color: 'var(--error-color)', padding: '0.4rem' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ width: '200px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Next Follow-up Date</label>
                  <input
                    type="date" className="input" value={nextFollowUpDate}
                    onChange={e => setNextFollowUpDate(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem 2rem' }}>
                  {loading ? 'Saving...' : 'Save Visit Record'}
                </button>
              </div>
            </>
          )}

          {isNew && (
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem 2rem' }}>
                {loading ? 'Saving...' : 'Complete Onboarding'}
              </button>
            </div>
          )}
        </form>

        {!isNew && patient && patient.visits.length > 0 && (
          <div className="card" style={{ height: 'fit-content' }}>
            <h3>Medical History</h3>
            <div style={{ marginTop: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
              {patient.visits.map((visit, idx) => (
                <div key={visit.id} style={{
                  borderLeft: '2px solid var(--accent-color)',
                  paddingLeft: '1.5rem',
                  paddingBottom: '2rem',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '12px', height: '12px', background: 'var(--accent-color)', borderRadius: '50%',
                    position: 'absolute', left: '-7px', top: '5px'
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{new Date(visit.date).toLocaleDateString()}</span>
                    {visit.nextFollowUpDate && <span className="badge">Follow-up: {new Date(visit.nextFollowUpDate).toLocaleDateString()}</span>}
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                    <p><strong>Complaints:</strong> {visit.complaints}</p>
                    <p><strong>Diagnosis:</strong> {visit.diagnosis}</p>
                    <p><strong>Medicines:</strong></p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                      {visit.medicines.map((m, i) => (
                        <li key={i}>{m.medicine} - <span style={{ color: 'var(--text-secondary)' }}>{m.instructions}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PatientPage() {
  return (
    <Suspense fallback={<div className="container">Loading patient dashboard...</div>}>
      <PatientDashboard />
    </Suspense>
  )
}
