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
import { SolucaoTriagem } from './pages/SolucaoTriagem';
import { SolucaoDashboard } from './pages/SolucaoDashboard'; 


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
            <Route path="/SolucaoTriagem" element={<SolucaoTriagem />} />
            <Route path="/SolucaoDashboard" element={<SolucaoDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;