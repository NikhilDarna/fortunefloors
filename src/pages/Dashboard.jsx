import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import "../components/PropertyCard.css"
import NotificationPanel from '../components/NotificationPanel';
import {
  Chart,
  DoughnutController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';

// Register chart.js components
Chart.register(
  DoughnutController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// ChartsSection as a separate const function
const ChartsSection = ({ stats }) => {
  const donutRef = useRef(null);
  const barRef = useRef(null);
  const donutChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    if (stats.total > 0) {
      renderCharts();
    }

    // cleanup on unmount
    return () => {
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [stats]);

  const renderCharts = () => {
    if (donutChartInstance.current) donutChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    if (donutRef.current) {
      donutChartInstance.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Approved', 'Pending', 'Rejected'],
          datasets: [{
            data: [stats.approved, stats.pending, stats.rejected],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    if (barRef.current) {
      barChartInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Properties',
            data: [4, 6, 2, 5], // you can replace with dynamic data
            backgroundColor: '#3B82F6',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true },
            x: {}
          }
        }
      });
    }
  };

  return (
    <div className="dashboard-charts" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
      <div className="chart-card" style={{ flex: '1 1 300px', height: '250px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '10px' }}>Property Status Overview</h2>
        <canvas ref={donutRef}></canvas>
      </div>
      <div className="chart-card" style={{ flex: '1 1 300px', height: '250px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '10px' }}>Properties Posted Per Month</h2>
        <canvas ref={barRef}></canvas>
      </div>
    </div>
  );
};

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
        <div className="dashboard-overview">
          {/* Charts */}
          <div className="charts-section">
            <ChartsSection stats={stats} />
          </div>

          {/* Stats */}
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
