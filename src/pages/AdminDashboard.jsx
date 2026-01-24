import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
const [leadUsers, setLeadUsers] = useState([]);
const [totalLeads, setTotalLeads] = useState(0);

  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [interiors, setInteriors] = useState([]);
  const [interiorLoading, setInteriorLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingProperties: 0,
    totalUsers: 0,
    activeUsers: 0,
  });
  const [leads, setLeads] = useState([]);
  const [leadSummary, setLeadSummary] = useState([]);

  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReasons, setRejectReasons] = useState({});
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const createSlug = (title, location) =>
  `${title}-${location}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // ✅ DERIVED STATES - Clean separation of active vs trashed
  const activeProperties = properties.filter(p => p.status !== 'trashed');
  const trashedProperties = properties.filter(p => p.status === 'trashed');

  useEffect(() => {
  // ✅ Always fetch fresh data when switching tabs
  if (activeTab === 'properties' || activeTab === 'trash') {
    fetchProperties();
  } else if (activeTab === 'users') {
    fetchUsers();
  }
}, [activeTab]);

  const fetchProperties = async () => {
    console.log('📊 FETCH DEBUG - Fetching properties...');
    try {
      const token = localStorage.getItem('token');
      console.log('📊 FETCH DEBUG - Token found:', token ? 'Yes' : 'No');
      
      const fetchUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/properties`;
      console.log('📊 FETCH DEBUG - Fetch URL:', fetchUrl);
      
      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📊 FETCH DEBUG - Response status:', response.status);
      console.log('📊 FETCH DEBUG - Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 FETCH DEBUG - Properties received:', data.length);
        console.log('📊 FETCH DEBUG - Sample property:', data[0]);
        
        setProperties(data);

        setStats((prev) => ({
          ...prev,
          totalProperties: data.length,
          pendingProperties: data.filter((p) => p.status === 'pending').length,
        }));
      } else {
        const errorData = await response.text();
        console.error('📊 FETCH DEBUG - Failed to fetch properties:', response.status, errorData);
      }
    } catch (error) {
      console.error('📊 FETCH DEBUG - Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);

        setStats((prev) => ({
          ...prev,
          totalUsers: data.length,
          activeUsers: data.filter((u) => u.is_active).length,
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const fetchInteriors = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/interiors`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch interiors");
    }

    const data = await response.json();
    setInteriors(data);
  } catch (err) {
    console.error("Error fetching interiors:", err);
  } finally {
    setInteriorLoading(false);
  }
};

  const handlePropertyStatus = async (propertyId, status, reason = '') => {
    console.log('🔄 STATUS DEBUG - Updating property:', propertyId, 'to:', status, 'reason:', reason);
    try {
      const token = localStorage.getItem('token');
      console.log('🔄 STATUS DEBUG - Token found:', token ? 'Yes' : 'No');
      
      const statusUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/properties/${propertyId}/status`;
      console.log('🔄 STATUS DEBUG - Status URL:', statusUrl);
      
      const requestBody = { status, reason };
      console.log('🔄 STATUS DEBUG - Request body:', requestBody);
      
      const response = await fetch(statusUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🔄 STATUS DEBUG - Response status:', response.status);
      console.log('🔄 STATUS DEBUG - Response ok:', response.ok);

      if (response.ok) {
        console.log('🔄 STATUS DEBUG - Property status updated successfully');
        
        // Update local UI FIRST
        setProperties(prev =>
          prev.map(p =>
            p.id === propertyId
              ? { ...p, status, rejection_message: reason }
              : p
          )
        );

        // Clear textarea value
        setRejectReasons(prev => ({ ...prev, [propertyId]: '' }));

        // Close reject box AFTER UI update
        setTimeout(() => {
          setRejectingId(null);
        }, 300);

        alert(`✅ Property ${status} successfully!`);
      } else {
        const errorData = await response.text();
        console.error('🔄 STATUS DEBUG - Failed to update status:', response.status, errorData);
        alert(`❌ Status update failed: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('🔄 STATUS DEBUG - Error updating property status:', error);
      alert(`🔥 Network error: ${error.message}`);
    }
  };
 
const filteredLeads = search.trim()
  ? leads.filter((lead) => {
      const q = search.toLowerCase();

      return (
        lead.lead_name?.toLowerCase().includes(q) ||
        lead.lead_phone?.includes(q) ||
        lead.lead_email?.toLowerCase().includes(q) ||
        lead.owner_name?.toLowerCase().includes(q) ||
        lead.property_title?.toLowerCase().includes(q)
      );
    })
  : leads;



  const handleDeleteProperty = async (propertyId) => {
    // For safety, we will soft-delete (move to trash) by changing status to 'trashed'
    console.log('🗑️ TRASH DEBUG - Moving property to trash:', propertyId);
    if (!window.confirm('Move this property to Trash?')) return;
    try {
      await handlePropertyStatus(propertyId, 'trashed');
      alert('🗑️ Property moved to Trash');
    } catch (err) {
      console.error('🗑️ TRASH DEBUG - Error moving to trash:', err);
      alert('Failed to move property to trash');
    }
  };

  const handleRestoreFromTrash = async (propertyId) => {
    if (!window.confirm('Restore this property from Trash?')) return;
    try {
      await handlePropertyStatus(propertyId, 'pending');
      alert('♻️ Property restored from Trash');
    } catch (err) {
      console.error('♻️ RESTORE DEBUG - Error restoring:', err);
      alert('Failed to restore property');
    }
  };

  const handlePermanentlyDelete = async (propertyId) => {
    if (!window.confirm('Permanently delete this property? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const deleteUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/properties/${propertyId}`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        alert('✅ Property permanently deleted');
        fetchProperties();
      } else {
        const errText = await response.text();
        console.error('Permanent delete failed:', errText);
        alert('Failed to delete permanently');
      }
    } catch (err) {
      console.error('Permanent delete error:', err);
      alert('Network error while deleting permanently');
    }
  };

  // NEW: Handle user role changes
  const handleUserRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ));
        alert(`✅ User role updated to ${newRole}`);
      } else {
        const errText = await response.text();
        console.error('Role update failed:', errText);
        alert('Failed to update user role');
      }
    } catch (err) {
      console.error('Role update error:', err);
      alert('Network error while updating role');
    }
  };

  // Local deletion fallback
  const deletePropertyLocally = async (propertyId) => {
    try {
      console.log('Deleting property locally from state:', propertyId);
      
      // Remove from local state immediately
      setProperties(prev => prev.filter(property => property.id !== propertyId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalProperties: prev.totalProperties - 1,
        pendingProperties: prev.pendingProperties - 1
      }));
      
      alert('Property deleted locally (backend endpoint needs to be implemented)');
      console.log('Property removed from local state');
    } catch (error) {
      console.error('Error in local deletion:', error);
      alert('Failed to delete property locally');
    }
  };

  // Edit property functionality
  const handleEditProperty = (property) => {
    console.log('📝 EDIT DEBUG - Starting edit for property:', property.id);
    setEditingProperty(property);
    setEditForm({
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      transaction_type: property.transaction_type,
      property_type: property.property_type,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      rejection_message: property.rejection_message || '', // Keep for display only
      status: property.status
    });
    setShowEditModal(true);
  };

  // Accept either an id or a property object
  const handleSaveEdit = async (propertyArg) => {
    const propertyId = typeof propertyArg === 'object' && propertyArg !== null ? propertyArg.id : propertyArg;
    console.log('💾 SAVE DEBUG - Saving property:', propertyId, editForm);
    try {
      const token = localStorage.getItem('token');
      
      // Filter out rejection_message from PUT payload (handled by status API)
      const { rejection_message, ...cleanEditForm } = editForm;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanEditForm),
      });

      console.log('💾 SAVE DEBUG - Response status:', response.status);

      if (response.ok) {
        console.log('💾 SAVE DEBUG - Property updated successfully');
        setShowEditModal(false);
        setEditingProperty(null);
        setEditForm({});
        fetchProperties();
        alert('✅ Property updated successfully!');
      } else {
        const errorData = await response.text();
        console.error('💾 SAVE DEBUG - Failed to update:', response.status, errorData);
        alert(`❌ Update failed: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('💾 SAVE DEBUG - Error updating property:', error);
      alert(`🔥 Network error: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingProperty(null);
    setEditForm({});
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };
const updateInteriorStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/interiors/${id}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    // ✅ Update UI immediately
    setInteriors((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status } : i
      )
    );

    alert(`✅ Interior service ${status}`);
  } catch (error) {
    console.error("Interior status update failed:", error);
    alert("❌ Failed to update interior status");
  }
};

  // NEW: Smart admin edit save using PATCH endpoint
  const handleAdminEditSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        status: editForm.status,
        reason: editForm.rejection_message || "",
        title: editForm.title,
        price: editForm.price,
        location: editForm.location,
        transaction_type: editForm.transaction_type,
      };

      console.log('💾 SAVE DEBUG - Sending payload:', payload);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/properties/${editingProperty.id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      // ✅ Update UI immediately with rejection_message
      setProperties(prev =>
        prev.map(p =>
          p.id === editingProperty.id
            ? { ...p, ...payload, rejection_message: payload.reason }
            : p
        )
      );

      setShowEditModal(false);
      setEditingProperty(null);
      setEditForm({});

      alert("✅ Property updated successfully");
    } catch (err) {
      console.error("Edit save failed:", err);
      alert("❌ Failed to save changes");
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
    };
    return (
      <span className={`badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  const fetchLeads = async () => {
  try {
    const token = localStorage.getItem("token");

    const [leadsRes, summaryRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/leads/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    const leadsData = await leadsRes.json();
    const summaryData = await summaryRes.json();

    setLeads(leadsData);
    setLeadUsers(summaryData);
  } catch (err) {
    console.error("Failed to fetch leads:", err);
  }
};

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage properties, users, and system settings</p>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>{stats.totalProperties}</h3>
            <p>Total Properties</p>
          </div>
          <div className="stat-card warning">
            <h3>{stats.pendingProperties}</h3>
            <p>Pending Approval</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card success">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Properties Management
          </button>
          <button
            className={`tab-btn ${activeTab === 'trash' ? 'active' : ''}`}
            onClick={() => setActiveTab('trash')}
          >
            Trash Bin
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users Management
          </button>
          <button
            className={`tab-btn ${activeTab === "leads" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("leads");
              fetchLeads();
            }}
          >
            Leads Management
          </button>
          <button
            className={`tab-btn ${activeTab === 'interiors' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('interiors');
              fetchInteriors();
            }}
          >
            Interior Services
          </button>

        </div>

        <div className="admin-content">
          {activeTab === 'properties' && (
            <div className="properties-management">
              <h2>Property Approvals</h2>
              {loading ? (
                <div className="loading">Loading properties...</div>
              ) : (
                <div className="properties-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Owner</th>
                        <th>Mobile Number</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeProperties.map((property) => (
                        <tr key={property.id}>
                          <td>
                            <div className="property-info">
                              <h4>{property.title}</h4>
                              <p>{property.location}</p>
                              {property.status === 'rejected' && (property.rejection_message || rejectReasons[property.id]) && (
                                <p style={{ color: '#b94a48', marginTop: '6px', fontSize: '13px' }}>
                                  <strong>Rejection reason:</strong> {property.rejection_message || rejectReasons[property.id]}
                                </p>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="owner-info">
                              <p>
                                <strong>{property.full_name}</strong>
                              </p>
                              <p>{property.email}</p>
                            </div>
                          </td>
                          <td>
                            <p>{property.phone}</p>
                          </td>
                          <td>{property.transaction_type}</td>
                          <td>₹{parseInt(property.price).toLocaleString()}</td>
                          <td>{getStatusBadge(property.status)}</td>
                          <td>
                            <div className="action-buttons">
                              <Link to={`/property/${createSlug(property.title, property.location)}`} className="view-btn">
                                View Details
                              </Link>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleEditProperty(property)}
                                title="Edit Property"
                                style={{
                                  marginLeft: '5px',
                                  backgroundColor: '#007bff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  color: 'white',
                                  fontSize: '12px',
                                }}
                              >
                                ✏️ Edit
                              </button>
                              {rejectingId === property.id ? (
                                <div className="reject-box" onClick={(e) => e.stopPropagation()}>
                                  <textarea
                                    value={rejectReasons[property.id] || ''}
                                    onChange={(e) =>
                                      setRejectReasons(prev => ({ ...prev, [property.id]: e.target.value }))
                                    }
                                    placeholder="Enter rejection reason..."
                                    rows={3}
                                    autoFocus
                                    onFocus={(e) => e.target.select()}
                                    style={{
                                      width: '100%',
                                      marginTop: '6px',
                                      padding: '8px',
                                      boxSizing: 'border-box',
                                      minHeight: '80px',
                                      resize: 'vertical',
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                      fontSize: '14px',
                                      lineHeight: '1.4',
                                      color: '#333',
                                      backgroundColor: '#fff',
                                      zIndex: 10,
                                      position: 'relative',
                                    }}
                                  />
                                  <div
                                    style={{
                                      display: 'flex',
                                      gap: '8px',
                                      marginTop: '6px',
                                    }}
                                  >
                                    <button
                                      className="btn btn-danger btn-sm"
                                      disabled={!rejectReasons[property.id]?.trim()}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePropertyStatus(property.id, 'rejected', rejectReasons[property.id]);
                                      }}
                                    >
                                      Submit Rejection
                                    </button>
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRejectingId(null);
                                        setRejectReasons(prev => ({ ...prev, [property.id]: '' }));
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {property.status === 'pending' && (
                                    <>
                                      <button
                                        className="btn btn-success btn-sm"
                                        onClick={() =>
                                          handlePropertyStatus(
                                            property.id,
                                            'approved'
                                          )
                                        }
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                          setRejectingId(property.id)
                                        }
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {property.status === 'approved' && (
                                    <button
                                      className="btn btn-warning btn-sm"
                                      onClick={() =>
                                        setRejectingId(property.id)
                                      }
                                    >
                                      Reject
                                    </button>
                                  )}
                                  {property.status === 'rejected' && (
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() =>
                                        handlePropertyStatus(
                                          property.id,
                                          'approved'
                                        )
                                      }
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {activeTab === 'trash' ? (
                                    <>
                                      <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleRestoreFromTrash(property.id)}
                                        title="Restore Property"
                                      >
                                        ♻️ Restore
                                      </button>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handlePermanentlyDelete(property.id)}
                                        title="Delete Permanently"
                                        style={{ marginLeft: '6px' }}
                                      >
                                        🗑️ Delete Permanently
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      className="btn btn-danger btn-sm delete-btn"
                                      onClick={() => handleDeleteProperty(property.id)}
                                      title="Move to Trash"
                                    >
                                      🗑️ Move to Trash
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                            {/* Edit Property Modal */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trash' && (
            <div className="properties-management">
              <h2>Trash Bin</h2>

              {trashedProperties.length === 0 ? (
                <p style={{ textAlign: "center", color: "#777", padding: "40px" }}>
                  🗑️ Trash is empty
                </p>
              ) : (
                <div className="properties-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Owner</th>
                        <th>Price</th>
                        <th>Deleted Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {trashedProperties.map((property) => (
                        <tr key={property.id}>
                          <td>
                            <strong>{property.title}</strong>
                            <p>{property.location}</p>
                          </td>

                          <td>
                            <p>{property.full_name}</p>
                            <p>{property.email}</p>
                          </td>

                          <td>₹{parseInt(property.price).toLocaleString()}</td>

                          <td>
                            <span className="badge badge-danger">Trashed</span>
                          </td>

                          <td>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleRestoreFromTrash(property.id)}
                            >
                              ♻️ Restore
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              style={{ marginLeft: "8px" }}
                              onClick={() => handlePermanentlyDelete(property.id)}
                            >
                              🗑️ Delete Permanently
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-management">
              <h2>User Management</h2>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Mobile Number</th>
                      <th>Role</th>
                      <th>Properties</th>
                      <th>Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <h4>{user.full_name || user.username}</h4>
                            <p>{user.email}</p>
                          </div>
                        </td>
                        <td>
                          <p>{user.phone}</p>
                        </td>
                        <td>
                          <span className="role-badge" style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: 
                              user.role === 'admin' ? '#d32f2f' :
                              user.role === 'agent' ? '#1976d2' :
                              user.role === 'builder' ? '#388e3c' :
                              user.role === 'premium' ? '#f57c00' :
                              '#6c757d',
                            color: 'white'
                          }}>
                            {user.role === 'admin' ? '👑 Admin' :
                             user.role === 'agent' ? '🏢 Agent' :
                             user.role === 'builder' ? '🏗️ Builder' :
                             user.role === 'premium' ? '⭐ Premium' :
                             user.role === 'normal' ? '👤 User' :
                             user.role}
                          </span>
                          
                          {/* Role Change Dropdown */}
                          <select
                            value={user.role}
                            onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                            style={{
                              marginLeft: '10px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                            title="Change user role"
                          >
                            <option value="normal">👤 User</option>
                            <option value="premium">⭐ Premium</option>
                            <option value="agent">🏢 Agent</option>
                            <option value="builder">🏗️ Builder</option>
                            <option value="admin">👑 Admin</option>
                          </select>
                        </td>
                        <td>
                          <div className="property-stats">
                            <span>{user.total_properties} total</span>
                            <span>{user.approved_properties} approved</span>
                          </div>
                        </td>
                        <td>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              user.is_active
                                ? 'badge-success'
                                : 'badge-danger'
                            }`}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activeTab === "leads" && (
            <div className="leads-management">

              <h2>Leads Management</h2>
              <input
              type="text"
              placeholder="Search lead user / owner / phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="lead-search"
            />

              {/* ===== LEAD SUMMARY ===== */}
              <div className="lead-summary-grid">
                {leadSummary.length === 0 && <p>No leads found</p>}

                {leadSummary.map((user) => (
                  <div className="lead-summary-card" key={user.id}>
                    <h4>{user.full_name || "Guest User"}</h4>
                    <p>{user.email || "-"}</p>
                    <strong>{user.total_leads} Leads</strong>
                  </div>
                ))}
              </div>

              {/* ===== LEADS TABLE ===== */}
              <div className="leads-table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Lead User</th>
                      <th>Lead Phone</th>
                      <th>Lead Email</th>
                      <th>Property</th>
                      <th>Owner Name</th>
                      <th>Owner Phone</th>
                      <th>Owner Email</th>
                      <th>Date</th>
                    </tr>
                  </thead>


                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.lead_name || "NA"}</td>
                        <td>{lead.lead_phone || "NA"}</td>
                        <td>{lead.lead_email || "-"}</td>

                        <td>
                          <strong>{lead.property_title}</strong>
                          <br />
                          <small>{lead.location}</small>
                        </td>

                        <td>{lead.owner_name || "NA"}</td>
                        <td>{lead.owner_phone || "-"}</td>
                        <td>{lead.owner_email || "-"}</td>

                        <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>



                </table>
              </div>

            </div>
          )}
        </div>
      </div>
      {activeTab === 'interiors' && (
        <div className="properties-management">
          <h2>Interior Service Approvals</h2>

          {interiorLoading ? (
            <p>Loading interior services...</p>
          ) : interiors.length === 0 ? (
            <p>No interior services submitted yet.</p>
          ) : (
            <div className="properties-table">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Provider</th>
                    <th>Experience</th>
                    <th>Starting Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {interiors.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.title}</strong>
                        <p>{item.service_area}</p>
                      </td>

                      <td>
                        <p><strong>{item.full_name}</strong></p>
                        <p>{item.phone}</p>
                      </td>

                      <td>{item.experience} yrs</td>
                      <td>₹{item.starting_price}</td>

                      <td>{getStatusBadge(item.status)}</td>

                      <td>
                      {item.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => updateInteriorStatus(item.id, "approved")}
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateInteriorStatus(item.id, "rejected")}
                            style={{ marginLeft: "6px" }}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {item.status === "approved" && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => updateInteriorStatus(item.id, "rejected")}
                        >
                          Reject
                        </button>
                      )}

                      {item.status === "rejected" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateInteriorStatus(item.id, "approved")}
                        >
                          Approve
                        </button>
                      )}
                    </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Property Modal Popup */}
      {showEditModal && editingProperty && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: '1000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={handleCancelEdit}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ❌
            </button>
            
            {/* Modal Header */}
            <div style={{
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: '600',
              color: '#333'
            }}>
              ✏️ Edit Property
            </div>
            
            {/* Edit Form Fields */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Title:</label>
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => handleEditFormChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Price:</label>
              <input
                type="number"
                value={editForm.price || ''}
                onChange={(e) => handleEditFormChange('price', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Location:</label>
              <input
                type="text"
                value={editForm.location || ''}
                onChange={(e) => handleEditFormChange('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Property Type:</label>
              <select
                value={editForm.transaction_type || ''}
                onChange={(e) => handleEditFormChange('transaction_type', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select Type</option>
                
                {/* Residential Properties */}
                <optgroup label="🏠 Residential">
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa/House</option>
                  <option value="studio">Studio</option>
                  <option value="pg">PG/Paying Guest</option>
                </optgroup>
                
                {/* Commercial Properties */}
                <optgroup label="🏢 Commercial">
                  <option value="commercial">Commercial Space</option>
                  <option value="office">Office Space</option>
                  <option value="shop">Shop/Retail</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="showroom">Showroom</option>
                </optgroup>
                
                {/* Land & Plots */}
                <optgroup label="🏞️ Land & Plots">
                  <option value="plot">Residential Plot</option>
                  <option value="commercial-plot">Commercial Plot</option>
                  <option value="agricultural">Agricultural Land</option>
                  <option value="industrial">Industrial Land</option>
                </optgroup>
                
                {/* Special Properties */}
                <optgroup label="⭐ Special">
                  <option value="agent">Agent/Dealer</option>
                  <option value="builder">Builder/Developer</option>
                  <option value="investment">Investment Property</option>
                  <option value="vacation">Vacation Home</option>
                </optgroup>
              </select>
            </div>

            {/* Rejection Reason Field - Only show for rejected properties */}
            {editingProperty.status === 'rejected' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#d32f2f' }}>
                  🚫 Rejection Reason:
                </label>
                <textarea
                  value={editForm.rejection_message || ''}
                  onChange={(e) => handleEditFormChange('rejection_message', e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '2px solid #ffcdd2',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    backgroundColor: '#fff8f8'
                  }}
                />
                <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  This reason will be shown to the property owner
                </small>
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={() => handleAdminEditSave()}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                💾 Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;