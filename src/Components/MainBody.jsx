import React ,{ useState, useEffect } from 'react'
import light from '../assets/lightbg.jpg'
import dark from '../assets/darkbg.jpg'
import cloud from '../assets/cloud.png'
import './MainBody.css'
import { BsCloudSun } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { CiCloudMoon } from "react-icons/ci";
import { MapContainer, TileLayer, Marker, Popup , useMap  ,useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Weather from './Weather'

const API_KEY = "0abe1d6c06b887e51fbd28fcf39cfaaa";
const MainBody = () => {
  const [theme, setTheme] = useState("light");
const [countries, setCountries] = useState([]);
const [filteredCountries, setFilteredCountries] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [city , setCity] = useState("")
const [coords, setCoords] = useState([20, 77]);
const [weather, setWeather] = useState(null);
function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);

  return null;
}
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
   
    setTheme(newTheme);
    document.body.className = newTheme;   
  };
  useEffect(() => {
  const fetchCountries = async () => {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags,latlng");
      const data = await res.json();
      setCountries(data);
      setFilteredCountries(data); // start with full list
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };
  fetchCountries();
}, []);
   const murl = theme === "dark" ? "https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=CbYebNl5DnTcXtWqBX4VYwojWku8TH8PcR6mJ0kuNRjsUdwvHjxchRWku7yrFiUh" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const bg = theme === "light" ? light : dark;
  function RecenterMap({ coords }) {
  const map = useMap();

  useEffect(() => {
    map.setView(coords, map.getZoom()); 
  }, [coords, map]);

  return null;
}
const getWeather = async (lat, lng) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();   // <-- actual JSON object
  setWeather(data);                // <-- now weather is full JSON
};
function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);   // update local marker
      onSelect([lat, lng]);
      getWeather(lat , lng)
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
}
  
  return (
    <div className=''>

        <img className='mainbody_bg' src={bg} alt="" />

        <div className="mainbody">
            <div className="mainbody_navbar">
              <div className="mainbody_navbar_left">

                <p className="mainbody_title">Weather Report</p>
                <img className='mainbody_cloud' src={cloud} alt="" />
                
              </div>

              <div className="mainbody_navbar_mid"></div>
              <div className="mainbody_navbar_right">  {theme === "light" ? <CiCloudMoon onClick={toggleTheme} className='mainbody_toggle' size={40}/> : <BsCloudSun onClick={toggleTheme} className='mainbody_toggle' size={38}/>}</div>
            </div>
            <div className="mainbody_body">

              <div className="mainbody_inputarea">
                   <div className="inputfiller"></div>
              <input 
                  type="text"
                  value={city}
                  placeholder="Enter country"
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setCity(e.target.value);
                    const search = e.target.value.toLowerCase();
                    const matches = countries.filter(c =>
                      c.name.common.toLowerCase().startsWith(search)
                    );
                    setFilteredCountries(matches);
                  }}
               className="mainbody_input" 
               />
              {/* <button className="mainbody_search"><IoMdSearch size={25}/></button> */}

              </div>
            
             

              {showDropdown && (
                    <ul className="dropdown">
                      {filteredCountries.map((c) => (
                        <li
                          key={c.cca2}
                          onClick={() => {
                           setCity(c.name.common);
                            setCoords(c.latlng);  
                            setShowDropdown(false);
                          }}
                        >
                          <img src={c.flags.png} alt={c.name.common} width={20} />
                          {c.name.common}
                        </li>
                      ))}
                    </ul>
                )}
                <div className="mainbody_map_weather">
                    <MapContainer
                    center={coords}
                    zoom={5}
                    className='mainbody_map'
                  >
                    <TileLayer
                      url={murl}
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker position={coords}>
                      <Popup>{city}</Popup>
                    </Marker>
                      <RecenterMap coords={coords} />
                        <LocationMarker onSelect={(latlng) => console.log("Clicked:", latlng)} />
                          <FixMapResize/>
                </MapContainer>

              <Weather className="container_weather" weather={weather}/>  
                </div>
                
            </div>
        </div>

    </div>
  )
}

export default MainBody