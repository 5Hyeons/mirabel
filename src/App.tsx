import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { DoctorIntro } from './pages/examination/DoctorIntro';
import { Procedure } from './pages/examination/Procedure';
import { AIConsultation } from './pages/consultation/ai/AIConsultation';
import { ConsentCheckbox } from './pages/consent/Checkbox';
import { ConsentSignature } from './pages/consent/Signature';
import { ConsentVoice } from './pages/consent/Voice';
import { ConsentComplete } from './pages/consent/Complete';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div
        className="w-full max-w-[480px] h-screen max-h-[932px] relative shadow-xl overflow-hidden"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/examination/doctor-intro" element={<DoctorIntro />} />
          <Route path="/examination/procedure" element={<Procedure />} />
          <Route path="/consultation/ai" element={<AIConsultation />} />
          <Route path="/consent/checkbox" element={<ConsentCheckbox />} />
          <Route path="/consent/signature" element={<ConsentSignature />} />
          <Route path="/consent/voice" element={<ConsentVoice />} />
          <Route path="/consent/complete" element={<ConsentComplete />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
