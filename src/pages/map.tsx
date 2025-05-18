import React, { useEffect, useRef, useState } from 'react';
import { loadKakaoMap } from '../utils/kakaoMap';
import { createMarker, getMarkers } from '../utils/markers';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const markersRef = useRef<any[]>([]);

  // 지도 초기화
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadKakaoMap();
        if (mapRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.543268, 126.722697),
            level: 3
          };
          const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
          setMap(kakaoMap);

          // 마커 데이터 로드 및 생성
          const markerData = await getMarkers();
          const newMarkers = markerData.map(data => createMarker(kakaoMap, data));
          setMarkers(newMarkers);
          markersRef.current = newMarkers;
        }
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();
  }, []);

  // 마커 상태 주기적 업데이트
  useEffect(() => {
    if (!map) return;

    const updateMarkers = async () => {
      try {
        const markerData = await getMarkers();
        // 기존 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        // 새로운 마커 생성
        const newMarkers = markerData.map(data => createMarker(map, data));
        setMarkers(newMarkers);
        markersRef.current = newMarkers;
      } catch (error) {
        console.error('Failed to update markers:', error);
      }
    };

    // 1초마다 마커 상태 업데이트
    const intervalId = setInterval(updateMarkers, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [map]);

  // 줌 인/아웃 함수
  const zoomIn = () => {
    if (map) {
      const currentLevel = map.getLevel();
      map.setLevel(currentLevel - 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      const currentLevel = map.getLevel();
      map.setLevel(currentLevel + 1);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', right: '20px', top: '20px', zIndex: 1 }}>
        <button onClick={zoomIn} style={{ marginRight: '10px' }}>+</button>
        <button onClick={zoomOut}>-</button>
      </div>
    </div>
  );
};

export default Map;
