import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { FAQ } from './pages/FAQ';
import { Reconhecimentos } from './pages/Reconhecimentos';
import { QuemSomos } from './pages/quem-somos';
import { Sobre } from './pages/Sobre';
import { Contato } from './pages/Contato';
import { Formulario } from './pages/Formulario';
import { Cadastro } from './pages/Cadastro';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { DentistaDashboard } from './pages/DentistaDashboard';
import { PacienteDashboard } from './pages/PacienteDashboard';
import { CalculadoraScore } from './pages/CalculadoraScore';
import { FormularioContato } from './pages/FormularioContato';
import { Prontuario } from './pages/Prontuario';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F5F5DC]">
        <Header /> 
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} /> 
            <Route path="/reconhecimentos" element={<Reconhecimentos />} /> 
            <Route path="/quem-somos" element={<QuemSomos />} /> 
            <Route path="/sobre" element={<Sobre />} /> 
            <Route path="/contato" element={<Contato />} /> 
            <Route path="/formulario" element={<Formulario />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/dentista" element={<DentistaDashboard />} />
            <Route path="/dashboard/paciente" element={<PacienteDashboard />} />
            <Route path='/Calculadura/Score' element={<CalculadoraScore /> } />
            <Route path='/FormularioContato' element={<FormularioContato /> } /> 
            <Route path='/Prontuario' element={<Prontuario /> } />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;