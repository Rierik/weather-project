import axios from 'axios';

//http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=강남구&dataTerm=month&pageNo=1&numOfRows=100&returnType=xml&serviceKey=서비스키

//에어 코리아 api, 공공데이터포털의 api

export const getFineDust = async () =>
  await axios.get(
    `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=강남구&dataTerm=DAILY&pageNo=1&numOfRows=50&returnType=json&serviceKey=${
      import.meta.env.VITE_SERVICE_KEY
    }`,
  );

const today = new Date();

console.log(today);
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}${month}${day}`;

console.log('year', year);
console.log('month', today.getMonth() + 1);
console.log('day', today.getDate());
console.log('포맷후', formattedDate);

const numHours = today.getHours();
const n = numHours % 3 == 0 ? 1 : numHours % 3 == 1 ? 2 : numHours % 3 == 2 ? 0 : 0;
const hours = String(today.getHours() - n).padStart(2, '0');

console.log('지금 시간', n, hours, today.getHours());

export const getShortForecast = async () =>
  await axios.get(
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?base_date=${formattedDate}&base_time=${hours}00&nx=61&ny=125&pageNo=1&numOfRows=60&dataType=json&serviceKey=${
      import.meta.env.VITE_SERVICE_KEY
    }`,
  );

// // POST
// export async function postUser() {
//   try {
//     // POST 요청은 body에 실어 보냄
//     await axios.post('/user', {
//       firstName: 'Fred',
//       lastName: 'Flintstone',
//     });
//   } catch (e) {
//     console.error(e);
//   }
// }
