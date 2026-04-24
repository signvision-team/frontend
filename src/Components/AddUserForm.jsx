import React, { useState } from 'react';
import { UserPlus, Upload, ShieldAlert, HeartPulse } from 'lucide-react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Student profile created successfully!');
    setFormData({
      firstName: '', lastName: '', email: '', emergencyContact: '',
      classGrade: '', hearingLevel: '', password: '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="mb-8">
        <h1 className="admin-title">Register New Student</h1>
        <p className="admin-subtitle">Add a student to the accessibility program and set up their curriculum</p>
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
                <Upload size={16} /> {bulkImport ? "Single Entry" : "Bulk CSV Import"}
              </button>
            </div>

            {bulkImport ? (
              <div className="bulk-upload-zone">
                <Upload size={48} className="text-gray-500 mb-4" />
                <h3 className="text-white mb-2">Upload Student Roster</h3>
                <p className="text-gray-400 mb-6">Import multiple students at once using a CSV file.</p>
                <button className="btn-admin-primary">Select CSV File</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-grid">
                <div className="input-group-row">
                  <div className="input-field">
                    <label>First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="admin-input" placeholder="e.g. Sarah" />
                  </div>
                  <div className="input-field">
                    <label>Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="admin-input" placeholder="e.g. Johnson" />
                  </div>
                </div>

                <div className="input-field">
                  <label>Institutional Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="admin-input" placeholder="student@school.edu" />
                </div>

                <div className="input-field">
                  <label>Emergency Contact (Guardian Phone) *</label>
                  <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} required className="admin-input" placeholder="+1 (555) 000-0000" />
                </div>

                <div className="input-group-row">
                  <div className="input-field">
                    <label>Class / Grade *</label>
                    <select name="classGrade" value={formData.classGrade} onChange={handleInputChange} required className="admin-input">
                      <option value="">Select Grade</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                  </div>
                  <div className="input-field">
                    <label>Hearing Category *</label>
                    <select name="hearingLevel" value={formData.hearingLevel} onChange={handleInputChange} required className="admin-input">
                      <option value="">Select Category</option>
                      <option value="Deaf">Deaf</option>
                      <option value="Hard of Hearing">Hard of Hearing</option>
                      <option value="Cochlear Implant">Cochlear Implant</option>
                    </select>
                  </div>
                </div>

                <div className="input-field">
                  <label>Initial System Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="admin-input" placeholder="••••••••" />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-admin-primary flex-center gap-2">
                    <UserPlus size={18} /> Enroll Student
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="sidebar-column">
          <div className="info-card cyan-border">
            <h3 className="flex-center gap-2 text-cyan-400 mb-2"><HeartPulse size={18} /> Accessibility Note</h3>
            <p className="text-sm text-blue-200">Enrolling a student automatically enables visual-first feedback and skeletal tracking in their detection module.</p>
          </div>

          <div className="info-card red-border">
            <h3 className="flex-center gap-2 text-red-400 mb-2"><ShieldAlert size={18} /> Safety Protocol</h3>
            <p className="text-sm text-red-200">Ensure the Guardian Phone number is accurate for emergency notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}