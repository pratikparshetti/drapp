'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<string[]>([]);
  const [newMedicine, setNewMedicine] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const res = await fetch('/api/medicines');
        const data = await res.json();
        if (Array.isArray(data)) {
          setMedicines(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMedicines();
  }, []);

  const handleAdd = () => {
    const trimmed = newMedicine.trim();
    if (trimmed && !medicines.some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      setMedicines([...medicines, trimmed].sort((a, b) => a.localeCompare(b)));
      setNewMedicine('');
    }
  };

  const handleRemove = (medicineToRemove: string) => {
    setMedicines(medicines.filter(m => m !== medicineToRemove));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicines }),
      });
      if (res.ok) {
        setMessage('Medicines updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update medicines.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <Link href="/" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1>Manage Medicines</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Update the list of available medicines for prescriptions</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {message && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: message.includes('success') ? '#e6f4ea' : '#fce8e6', color: message.includes('success') ? '#137333' : '#c5221f', borderRadius: '4px' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            type="text"
            className="input"
            style={{ flex: 1 }}
            placeholder="Type new medicine name..."
            value={newMedicine}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMedicine(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Add Medicine
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading medicines...</div>
        ) : (
          <div>
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1.5rem' }}>
              {medicines.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No medicines found. Add some above.
                </div>
              ) : (
                <table className="table" style={{ margin: 0 }}>
                  <tbody>
                    {medicines.map((medicine) => (
                      <tr key={medicine}>
                        <td style={{ fontWeight: 500 }}>{medicine}</td>
                        <td style={{ width: '80px', textAlign: 'right' }}>
                          <button 
                            className="btn btn-outline" 
                            style={{ color: '#d32f2f', borderColor: '#ffcdd2', padding: '0.25rem 0.5rem' }}
                            onClick={() => handleRemove(medicine)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleSave} 
                disabled={saving}
                style={{ minWidth: '120px' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
