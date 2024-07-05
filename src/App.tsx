import { useEffect, useState } from 'react';
import { getFineDust, forecastRes } from './api';
import styled from 'styled-components';

import './App.css';

interface Item {
  category: string;
  fcstValue: string;
  fcstTime: string;
  // 다른 속성들도 있을 수 있음
}

const Table = styled.table`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 500px;
`;

const FineDust = styled.span`
  display: inline-block;
  width: 65px;
  height: 32px;
  line-height: 30px;
  border-radius: 13px;
`;

const GoodDust = styled(FineDust)`
  background-color: rgba(52, 160, 255, 0.2);
  color: #34a0ff;
`;

const CommonlyDust = styled(FineDust)`
  background-color: rgba(0, 199, 60, 0.2);
  color: #00c73c;
`;

const BadDust = styled(FineDust)`
  background-color: rgba(253, 165, 14, 0.2);
  color: #fda50e;
`;
const VeryBadDust = styled(FineDust)`
  background-color: rgba(205, 53, 52, 0.2);
  color: #cd3534;
`;

const CaptionTitle = styled.caption`
  font-size: 1.2rem;
  margin: 20px auto 40px auto;
`;

const TimeTile = styled.th`
  width: 50px;
  text-align: center;
`;

const Today = styled.p`
  width: 55px;
  height: 28px;
  background-color: #000;
  color: #fff;
  text-align: center;
  line-height: 28px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 14px;
`;

const TableTitle = styled.th`
  width: 100px;
  text-align: left;
  padding-left: 5px;
`;

const IconMapper = styled.div`
  margin-top: 10px;

  width: 50px;
  height: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const WeatherIcon = styled.i`
  text-align: center;
  width: 30px;
  height: 30px;
  display: block;
  background-image: url(https://ssl.pstatic.net/static/weather/image/sp_icon_weather_346e83fd.png);
  -webkit-background-size: 210px 180px;
  background-size: 210px 180px;
`;

const Sunny = styled(WeatherIcon)`
  background-position: 0 0;
`;

const LittleCloud = styled(WeatherIcon)`
  background-position: 100% 20%;
`;

const PartlyCloudy = styled(WeatherIcon)`
  background-position: 100% 60%;
`;

const Cloudy = styled(WeatherIcon)`
  background-position: 100% 40%;
`;

const Tr = styled.tr`
  margin: 20px 0;
`;

const Td = styled.td`
  text-align: center;
`;

const CurrentDegree = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  /* Parent 내의 Child 스타일 */
  ${IconMapper} {
    /* 새로운 Child 스타일 */
    margin-top: 0;
    margin: 4px;
    transform: scale(2.5);
  }
`;

function App() {
  const [dustGrade, setDustGrade] = useState<string>('');

  //setstationAction을 쓰는것이 best practice는 아니라고 하는데 상태 값을 업데이트하는 함수의 형식을 정의하는 데 사용된다.
  const [forecastTime, setForecastTime] = useState<Array<string>>([]);
  const [weatherDegArr, setWeatherDegArr] = useState<Array<string>>([]);
  const [skyCondition, setSkyCondition] = useState<Array<string>>([]);
  const [precipitationType, setPrecipitationType] = useState<Array<string>>([]);
  const [precipitationProbability, setPrecipitationProbability] = useState<Array<string>>([]);
  const [onehourPrecipitation, setOnehourPrecipitation] = useState<Array<string>>([]);
  const [humidity, setHumidity] = useState<Array<string>>([]);
  const [snowCover, setSnowCover] = useState<Array<string>>([]);

  useEffect(() => {
    async function getDustGrade() {
      const res = await getFineDust();
      setDustGrade(res.data.response.body.items[0].pm10Grade);
      console.log('re', res.data.response.body.items[0]);
    }
    getDustGrade();

    async function getShortWeatherData() {
      // const res = await getShortForecast();
      const res = forecastRes;
      console.log('resssss', res.data.response.body.items);

      //... 스프레드연산자 때문에  new Set의 배열안의 타입을 정확하게 지정해 주지 않아서 에러가 났음
      setForecastTime([...new Set<string>(res.data.response.body.items.item.map((v: Item) => v.fcstTime.slice(0, 2)))]);

      setWeatherDegArr(res.data.response.body.items.item.filter((v: Item) => v.category == 'TMP').map((d: Item) => d.fcstValue));
      setSkyCondition(res.data.response.body.items.item.filter((v: Item) => v.category == 'SKY').map((d: Item) => d.fcstValue));
      setPrecipitationType(res.data.response.body.items.item.filter((v: Item) => v.category == 'PTY').map((d: Item) => d.fcstValue));
      setPrecipitationProbability(res.data.response.body.items.item.filter((v: Item) => v.category == 'POP').map((d: Item) => d.fcstValue));
      setOnehourPrecipitation(res.data.response.body.items.item.filter((v: Item) => v.category == 'PCP').map((d: Item) => d.fcstValue));
      setHumidity(res.data.response.body.items.item.filter((v: Item) => v.category == 'REH').map((d: Item) => d.fcstValue));
      setSnowCover(res.data.response.body.items.item.filter((v: Item) => v.category == 'SNO').map((d: Item) => d.fcstValue));
    }
    getShortWeatherData();
  }, []);

  // useEffect(() => {
  //   if (shortForecastData) {
  //     setWeatherDegArr(shortForecastData['한시간기온'].map((d: Item) => d.fcstValue));
  //   }
  // }, [shortForecastData]);

  return (
    <>
      <Table>
        <CaptionTitle>
          {dustGrade && (
            <>
              {dustGrade == '1' ? (
                <span>
                  미세먼지가 <GoodDust>좋음</GoodDust> 입니다 : &#41;
                </span>
              ) : dustGrade == '2' ? (
                <span>
                  미세먼지가 <CommonlyDust>보통</CommonlyDust> 입니다 :~
                </span>
              ) : dustGrade == '3' ? (
                <span>
                  미세먼지가 <BadDust>나쁨</BadDust> 입니다 : &#40;
                </span>
              ) : dustGrade == '4' ? (
                <span>
                  미세먼지가 <VeryBadDust>매우나쁨</VeryBadDust> 입니다 마스크를 착용하세요 : &lt;
                </span>
              ) : null}
            </>
          )}
        </CaptionTitle>

        <CurrentDegree>
          <IconMapper title={skyCondition[0] == '1' ? '맑음' : skyCondition[0] == '2' ? '구름조금' : skyCondition[0] == '3' ? '구름많음' : '흐림'}>
            {skyCondition[0] == '1' ? <Sunny /> : skyCondition[0] == '2' ? <LittleCloud /> : skyCondition[0] == '3' ? <Cloudy /> : <PartlyCloudy />}
          </IconMapper>
          {weatherDegArr[0]}°C
        </CurrentDegree>

        <tbody>
          <Tr>
            <th>
              <Today>오늘</Today>
            </th>
            {forecastTime.map((t: string, i: number) => (
              <TimeTile key={i}>{t}시</TimeTile>
            ))}
          </Tr>

          <Tr>
            <TableTitle></TableTitle>
            {skyCondition.map((t: string, i: number) => (
              <Td key={i}>
                <IconMapper title={skyCondition[i] == '1' ? '맑음' : skyCondition[i] == '2' ? '구름조금' : skyCondition[i] == '3' ? '구름많음' : '흐림'}>
                  {t == '1' ? <Sunny /> : t == '2' ? <LittleCloud /> : t == '3' ? <Cloudy /> : <PartlyCloudy />}
                </IconMapper>
              </Td>
            ))}
          </Tr>

          <Tr>
            <TableTitle>기온</TableTitle>
            {weatherDegArr.map((t: string, i: number) => (
              <Td key={i}>{t}°C</Td>
            ))}
          </Tr>

          <Tr>
            <TableTitle>강수확률(%)</TableTitle>
            {precipitationProbability.map((t: string, i: number) => (
              <Td key={i}>{t}</Td>
            ))}
          </Tr>

          <Tr>
            <TableTitle>강수량(mm)</TableTitle>
            {onehourPrecipitation.map((t: string, i: number) => (
              <Td key={i}>{t == '강수없음' ? 0 : t}</Td>
            ))}
          </Tr>

          <Tr>
            <TableTitle>습도(%)</TableTitle>
            {humidity.map((t: string, i: number) => (
              <Td key={i}>{t}</Td>
            ))}
          </Tr>
        </tbody>
      </Table>
      {/* {precipitationType.map((t: string, i: number) => (
        <div key={i}>강수형태 : {t == '1' ? '비' : t == '2' ? '비/눈' : t == '3' ? '눈' : t == '4' ? '소나기' : '비 소식 없음'}</div>
      ))}
      {precipitationProbability.map((t: string, i: number) => (
        <div key={i}>강수확률 : {t}%</div>
      ))}
      {onehourPrecipitation.map((t: string, i: number) => (
        <div key={i}>한시간 강수량 : {t}</div>
      ))}
      {humidity.map((t: string, i: number) => (
        <div key={i}>습도 : {t}%</div>
      ))}
      {snowCover.map((t: string, i: number) => (
        <div key={i}>적설 : {t}</div>
      ))} */}
    </>
  );
}

export default App;
