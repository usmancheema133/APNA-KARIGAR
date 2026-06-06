import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerList from './pages/WorkerList';
import WorkerProfile from './pages/WorkerProfile';
import BookNow from './pages/BookNow';
import MyBookings from './pages/MyBookings';
import LeaveReview from './pages/LeaveReview';
import NotFound from './pages/NotFound';
import EditProfile from './pages/EditProfile';

import WorkerDashboard from './pages/worker/WorkerDashboard';
import JobRequests from './pages/worker/JobRequests';
import BookingHistory from './pages/worker/BookingHistory';
import Earnings from './pages/worker/Earnings';

import AdminDashboard from './pages/admin/AdminDashboard';
import PendingVerifications from './pages/admin/PendingVerifications';
import AllUsers from './pages/admin/AllUsers';
import AllWorkers from './pages/admin/AllWorkers';

const AppRoutes = () => {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workers" element={<WorkerList />} />
        <Route path="/workers/:id" element={<WorkerProfile />} />

        {/* Customer routes */}
        <Route path="/book/:workerId" element={
          <ProtectedRoute roles={['customer']}><BookNow /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute roles={['customer']}><MyBookings /></ProtectedRoute>
        } />
        <Route path="/review/:bookingId" element={
          <ProtectedRoute roles={['customer']}><LeaveReview /></ProtectedRoute>
        } />

        {/* Shared edit profile — both customer and worker */}
        <Route path="/edit-profile" element={
          <ProtectedRoute roles={['customer', 'worker']}><EditProfile /></ProtectedRoute>
        } />

        {/* Worker routes */}
        <Route path="/worker/dashboard" element={
          <ProtectedRoute roles={['worker']}><WorkerDashboard /></ProtectedRoute>
        } />
        <Route path="/worker/job-requests" element={
          <ProtectedRoute roles={['worker']}><JobRequests /></ProtectedRoute>
        } />
        <Route path="/worker/history" element={
          <ProtectedRoute roles={['worker']}><BookingHistory /></ProtectedRoute>
        } />
        <Route path="/worker/earnings" element={
          <ProtectedRoute roles={['worker']}><Earnings /></ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/pending" element={
          <ProtectedRoute roles={['admin']}><PendingVerifications /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}><AllUsers /></ProtectedRoute>
        } />
        <Route path="/admin/workers" element={
          <ProtectedRoute roles={['admin']}><AllWorkers /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
