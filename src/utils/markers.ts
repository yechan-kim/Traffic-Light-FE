// CSV 파일에서 신호등 시간 데이터를 가져오는 함수
const loadTrafficLightSchedule = async (location: string) => {
  try {
    let csvPath = '';
    switch (location) {
      case '계산3':
        csvPath = '/data/gyesan_3.csv';
        break;
      case '계산초교4':
        csvPath = '/data/gyesan_ele_4.csv';
        break;
      case '계산4거리':
        csvPath = '/data/gyesan_4.csv';
        break;
      default:
        throw new Error(`Unknown location: ${location}`);
    }

    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.statusText}`);
    }
    const csvText = await response.text();
    
    console.log(`Loading CSV for ${location}:`, csvText);
    
    // CSV 파싱
    const rows = csvText.split('\n').slice(1); // 헤더 제외
    console.log(`Rows for ${location}:`, rows);
    
    return rows.map(row => {
      // 쉼표로 분리하고 각 값을 trim
      const columns = row.split(',').map(col => col.trim());
      // 시작 시간과 종료 시간 추출 (첫 번째와 두 번째 열)
      const [start, end] = columns;
      console.log(`Row: ${row}`);
      console.log(`Columns: ${columns}`);
      console.log(`Start: ${start}, End: ${end}`);
      return { start, end };
    }).filter(row => row.start && row.end && row.start.includes(':') && row.end.includes(':'));
  } catch (error) {
    console.error(`Failed to load traffic light schedule for ${location}:`, error);
    return [];
  }
};

// 시간 문자열을 초로 변환하는 함수
const timeToSeconds = (timeStr: string): number => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// 현재 시간을 HH:MM:SS 형식으로 반환하는 함수
const getCurrentTime = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// 상태와 남은 시간을 계산하는 함수
const calculateStatusAndTime = async (location: string) => {
  const trafficLightSchedule = await loadTrafficLightSchedule(location);
  const currentTime = getCurrentTime();
  const currentSeconds = timeToSeconds(currentTime);
  const startTime = timeToSeconds('09:30:00');
  const endTime = timeToSeconds('17:00:00');

  // 운영 시간 외
  if (currentSeconds < startTime || currentSeconds > endTime) {
    return { status: 'No Data', time: 'No Data' };
  }

  // 현재 시간이 포함된 신호등 주기를 찾음
  const currentCycle = trafficLightSchedule.find(cycle => {
    const cycleStart = timeToSeconds(cycle.start);
    const cycleEnd = timeToSeconds(cycle.end);
    return currentSeconds >= cycleStart && currentSeconds <= cycleEnd;
  });

  if (currentCycle) {
    // 현재 신호등 주기 내에 있음 (OK)
    const remainingSeconds = timeToSeconds(currentCycle.end) - currentSeconds;
    return { status: 'OK', time: String(remainingSeconds) };
  }

  // 다음 신호등 주기를 찾음
  const nextCycle = trafficLightSchedule.find(cycle => {
    const cycleStart = timeToSeconds(cycle.start);
    return cycleStart > currentSeconds;
  });

  if (nextCycle) {
    // 다음 신호등 주기까지 남은 시간 (NO)
    const remainingSeconds = timeToSeconds(nextCycle.start) - currentSeconds;
    return { status: 'NO', time: String(remainingSeconds) };
  }

  // 마지막 주기 이후
  const lastCycle = trafficLightSchedule[trafficLightSchedule.length - 1];
  if (lastCycle) {
    const lastCycleEnd = timeToSeconds(lastCycle.end);
    if (currentSeconds > lastCycleEnd) {
      const remainingSeconds = endTime - currentSeconds;
      return { status: 'NO', time: String(remainingSeconds) };
    }
  }
  return { status: 'No Data', time: 'No Data' };
};

// 샘플 마커 데이터
export const getMarkers = async () => {
  const markers = [
    {
      id: 9710,
      position: { lat: 37.543713, lng: 126.718718 },
      title: '계산초교4',
      location: '계산초교4',
      status: 'No Data',
      time: 'No Data'
    },
    {
      id: 5200,
      position: { lat: 37.543696, lng: 126.719049 },
      title: '계산초교4',
      location: '계산초교4',
      status: 'No Data',
      time: 'No Data'
    },
    {
      id: 9714,
      position: { lat: 37.543551, lng: 126.722376 },
      title: '계산3',
      location: '계산3',
      status: 'No Data',
      time: 'No Data'
    },
    {
      id: 9731,
      position: { lat: 37.543517, lng: 126.723152 },
      title: '계산3',
      location: '계산3',
      status: 'No Data',
      time: 'No Data'
    },
    {
      id: 5216,
      position: { lat: 37.543292, lng: 126.728320 },
      title: '계산4거리',
      location: '계산4거리',
      status: 'No Data',
      time: 'No Data'
    }
  ];

  // 각 마커의 상태와 시간을 계산
  return await Promise.all(
    markers.map(async (marker) => {
      const { status, time } = await calculateStatusAndTime(marker.location);
      console.log(`Marker ${marker.id} - ${marker.location} - Status: ${status}, Time: ${time}`);
      marker.status = status;
      marker.time = time;
      return marker;
    })
  );
};

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
        남은 시간: ${markerData.time === 'No Data' ? 'No Data' : `${markerData.time}초`}
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
