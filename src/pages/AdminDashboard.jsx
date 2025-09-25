import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingProperties: 0,
    totalUsers: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'properties') {
      fetchProperties();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
        
        setStats(prev => ({
          ...prev,
          totalProperties: data.length,
          pendingProperties: data.filter(p => p.status === 'pending').length
        }));
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        
        setStats(prev => ({
          ...prev,
          totalUsers: data.length,
          activeUsers: data.filter(u => u.is_active).length
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handlePropertyStatus = async (propertyId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchProperties(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger'
    };
    
    return (
      <span className={`badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users Management
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
                        <th>Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id}>
                          <td>
                            <div className="property-info">
                              <h4>{property.title}</h4>
                              <p>{property.location}</p>
                            </div>
                          </td>
                          <td>
                            <div className="owner-info">
                              <p><strong>{property.full_name}</strong></p>
                              <p>{property.email}</p>
                            </div>
                          </td>
                          <td>{property.transaction_type}</td>
                          <td>₹{parseInt(property.price).toLocaleString()}</td>
                          <td>{getStatusBadge(property.status)}</td>
                          <td>
                            <div className="action-buttons">
                              {property.status === 'pending' && (
                                <>
                                  <button 
                                    className="btn btn-success btn-sm"
                                    onClick={() => handlePropertyStatus(property.id, 'approved')}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handlePropertyStatus(property.id, 'rejected')}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {property.status === 'approved' && (
                                <button 
                                  className="btn btn-warning btn-sm"
                                  onClick={() => handlePropertyStatus(property.id, 'rejected')}
                                >
                                  Reject
                                </button>
                              )}
                              {property.status === 'rejected' && (
                                <button 
                                  className="btn btn-success btn-sm"
                                  onClick={() => handlePropertyStatus(property.id, 'approved')}
                                >
                                  Approve
                                </button>
                              )}
                            </div>
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
                          <span className="role-badge">{user.role}</span>
                        </td>
                        <td>
                          <div className="property-stats">
                            <span>{user.total_properties} total</span>
                            <span>{user.approved_properties} approved</span>
                          </div>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;