// src/App.tsx
import { WalletProvider } from './contexts/WalletContext';
import { ToastProvider } from './components/ToastContainer';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <ToastProvider>
        <Dashboard />
      </ToastProvider>
    </WalletProvider>
  );
}

export default App;