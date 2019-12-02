import React, { useEffect, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import fetch from 'isomorphic-fetch'
import { Form, Input, Icon, Col, Button, Row } from 'antd'
import { StoreContext } from '../../../../../../../../../Main/Contexts/StoreContext'

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
const CREATE = 'addStore'
const MAP_ZOOM = 14
const AUTOCOMPLETE_RADIUS = 1000

let map
// let marker
let autocomplete

const getCityAndCountryFromAddressComponents = addressComponents => {
  let city, country

  addressComponents.forEach(component => {
    if (component.types) {
      if (component.types.filter(type => type === 'country').length) {
        country = component.long_name
      }
      if (component.types.filter(type => type === 'locality').length) {
        city = component.long_name
      }
    }
  })

  return { city: city || '', country: country || '' }
}

const getCityAndCountryFromReverseGeolocationResults = reverseGeolocarionResults => {
  let localCity, localCountry

  for (let i = 0; i < reverseGeolocarionResults.length; i++) {
    const { city, country } = getCityAndCountryFromAddressComponents(reverseGeolocarionResults[i].address_components)
    localCity = localCity || city
    localCountry = localCountry || country
  }

  return { city: localCity || '', country: localCountry || '' }
}

const getInverseGeolocationData = async coords => {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`
  )
    .then(response => response.json())
    .then(data => {
      if (data.results.length) { 
        return { reverseGeolocarionResults: data.results, formattedAddress: data.results[0].formatted_address } 
      }else{
        return { reverseGeolocarionResults: [], formattedAddress: '' }
      }
    })
    .catch(error => {
      console.log(`Reverser Geocoding Error: ${error}`)
      return { reverseGeolocarionResults: [], formattedAddress: '' }
    })
}

const FormLocation = ({ form, formType, storeToUpdate = {} }) => {
  const { t } = useTranslation()
  const { getFieldDecorator } = form
  const [localAddress, setLocalAddress] = useState('')
  const [localLat, setLocalLat] = useState('')
  const [localLng, setLocalLng] = useState('')
  const { setState, city, country, latitude, longitude } = useContext(StoreContext)
  const initCoordinates = formType !== CREATE && storeToUpdate
    ? { lat: storeToUpdate.location.latitude, lng: storeToUpdate.location.longitude }
    : { lat: 4.6482837, lng: -74.2478919 }

  const setStore = (address, city, country, lat, lng) => {
    setLocalAddress(address)
    setState('latitude', lat)
    setState('longitude', lng)
    setState('city', city)
    setState('country', country)
  }

  const handleLatitudeChange = e => {
    const latitude = e.target.value
    form.setFieldsValue({latitude})
    setLocalLat(latitude)
  }

  const handleLongitudeChange = e => {
    const longitude = e.target.value
    form.setFieldsValue({longitude})
    setLocalLng(longitude)
  }

  useEffect(_ => {
    const autocompleteInput = document.getElementById('autocompleteInput')
    const mapDiv = document.getElementById('mapDiv')

    map = new window.google.maps.Map(mapDiv, { zoom: MAP_ZOOM, center: initCoordinates, gestureHandling: 'cooperative' })
    // marker = new window.google.maps.Marker({ position: initCoordinates, map })
    autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput)
    autocomplete.setFields(['name', 'formatted_address', 'address_components', 'geometry'])

    autocomplete.addListener('place_changed', _ => {
      const response = autocomplete.getPlace()

      if (response) {
        const { city, country } = getCityAndCountryFromAddressComponents(response.address_components)
        const { name, formatted_address } = response

        setStore(`${name}, ${formatted_address}`, city, country, response.geometry.location.lat(), response.geometry.location.lng())
      } else {
        console.log('Can\'t get place from Google Places API')
      }
    })

    map.addListener('dragend', async _ => {
      const coords = { lat: map.getCenter().lat(), lng: map.getCenter().lng() }
      const { reverseGeolocarionResults, formattedAddress } = await getInverseGeolocationData(coords)
      const { city, country } = getCityAndCountryFromReverseGeolocationResults(reverseGeolocarionResults)

      setStore(formattedAddress, city, country, coords.lat, coords.lng)
    })
  }, [])

  useEffect(_ => {
    const createInitialize = async initCoordinates => {
      const circle = new window.google.maps.Circle({ center: initCoordinates, radius: AUTOCOMPLETE_RADIUS })
      const { reverseGeolocarionResults, formattedAddress } = await getInverseGeolocationData(initCoordinates)
      const { city, country } = getCityAndCountryFromReverseGeolocationResults(reverseGeolocarionResults)

      setStore(formattedAddress, city, country, initCoordinates.lat, initCoordinates.lng)
      form.setFieldsValue({latitude: initCoordinates.lat})
      form.setFieldsValue({longitude: initCoordinates.lng})
      autocomplete.setBounds(circle.getBounds())
    }

    const updateInitialize = _ => {
      const circle = new window.google.maps.Circle({ center: initCoordinates, radius: AUTOCOMPLETE_RADIUS })
      const { address, city, country } = storeToUpdate ? storeToUpdate.location : { address: '', city: '', country: '' }

      setStore(address, city, country, initCoordinates.lat, initCoordinates.lng)
      form.setFieldsValue({latitude: initCoordinates.lat})
      form.setFieldsValue({longitude: initCoordinates.lng})
      autocomplete.setBounds(circle.getBounds())
    }

    formType === CREATE
      ? navigator.geolocation.getCurrentPosition(
        coordinates => createInitialize({ lat: coordinates.coords.latitude, lng: coordinates.coords.longitude }),
        err => {
          createInitialize(initCoordinates)
          console.log(`navigator.geolocation.getCurrentPosition error: ${err}`)
        }
      )
      : updateInitialize()
  }, [formType, storeToUpdate])

  useEffect(_ => {
    form.setFieldsValue({ autocompleteInput: localAddress })
  }, [localAddress])

  useEffect(_ => {
    if (typeof (latitude) === 'number' && typeof (longitude) === 'number') {
      const coords = { lat: latitude, lng: longitude }
      map.setCenter(coords)
      // marker.setPosition(coords)
    }
  }, [latitude, longitude])

  return (
    <>
      <Form.Item className='coordinates' label={t('resources.tab.STORES.form.coordinates.label')}>
        {getFieldDecorator('autocompleteInput', {
          rules: [{ required: true, message: t('resources.tab.STORES.form.coordinates.message') }]
        })(
          <Input
            prefix={<Icon type='environment' />}
            placeholder={t('resources.tab.STORES.form.coordinates.placeholder')}
          />
        )}
      </Form.Item>

      <Form layout="inline">
        <Form.Item className="lat-lng-input">
          {getFieldDecorator('latitude', {
            rules: [
              {
                required: true,
                message: 'Please enter de latitude',
              },
            ],
          })(<Input type="number" onChange={handleLatitudeChange} placeholder="latitude" />)}
        </Form.Item>
        
        
        <Form.Item className="lat-lng-input">
          {getFieldDecorator('longitude', {
            rules: [
              {
                required: true,
                message: 'Please enter de longitude',
              },
            ],
          })(<Input type="number" onChange={handleLongitudeChange} placeholder="longitude" />)}
        </Form.Item>
        
        <Form.Item className="lat-lng-btn">
          <Button 
            type="primary"
            onClick={_ => {
              setState('latitude', parseFloat(localLat)); 
              setState('longitude', parseFloat(localLng))
            }}
          >
            Ok
          </Button>
        </Form.Item>
      </Form>
      <div>
        <div id='mapDiv' className='map' />
        <img className='marker' src='./marker.png' alt='marker' />
      </div>

      <h4>{`${city}, ${country}`}</h4>
    </>
  )
}

export default Form.create()(FormLocation)
