import React, { useEffect, useState } from 'react'
import './Temp.css'
import sunrise from '../assets/sunrise.png'
import sunset from '../assets/sunset.png'
import therm from '../assets/therm.png'
import rain from '../assets/rain.png'
import pressure from '../assets/pressure.png'
import visibility from '../assets/visibility.png'
import uv from '../assets/uv.png'
import wind from '../assets/wind.png'
export default function Temp() {

  const [astro, setastro] = useState('');
  const [curr, setcurr] = useState('');
  const [foreday, setforeday] = useState('');
  const [cond, setcond] = useState('');
  const [city, setCity] = useState('Kanpur');
  const [unit, setunit] = useState("C");
  const [hoursforecast,sethoursforecast]=useState([]);


  const onchange = (evt) => {
    setCity(evt.target.value);
  }

  const getData = async () => {
    try {
      
      let next8HoursTemps = [];

    
      sethoursforecast(next8HoursTemps);
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7c14c54dcb794fac883154859241209&q=${city}`);
      const jres = await res.json();
      setforeday(await jres.forecast.forecastday[0].day);
      setastro(await jres.forecast.forecastday[0].astro);
      setcurr(await jres.current);
      setcond(await jres.current.condition);
      const now = new Date();
      const hours = now.getHours();

      let forecast = await jres.forecast.forecastday[0].hour;
      for (let i = 0; i < 11; i++) {
        next8HoursTemps.push({
          "time": forecast[(i+hours)%24].time,
          "url":forecast[(i+hours)%24].condition.icon,
          "temp_c": forecast[(+i+hours)%24].temp_c,
          "temp_f": forecast[(+i+hours)%24].temp_f
        });
      }
    }
    catch (err) {
      console.log("Error while fetching data", err);
    }
  }

  const setbackground = (weather) => {
    switch (weather) {
      case 'Partly cloudy':
        return "#B0C4DE";
      case 'Rain':
        return "#4682B4";
      case 'Haze':
        return "#BEBEBE";
      case 'Mist':
        return "#D3D3D3";
      case "Light rain shower":
        return "#A9C5EB";
      case "Patchy rain nearby":
        return "#8FAFCB";
      case "Sunny":
        return "#f9e86a";
      case "Snowy":
        return "#ADD8E6";
      default:
        return "#87CEEB";
    }
  };
  const bgcolor = setbackground(cond.text);

  const mystyle = {
    backgroundColor: bgcolor,
    top: '0',
    height: '100vh',
    width: '100%',
  };
  const toggle = () => {
    const tempdeg = unit === "C" ? "F" : "C";
    setunit(tempdeg);
  }



  useEffect(() => { getData() }, [city]);
  return (
    <div className='mmm' style={mystyle}>


      <div className='nav'>
        <h1 className='heading'>Mausam Saathi</h1>
        <div className="inputdata">
          <input type='search' value={city} placeholder='Enter CITY name' onChange={onchange} />

        </div>
        <button onClick={() => { toggle() }} className='weather-btn'> &deg;{unit}</button>

      </div>
      <div className='header' >
        <div className='img-name'>
          <img src={cond.icon} alt='/' />
        </div>
        <div className='head-display'>
          <div className='city-name'>{city}</div>
          <div className='display-temp'>{unit === "C" ? foreday.mintemp_c + "° - " + foreday.maxtemp_c :
            foreday.mintemp_f + " - " + foreday.maxtemp_f}&deg;</div>
        </div>
      </div>

      <div className='container'>
        <h2 className='head1'>Today's Forecast</h2>
        <div className='hours'>
         {
        hoursforecast.map((day,index)=>{
          return (
            <div className='small-box'>
              <h3>{day.time.split(" ")[1]}</h3>
              <img src={day.url} alt=''/>
              <h3>{unit==="C"?day.temp_c:day.temp_f}&deg;</h3>
              </div>
          )
        })
         }
        </div>

      </div>

      <div className='details'>
        <h2 className='head1'>Weather Details</h2>
        <div className='details-col1'>
          <div className='det-small'>
            <div className='det-left'>
              <h3>Sunrise</h3>
              <div className='det-content'> {astro.sunrise}</div>
            </div><img src={sunrise} alt='' />
          </div>

          <div className='det-small'>
            <div className='det-left'>
              <h3>Sunset</h3>
              <div className='det-content'> {astro.sunset}</div>
            </div>
            <img src={sunset} alt='' />
          </div>

          <div className='det-small'>
            <div className='det-left'>
              <h3>Chances of Rain-<span className='det-content'> {foreday.daily_chance_of_rain}%</span></h3>

            </div>
            <img src={rain} alt='' />
          </div>

          <div className='det-small'>
            <div className='det-left'>
              <h3>Pressure</h3>
              <div className='det-content'> {curr.pressure_mb} mb</div>
            </div><img src={pressure} alt='' />
          </div>

        </div>
        <div className='details-col2'>

          <div className='det-small'>
            <div className='det-left'>
              <h3>Wind</h3>
              <div className='det-content'> {curr.wind_kph} Km/h</div>
            </div>
            <img src={wind} alt='' />
          </div>

          <div className='det-small'>
            <div className='det-left'>
              <h3>UV index</h3>
              <div className='det-content'> {foreday.uv} out of 10</div>
            </div><img src={uv} alt='' />
          </div>

          <div className='det-small'>
            <div className='det-left'>
              <h3>Feels like</h3>
              <div className='det-content'> {unit === "C" ? curr.temp_c : curr.temp_f}&deg; </div>
            </div><img src={therm} alt='' />
          </div>

          <div className='det-small'>
            <div className='det-left'>
              <h3>Visibility</h3>
              <div className='det-content'> {curr.vis_km} Km</div>
            </div><img src={visibility} alt='' />
          </div>
        </div>
      </div>
    </div>

  )
}
