import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';
import DataTable from '../components/DataTable';
import DataChart from '../components/DataChart';
import AddDataForm from '../components/AddDataForm';
import UserProfile from '../components/UserProfile';
import NavBar from '../components/NavBar';
import apiClient from '../api/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('table');
  const [profileSection, setProfileSection] = useState('profile');
  const [isAddingData, setIsAddingData] = useState(false);
  const hasInitiallyLoaded = React.useRef(false);

  const handleTabChange = (tab, section = 'profile') => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setProfileSection(section);
    }
  };

  // Fetch data from API
  const fetchData = useCallback(async (showNotifications = true) => {
    try {
      setLoading(true);
      setError('');
      
      // fetching data form api
      const response = await apiClient.get('/records');
      
      setData(response.data || []);
      if (showNotifications) {
        toast.dismiss();
        if (response.data && response.data.length > 0) {
          toast.success(`Loaded ${response.data.length} records successfully!`);
        } else {
          toast.info('No records found for this user. Add some records to get started!');
        }
      }
    } catch (_err) {
      setError('Failed to fetch data from server');
      if (showNotifications) {
        toast.error('Failed to fetch data from server. Please check your connection.');
      }
      
      // Set empty data when API fails
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new data
  const handleAddData = async (newData) => {
    try {
      setIsAddingData(true);
      // Add current user ID to the new record
      const recordWithUser = {
        ...newData,
        userId: user?.userId || user?.id
      };
      
      const response = await apiClient.post('/records', recordWithUser);
      if (response.data) {
        // Refresh data without showing notification
        await fetchData(false);
        toast.dismiss();
        toast.success('New record added successfully!');
        return true;
      }
      return false;
    } catch (_err) {
      // For demo purposes, add to local state if api fails
      const recordWithUser = {
        ...newData,
        userId: user?.userId || user?.id
      };
      setData(prevData => [...prevData, recordWithUser]);
      toast.dismiss();
      toast.success('New record added successfully!');
      return true;
    } finally {
      setIsAddingData(false);
    }
  };

  
  // Delete existing data
  const handleDeleteData = async (itemToDelete) => {
    try {
      const response = await apiClient.delete(`/records/${itemToDelete.id}`);
      if (response.data) {
        await fetchData(false);
        toast.dismiss();
        toast.success('Record deleted successfully!');
        return true;
      }
      return false;
    } catch (_err) {
      toast.error('Failed to delete record');
      return false;
    }
  };

  useEffect(() => {
    // Only fetch data and show notifications for table tab

    const shouldFetch = activeTab === 'table' && !isAddingData;
    const isInitialLoad = !hasInitiallyLoaded.current;
    
    if (shouldFetch && isInitialLoad) {
      fetchData(true);
      hasInitiallyLoaded.current = true;
    } else if (shouldFetch && !isInitialLoad) {
      fetchData(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAddingData]);


  return (
    <div className="min-vh-100 bg-light">
      {/* navbar */}
      <NavBar activeTab={activeTab} onTabChange={handleTabChange} onLogout={logout} />
      




      
      {/* Header */}
      
      <div className="bg-white border-bottom py-4">
        <div className="container-lg">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1 text-danger">
                {activeTab === 'table' && 'Data Records'}
                {activeTab === 'add' && 'Add New Item'}
                {activeTab === 'chart' && 'Data Analytics'}
                {activeTab === 'profile' && 'User Profile'}
                {activeTab !== 'table' && activeTab !== 'add' && activeTab !== 'chart' && activeTab !== 'profile' && 'Dashboard'}
              </h1>
              <p className="text-muted mb-0">Welcome, {user?.name || 'User'}!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container-lg mt-3">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container-lg">
        {activeTab === 'table' && <DataTable data={data} loading={loading} onDelete={handleDeleteData} />}
        {activeTab === 'add' && <AddDataForm onAddData={handleAddData} />}
        {activeTab === 'chart' && <DataChart data={data} />}
        {activeTab === 'profile' && <UserProfile initialSection={profileSection} />}
      </div>
    </div>
  );
};

export default DashboardPage;
