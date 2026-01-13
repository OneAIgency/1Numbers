import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import TaskDetail from '@/pages/Tasks/TaskDetail';
import Projects from '@/pages/Projects';
import Monitoring from '@/pages/Monitoring';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';
import { useWebSocket } from '@/hooks/useWebSocket';

function App() {
  const { connect } = useWebSocket();

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/:taskId" element={<TaskDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;
