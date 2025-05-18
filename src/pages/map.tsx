import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [level, setLevel] = useState<number>(3);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.543268, 126.722697),
      level: level
    };

    const kakaoMap = new window.kakao.maps.Map(container, options);
    setMap(kakaoMap);
  }, []);

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
