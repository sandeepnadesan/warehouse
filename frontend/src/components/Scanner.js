// frontend/src/components/Scanner.js
import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const Scanner = ({ onScan }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length > 0) {
          await codeReader.decodeFromInputVideoDevice(videoInputDevices[0].deviceId, videoRef.current);
          codeReader.decodeFromInputVideoDevice(videoInputDevices[0].deviceId, videoRef.current, (result, err) => {
            if (result) {
              onScan(result.text);
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
            }
          });
        } else {
          console.error('No video input devices found');
        }
      } catch (err) {
        console.error('Error starting scanner:', err);
      }
    };

    startScanner();

    return () => {
      codeReader.reset();
    };
  }, [onScan]);

  return <video ref={videoRef} width="300" height="200"></video>;
};

export default Scanner;
