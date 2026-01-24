import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import "../components/PropertyCard.css"
import NotificationPanel from '../components/NotificationPanel';
import InteriorCard from "../components/InteriorCard";

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
const ChartsSection = ({ stats, user }) => {
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
        <h2 style={{ fontSize: '16px', marginBottom: '10px' }}>
          {user?.role === "interiors"
            ? "Service Status Overview"
            : "Property Status Overview"}
        </h2>

        <canvas ref={donutRef}></canvas>
      </div>
      <div className="chart-card" style={{ flex: '1 1 300px', height: '250px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '10px' }}>
          {user?.role === "interiors"
            ? "Services Posted Per Month"
            : "Properties Posted Per Month"}
        </h2>

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
  if (user?.role === "interiors") {
    fetchUserInteriors();
  } else {
    fetchUserProperties();
  }
}, [user]);


  const fetchUserProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/properties`, {
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
const fetchUserInteriors = async () => {
  try {
    const token = localStorage.getItem("token");

    // 1️⃣ Fetch interiors list
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/interiors`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return;

    const data = await res.json();
    setProperties(data); // reuse same UI

    // 2️⃣ Fetch dashboard stats
    const statsRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/dashboard/interiors`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (statsRes.ok) {
      const statsData = await statsRes.json();
      setStats(statsData);
    }
  } catch (err) {
    console.error("Error fetching interiors:", err);
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
            <ChartsSection stats={stats} user={user} />

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
                <div className="properties-grid">
                  {properties.map((item) => (
                    <div key={item.id} className="property-item">

                      {user?.role === "interiors" ? (
                        <InteriorCard interior={item} />
                      ) : (
                        <>
                          <PropertyCard property={item} />
                          <div
                            className="property-status"
                            style={{ color: getStatusColor(item.status) }}
                          >
                            Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </div>
                        </>
                      )}
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
