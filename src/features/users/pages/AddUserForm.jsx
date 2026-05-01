import React, { useState } from 'react';
import { UserPlus, Upload, ShieldAlert, HeartPulse } from 'lucide-react';
import Papa from 'papaparse';
import { z } from 'zod';
import axios from 'axios';

/* ================= VALIDATION ================= */
const studentSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  emergencyContact: z.string().min(10),
  classGrade: z.string().nonempty(),
  hearingLevel: z.string().nonempty(),
  password: z.string().min(6),
});

/* ================= API ================= */
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // change to your backend
});

export function AddUserForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    emergencyContact: '',
    classGrade: '',
    hearingLevel: '',
    password: '',
  });

  const [bulkImport, setBulkImport] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= INPUT ================= */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SINGLE STUDENT SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = studentSchema.safeParse(formData);

    if (!validation.success) {
      alert(validation.error.errors[0].message);
      return;
    }

    try {
      setLoading(true);

      await API.post('/students', formData);

      alert('Student profile created successfully!');

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        emergencyContact: '',
        classGrade: '',
        hearingLevel: '',
        password: '',
      });

    } catch (err) {
      console.error(err);
      alert('Error creating student');
    } finally {
      setLoading(false);
    }
  };

  /* ================= CSV UPLOAD ================= */
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          setLoading(true);

          await API.post('/students/bulk', result.data);

          alert('Bulk upload successful!');
        } catch (err) {
          console.error(err);
          alert('Bulk upload failed');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  /* ================= UI ================= */
  return (
    <div className="admin-panel-wrapper">
      <div className="mb-8">
        <h1 className="admin-title">Register New Student</h1>
        <p className="admin-subtitle">
          Add a student to the accessibility program and set up their curriculum
        </p>
      </div>

      <div className="grid-layout">
        <div className="main-form-column">
          <div className="admin-card">

            <div className="flex-header">
              <h2 className="text-white">Student Enrollment Form</h2>

              <button
                onClick={() => setBulkImport(!bulkImport)}
                className="bulk-import-btn"
              >
                <Upload size={16} />
                {bulkImport ? "Single Entry" : "Bulk CSV Import"}
              </button>
            </div>

            {/* ================= BULK UPLOAD ================= */}
            {bulkImport ? (
              <div className="bulk-upload-zone">
                <Upload size={48} className="text-gray-500 mb-4" />
                <h3 className="text-white mb-2">Upload Student Roster</h3>
                <p className="text-gray-400 mb-6">
                  Import multiple students using CSV
                </p>

                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="btn-admin-primary"
                />
              </div>
            ) : (

              /* ================= FORM ================= */
              <form onSubmit={handleSubmit} className="form-grid">

                <div className="input-group-row">
                  <div className="input-field">
                    <label>First Name *</label>
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="admin-input" />
                  </div>

                  <div className="input-field">
                    <label>Last Name *</label>
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="admin-input" />
                  </div>
                </div>

                <div className="input-field">
                  <label>Email *</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} className="admin-input" />
                </div>

                <div className="input-field">
                  <label>Emergency Contact *</label>
                  <input name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className="admin-input" />
                </div>

                <div className="input-group-row">
                  <div className="input-field">
                    <label>Class</label>
                    <select name="classGrade" value={formData.classGrade} onChange={handleInputChange} className="admin-input">
                      <option value="">Select</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </div>

                  <div className="input-field">
                    <label>Hearing Level</label>
                    <select name="hearingLevel" value={formData.hearingLevel} onChange={handleInputChange} className="admin-input">
                      <option value="">Select</option>
                      <option value="Deaf">Deaf</option>
                      <option value="Hard of Hearing">Hard of Hearing</option>
                      <option value="Cochlear Implant">Cochlear Implant</option>
                    </select>
                  </div>
                </div>

                <div className="input-field">
                  <label>Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="admin-input" />
                </div>

                <div className="form-actions">
                  <button disabled={loading} type="submit" className="btn-admin-primary flex-center gap-2">
                    <UserPlus size={18} />
                    {loading ? "Processing..." : "Enroll Student"}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>

        {/* ================= SIDE INFO ================= */}
        <div className="sidebar-column">

          <div className="info-card cyan-border">
            <h3 className="flex-center gap-2 text-cyan-400 mb-2">
              <HeartPulse size={18} /> Accessibility Note
            </h3>
            <p className="text-sm text-blue-200">
              Visual-first learning system enabled automatically
            </p>
          </div>

          <div className="info-card red-border">
            <h3 className="flex-center gap-2 text-red-400 mb-2">
              <ShieldAlert size={18} /> Safety Protocol
            </h3>
            <p className="text-sm text-red-200">
              Ensure emergency contact is correct
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}