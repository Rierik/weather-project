import { SetStateAction, useEffect, useState } from 'react';
import { getFineDust, getShortForecast } from './api';

import './App.css';

interface Item {
  category: string;
  fcstValue: string;
  // 다른 속성들도 있을 수 있음
}

function App() {
  const [dustGrade, setDustGrade] = useState('');
  const [shortWeatherData, setShortWeatherData] = useState({
    한시간기온: [],
    하늘상태: [],
    강수형태: [],
    강수확률: [],
    한시간강수량: [],
    습도: [],
    눈쌓임: [],
  });

  const [weatherDeg, setWeatherDeg] = useState<SetStateAction<string[]>>([]);

  useEffect(() => {
    async function getDustGrade() {
      const res = await getFineDust();
      setDustGrade(res.data.response.body.items[0].pm10Grade);
      console.log('re', res.data.response.body.items[0]);
    }
    getDustGrade();

    async function getShortWeatherData() {
      const res = await getShortForecast();
      console.log('resssss', res.data.response.body.items);

      const ddd = {
        한시간기온: res.data.response.body.items.item.filter((v: Item) => v.category == 'TMP'),
        하늘상태: res.data.response.body.items.item.filter((v: Item) => v.category == 'SKY'),
        강수형태: res.data.response.body.items.item.filter((v: Item) => v.category == 'PTY'),
        강수확률: res.data.response.body.items.item.filter((v: Item) => v.category == 'POP'),
        한시간강수량: res.data.response.body.items.item.filter((v: Item) => v.category == 'PCP'),
        습도: res.data.response.body.items.item.filter((v: Item) => v.category == 'REH'),
        눈쌓임: res.data.response.body.items.item.filter((v: Item) => v.category == 'SNO'),
      };

      setShortWeatherData(ddd);
    }
    getShortWeatherData();

    setWeatherDeg(shortWeatherData['한시간기온'].map((d: Item) => d.fcstValue));
  }, []);
  console.log('ㄹㄴㄹㄹㄴ', weatherDeg);

  return (
    <>
      {dustGrade && (
        <div>
          {dustGrade == '1'
            ? '미세먼지가 좋음 입니다 :)'
            : dustGrade == '2'
            ? '미세먼지가 보통 입니다 :@'
            : dustGrade == '3'
            ? '미세먼지가 나쁨입니다 :('
            : dustGrade == '4'
            ? '미세먼지가 매우 나쁨입니다. 마스크를 착용하세요 :<'
            : null}
        </div>
      )}

      {shortWeatherData && weatherDeg}
    </>
  );
}

export default App;
