// ... existing imports ...
import DashboardLayout from './components/dashboard/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        // ... existing routes ...
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
}

export default App;