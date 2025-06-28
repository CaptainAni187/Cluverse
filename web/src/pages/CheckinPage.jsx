import { useState } from 'react';
import BarcodeScanner from 'react-qr-barcode-scanner';
import api from '../api';
import Navbar from '../components/Navbar';

export default function CheckinPage() {
  const [msg, setMsg] = useState('');
  const [info, setInfo] = useState(null);
  const [scanning, setScanning] = useState(true);

  // Called when a QR code is detected
  const onRead = async (txt) => {
    if (!txt || !txt.startsWith('REG:')) {
      setMsg('Invalid QR');
      setInfo(null);
      setTimeout(() => setMsg(''), 1500);
      return;
    }
    setScanning(false); // Pause scanning while processing
    try {
      const { data } = await api.post(`/registrations/checkin/${txt.slice(4)}`);
      setMsg('✓ Checked-in successfully');
      setInfo(data); // Optionally show info card
    } catch (e) {
      setMsg(
        e?.response?.data?.msg === 'Already checked-in'
          ? 'Already checked-in'
          : 'Check-in failed'
      );
      setInfo(null);
    }
    setTimeout(() => {
      setMsg('');
      setScanning(true); // Resume scanning
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xs mx-auto mt-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Event Check-In</h1>
        {scanning ? (
          <BarcodeScanner
            width={350}
            height={350}
            facingMode="environment"
            onUpdate={(err, res) => {
              if (res) onRead(res.text);
            }}
          />
        ) : (
          <div className="w-[350px] h-[350px] flex items-center justify-center bg-blue-100 rounded-lg shadow-md">
            <p className="text-blue-700 font-semibold">Processing...</p>
          </div>
        )}
        <p className={`text-center mt-4 text-lg font-semibold transition
          ${msg.startsWith('✓') ? 'text-green-600' : msg ? 'text-red-500' : ''}`}>
          {msg}
        </p>
        {/* Optionally show attendee info after scan */}
        {info && (
          <div className="bg-white rounded-xl shadow-lg p-5 mt-6 w-full text-center animate-fade-in">
            <div className="font-bold text-blue-900 text-lg mb-1">{info.event?.title || 'Event'}</div>
            <div className="text-blue-700">{info.user?.name || 'Student'}</div>
            <div className="text-xs text-blue-400 mb-2">{info.user?.email}</div>
            <div className="mt-2 text-green-600 font-semibold">Checked-in</div>
          </div>
        )}
      </div>
      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.6s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        `}
      </style>
    </>
  );
}
