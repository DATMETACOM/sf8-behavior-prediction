import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import CustomerDetail from './views/CustomerDetail'
import Simulation from './views/Simulation'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="header-brand">
            <h1>[SF8] Cuca-Insider-AI</h1>
            <span className="header-badge">Shinhan Sales Copilot</span>
            <span className="header-badge">PoC</span>
          </div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to="/simulation" className={({ isActive }) => (isActive ? 'active' : '')}>
              What-If Sim
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customer/:id" element={<CustomerDetail />} />
          <Route path="/simulation" element={<Simulation />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
