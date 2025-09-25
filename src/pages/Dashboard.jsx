import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import NotificationPanel from '../components/NotificationPanel';

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProperties();
  }, []);

  const fetchUserProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
        
        // Calculate stats
        const newStats = {
          total: data.length,
          approved: data.filter(p => p.status === 'approved').length,
          pending: data.filter(p => p.status === 'pending').length,
          rejected: data.filter(p => p.status === 'rejected').length
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.fullName || user?.username}!</h1>
          <p className="user-role">Account Type: {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.total}</h3>
            <p>Total Properties</p>
          </div>
          <div className="stat-card approved">
            <h3>{stats.approved}</h3>
            <p>Approved</p>
          </div>
          <div className="stat-card pending">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card rejected">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="main-content">
            <div className="section">
              <h2>Your Properties</h2>
              {loading ? (
                <div className="loading">Loading your properties...</div>
              ) : properties.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't posted any properties yet.</p>
                  <a href="/post-property" className="btn btn-primary">Post Your First Property</a>
                </div>
              ) : (
                <div className="properties-list">
                  {properties.map((property) => (
                    <div key={property.id} className="property-item">
                      <PropertyCard property={property} showStatus={true} />
                      <div className="property-status" style={{ color: getStatusColor(property.status) }}>
                        Status: {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="sidebar">
            <NotificationPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;