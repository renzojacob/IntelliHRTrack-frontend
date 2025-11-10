import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../shared/layouts/AdminLayout.jsx';
import EmployeeLayout from '../shared/layouts/EmployeeLayout.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminBiometrics from '../pages/admin/Biometrics.jsx';
import AdminEmployees from '../pages/admin/Employees.jsx';
import AdminSchedule from '../pages/admin/Schedule.jsx';
import AdminLeave from '../pages/admin/Leave.jsx';
import AdminPayroll from '../pages/admin/Payroll.jsx';
import AdminAI from '../pages/admin/AIAnalytics.jsx';
import AdminReports from '../pages/admin/Reports.jsx';
import AdminSystem from '../pages/admin/System.jsx';
import EmpDashboard from '../pages/employee/Dashboard.jsx';
import EmpAttendance from '../pages/employee/Attendance.jsx';
import EmpAnalytics from '../pages/employee/Analytics.jsx';
import EmpLeave from '../pages/employee/Leave.jsx';
import EmpNotifications from '../pages/employee/Notifications.jsx';
import EmpPayroll from '../pages/employee/Payroll.jsx';
import EmpSchedule from '../pages/employee/Schedule.jsx';
import EmpUser from '../pages/employee/User.jsx';

export default function AppRouter(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin" element={<AdminLayout />}> 
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="biometrics" element={<AdminBiometrics />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="leave" element={<AdminLeave />} />
          <Route path="payroll" element={<AdminPayroll />} />
          <Route path="ai" element={<AdminAI />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="system" element={<AdminSystem />} />
        </Route>

        <Route path="/employee" element={<EmployeeLayout />}> 
          <Route index element={<EmpDashboard />} />
          <Route path="dashboard" element={<EmpDashboard />} />
          <Route path="attendance" element={<EmpAttendance />} />
          <Route path="analytics" element={<EmpAnalytics />} />
          <Route path="leave" element={<EmpLeave />} />
          <Route path="notifications" element={<EmpNotifications />} />
          <Route path="payroll" element={<EmpPayroll />} />
          <Route path="schedule" element={<EmpSchedule />} />
          <Route path="user" element={<EmpUser />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
