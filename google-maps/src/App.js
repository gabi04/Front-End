import React, {useState, useEffect} from 'react';
import './App.css';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
const INIT_COORDINATES = { lat: 4.6482837, lng: -74.2478919 }
const MAP_ZOOM = 14
const AUTOCOMPLETE_RADIUS = 1000

let map
let marker
let autocomplete

const getCityAndCountryFromAutocomplete = addressComponents => {
  let city, country
  if (addressComponents.address_components) {
    addressComponents.address_components.forEach(component => {
      if (component.types) {
        if (component.types.filter(type => type === 'country').length) {
          country = component.long_name
        }
        if (component.types.filter(type => type === 'locality').length) {
          city = component.long_name
        }
      }
    })
  }
  return { city: city || '', country: country || '' }
}

const getCityAndCountryFromMap = results => {
  let city_aux, country_aux

  for (let i = 0; i < results.length; i++) {
    const {city, country} = getCityAndCountryFromAutocomplete(results[i])
    city_aux = city_aux || city
    country_aux = country_aux || country
  }

  console.log(city_aux || '', country_aux || '')
  return { city: city_aux || '', country: country_aux || '' }
}

const getAddress = async coords => {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`
  )
    .then(response => response.json())
    .then(data => {
      if (data.results.length) { return { addressComponents: data.results, formattedAddress: data.results[0].formatted_address } }
    })
    .catch(error => console.log(`Reverser Geocoding Error: ${error}`))
}

function App () {
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('')

  useEffect(_ => {
    const autocompleteInput = document.getElementById('autocompleteInput')
    const mapDiv = document.getElementById('map')

    map = new window.google.maps.Map(mapDiv, { zoom: MAP_ZOOM, center: INIT_COORDINATES, gestureHandling: 'cooperative' })
    marker = new window.google.maps.Marker({ position: INIT_COORDINATES, map })
    autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput)
    autocomplete.setFields(['address_components', 'geometry'])

    autocomplete.addListener('place_changed', _ => {
      const response = autocomplete.getPlace()
      const coords = { lat: response.geometry.location.lat(), lng: response.geometry.location.lng() }
      const { city, country } = getCityAndCountryFromAutocomplete(response)

      console.log(city, country, coords.lat, coords.lng)
      map.setCenter(coords)
      marker.setPosition(coords)
    })

    map.addListener('dragend', async _ => {
      const coords = { lat: map.getCenter().lat(), lng: map.getCenter().lng() }
      const { addressComponents, formattedAddress } = await getAddress(coords)
      const { city, country } = getCityAndCountryFromMap(addressComponents)

      console.log(city, country, coords.lat, coords.lng)
      marker.setPosition(coords)
      setAutocompleteInputValue(formattedAddress)
    })
  }, [])

  useEffect(_ => {
    const setMapAutoAndcompleteCenter = async initCoordinates => {
      const circle = new window.google.maps.Circle({ center: initCoordinates, radius: AUTOCOMPLETE_RADIUS })
      const { addressComponents, formattedAddress } = await getAddress(initCoordinates)
      const { city, country } = getCityAndCountryFromMap(addressComponents)
      
      console.log(formattedAddress, city, country, initCoordinates.lat, initCoordinates.lng)
      map.setCenter(initCoordinates)
      autocomplete.setBounds(circle.getBounds())
    }

    navigator.geolocation.getCurrentPosition(
      coordinates => setMapAutoAndcompleteCenter({ lat: coordinates.coords.latitude, lng: coordinates.coords.longitude }),
      err => {
        setMapAutoAndcompleteCenter(INIT_COORDINATES)
        console.log(`navigator.geolocation.getCurrentPosition error: ${err}`)
      }
    )
  }, [])
  
  return (
    <>
      <input id="autocompleteInput" type="text" defaultValue={autocompleteInputValue} />
      <div id='map' className='map' />
    </>
  )
}

export default App;
