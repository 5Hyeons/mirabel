import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { HealthCheck } from './pages/examination/HealthCheck';
import { HealthWarning } from './pages/examination/HealthWarning';
import { HealthRecording } from './pages/examination/HealthRecording';
import { HealthComplete } from './pages/examination/HealthComplete';
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
          <Route path="/health-check" element={<HealthCheck />} />
          <Route path="/health-check/warning" element={<HealthWarning />} />
          <Route path="/health-check/recording" element={<HealthRecording />} />
          <Route path="/health-check/complete" element={<HealthComplete />} />
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
