export const createMarker = (map: any, markerData: any) => {
  // 마커가 표시될 위치
  const markerPosition = new window.kakao.maps.LatLng(
    markerData.position.lat,
    markerData.position.lng
  );

  // 마커 생성
  const marker = new window.kakao.maps.Marker({
    position: markerPosition
  });

  // 마커가 지도 위에 표시되도록 설정
  marker.setMap(map);

  // 인포윈도우에 표시할 내용
  const iwContent = `
    <div style="padding:10px;min-width:150px;">
      <div style="font-size:14px;font-weight:bold;margin-bottom:5px;">${markerData.title}</div>
      <div style="font-size:12px;margin-bottom:3px;">
        <span style="color:${
          markerData.status === 'OK' ? 'green' : 
          markerData.status === 'NO' ? 'red' : 
          'gray'
        }">●</span>
        현재 상태: ${markerData.status}
      </div>
      <div style="font-size:12px;">
        남은 시간: ${markerData.time}초
      </div>
    </div>
  `;

  // 인포윈도우 생성
  const infowindow = new window.kakao.maps.InfoWindow({
    position: markerPosition,
    content: iwContent
  });

  // 마커에 마우스오버 이벤트를 등록
  window.kakao.maps.event.addListener(marker, 'mouseover', function() {
    infowindow.open(map, marker);
  });

  // 마커에 마우스아웃 이벤트를 등록
  window.kakao.maps.event.addListener(marker, 'mouseout', function() {
    infowindow.close();
  });

  return marker;
};

// 샘플 마커 데이터
export const sampleMarkers = [
  {
    id: 9710,
    position: { lat: 37.543713, lng: 126.718718 },
    title: '계산초교4',
    status: 'OK',
    time: '10'
  },
  {
    id: 5200,
    position: { lat: 	37.543696, lng: 126.719049 },
    title: '계산초교4',
    status: 'NO',
    time: '10'
  },
  {
    id: 9714,
    position: { lat: 	37.543551, lng: 126.722376 },
    title: '계산3',
    status: 'No Data',
    time: '10'
  },
  {
    id: 9731,
    position: { lat: 	37.543517, lng: 126.723152 },
    title: '계산3',
    status: 'OK',
    time: '10'
  },
  {
    id: 5216,
    position: { lat: 	37.543292, lng: 126.728320 },
    title: '계산4거리',
    status: 'OK',
    time: '10'
  }
]; 