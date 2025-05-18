import React, { useEffect, useState } from 'react';
import { loadKakaoMap } from '../utils/kakaoMap';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [level, setLevel] = useState<number>(3);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadKakaoMap();
        
        const container = document.getElementById('map');
        if (!container) return;

        const options = {
          center: new window.kakao.maps.LatLng(37.543268, 126.722697),
          level: level
        };

        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
      } catch (error) {
        console.error('Failed to initialize Kakao Map:', error);
      }
    };

    initMap();
  }, [level]);

  const handleZoomIn = () => {
    if (map && level > 1) {
      const newLevel = level - 1;
      map.setLevel(newLevel);
      setLevel(newLevel);
    }
  };

  const handleZoomOut = () => {
    if (map && level < 14) {
      const newLevel = level + 1;
      map.setLevel(newLevel);
      setLevel(newLevel);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
      <div style={{ position: 'absolute', right: '20px', top: '20px', zIndex: 1 }}>
        <button 
          onClick={handleZoomIn}
          style={{
            padding: '10px 15px',
            margin: '5px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          style={{
            padding: '10px 15px',
            margin: '5px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default Map;
