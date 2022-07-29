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
  const [restaurantData, setRestaurantData] = useState([])
  const [location, setLocation] = useState("")
  const [allLocations, setAlllocations] = useState([])
  const [resultingLocation, setResultingLocation] = useState({
    name: "",
    address: "",
    distance: 0
  })

  useEffect(() => {
    const transformedData = data[9].restaurants.map((res) => {
      return { name: res.restaurant.name, latitude: res.restaurant.location.latitude, longitude: res.restaurant.location.longitude, address: res.restaurant.location.address }
    })
    setRestaurantData(transformedData)
    console.log(transformedData)
  }, [])



  async function findAddress() {
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + location

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
  }


  function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === "K") { dist = dist * 1.609344 }
    if (unit === "N") { dist = dist * 0.8684 }
    return dist
  }


  const findRestaurant = (poslat, poslng) => {
    let res = 10000000;

    for (var i = 0; i < restaurantData.length; i++) {
      let ans = distance(poslat, poslng, restaurantData[i].latitude, restaurantData[i].longitude, "K")

      let prev;
      prev = res;
      res = Math.min(res, ans)

      if (prev !== res) {
        setResultingLocation({
          name: restaurantData[i].name,
          address: restaurantData[i].address,
          distance: res
        })
      }
    }
  }

  return (
    <div className="App">
      <form onSubmit={submitHandler} className="form">
        <input type="text" placeholder='enter a location' onChange={(e) => setLocation(e.target.value)} />
        <button type="submit">submit</button>
      </form>
      {allLocations.map((element) => (
        <div onClick={() => findRestaurant(element.latitude, element.longitude)} className="location">
          <span >{element.name}, </span>
          <span>{element.latitude},  </span>
          <span>{element.longitude}</span>
        </div>
      )

      )}

      {resultingLocation.name && <div>{resultingLocation.name} -- {resultingLocation.address} --- {resultingLocation.distance} km</div>}

    </div>
  );
}

export default App;
