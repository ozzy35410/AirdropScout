import { useState, useEffect } from 'react';
import { runDetector } from '../config/detectors';

export function useAutoDetection(address: string, network: string, taskId: string) {
  const [isDetected, setIsDetected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    if (!address || !network || !taskId) {
      setIsDetected(false);
      return;
    }

    const checkDetection = async () => {
      setIsChecking(true);
      try {
        const detected = await runDetector(network, taskId, address);
        setIsDetected(detected);
      } catch (error) {
        console.error('Auto-detection error:', error);
        setIsDetected(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Run detection with a small delay to avoid too many simultaneous calls
    const timeoutId = setTimeout(checkDetection, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [address, network, taskId]);

  return { isDetected, isChecking };
}