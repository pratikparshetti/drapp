'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  lastVisitDate: string;
}

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch('/api/patients');
        const data = await res.json();
        setPatients(data);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Patient Records</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and manage registered patients</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/medicines" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Manage Medicines
          </Link>
          <Link href="/patient" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            + New Patient
          </Link>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>🔍</span>
            <input 
              type="text" 
              className="input" 
              placeholder="Search by ID or Name..." 
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading records...</div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <p>No patients found. {search ? 'Try a different search term.' : 'Start by adding a new patient.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Last Visit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(p => (
                  <tr key={p.id}>
                    <td><span className="badge">{p.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.lastVisitDate ? new Date(p.lastVisitDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <Link href={`/patient?id=${p.id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }}>
                        View / Follow-up
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
