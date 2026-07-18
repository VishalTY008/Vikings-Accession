import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { getQRCode } from '../../services/memberService';

export default function QRCard() {
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    getQRCode().then((res) => setQrData(res.data.data)).catch(() => {});
  }, []);

  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card p-6 text-center space-y-4">
      <h3 className="font-display font-bold text-lg">QR Check-in Code</h3>
      {qrData ? (
        <div className="flex justify-center p-4 bg-white rounded-xl">
          <QRCode value={JSON.stringify({ memberId: qrData.memberId })} size={200} />
        </div>
      ) : (
        <div className="w-[200px] h-[200px] mx-auto bg-gray-100 dark:bg-dark-700 rounded-xl animate-pulse" />
      )}
      <p className="text-xs text-gray-500 dark:text-dark-400">Show this QR code at the gym entrance</p>
    </motion.div>
  );
}
