import './App.css';
import { useEffect, useState } from 'react';
import data from './file1.json';

// var data = [{
//   "code": "0001",
//   "lat": "1.28210155945393",
//   "lng": "103.81722480263163",
//   "location": "Stop 1"
// }, {
//   "code": "0003",
//   "lat": "1.2777380589964",
//   "lng": "103.83749709165197",
//   "location": "Stop 2"
// }, {
//   "code": "0002",
//   "lat": "1.27832046633393",
//   "lng": "103.83762574759974",
//   "location": "Stop 3"
// }];

function App() {
  const [location, setLocation] = useState("")
  const [allLocations, setAlllocations] = useState([])
  const [resultingLocation, setResultingLocation] = useState({
    name: "",
    address: "",
    distance: 0
  })
  const [answer, setAnswer] = useState({
    polygon: "",
    restaurant: ""
  })


  async function findAddress() {
    let url = "https://nominatim.openstreetmap.org/search?format=json&limit=2&q=" + location

    const response = await fetch(url);
    const data = await response.json();
    console.log(data)

    if (data.length > 0) {
      data.map(element => {
        console.log(element.display_name, element.lat, element.lon)
        const obj = {
          name: element.display_name,
          latitude: element.lat,
          longitude: element.lon
        }

        setAlllocations((prevState) => {
          return [...prevState, obj]
        })
      })
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    findAddress();
    setAlllocations([])
    setResultingLocation({
      name: "",
      address: "",
      distance: 0
    })
    setAnswer({
      polygon: "",
      restaurant: ""
    })
  }

  const findRestaurant = async (poslat, poslng) => {

    try {
      const reqData = {
        latitude: poslat,
        longitude: poslng
      }
      const response = await fetch("http://localhost:8000", {
        method: "POST",
        body: JSON.stringify(reqData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data)

      console.log(data.polygon.properties.name)
      setAnswer({
        polygon: data.polygon.properties.name,
        restaurant: data.restaurant.properties.name
      })
    }
    catch (err) {
      // if (data.status === 204) {
      setAnswer({
        polygon: 'not found',
        restaurant: 'not found'
      })
      // }
    }
  }

  return (
    <div className="App">
      <form onSubmit={submitHandler} className="form">
        <input type="text" placeholder='enter a location' onChange={(e) => setLocation(e.target.value)} />
        <button type="submit">submit</button>
      </form>
      {allLocations.map((element) => (
        <div onClick={() => findRestaurant(element.latitude, element.longitude)} style={{ textAlign: "left" }} className="location">
          <span >{element.name}, </span>
          <span>{element.latitude},  </span>
          <span>{element.longitude}</span>
        </div>
      )
      )}

      {/* {resultingLocation.name && <div style={{ textAlign: "left", marginLeft: "2rem" }}>
        <h2>Restaurant</h2>
        <p>Name - {resultingLocation.name}</p>
        <p>Address - {resultingLocation.address} </p>
        <p>Distance from the location - {resultingLocation.distance} km</p>
      </div>} */}

      {/* <h1>{answer.polygon}</h1> */}
      {answer.polygon && <div>
        <h1>Polygon - {answer.polygon}</h1>
        <h1>Restaurant - {answer.restaurant}</h1>
      </div>}

    </div>
  );
}

export default App;
