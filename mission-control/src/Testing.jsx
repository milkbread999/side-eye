import {useEffect, useState} from 'react';
import reactLogo from './assets/react.svg'
import './App.css'
import React from 'react'
import { render } from 'react-dom'
import axios from 'axios';


const CLIENT_ID = "2c5bb24506ae43338c9a497fb5a29782"
const REDIRECT_URI = "http://localhost:5173/callback"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const scopes = "user-read-private user-read-email user-read-recently-played"


async function fetchWeatherData(){
  const data = await fetch("https://api.weather.gov/gridpoints/MTR/86,95/forecast")
  return (data.json())
}

async function fetchSpotifyData(token){
  const data = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
    method:'get',
    headers: new Headers({
      'Authorization':'Bearer ' + token,
    }),
  })
  return (data.json())
  
}



export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      currentTime: new Date().getHours()
      
    }
  }
  
  updateWeatherData(){
    fetchWeatherData().then(data=>{
      console.log(data)
      const todayForecast = data.properties.periods[0]
      this.setState({
        temp: todayForecast.temperature,
        forecast: todayForecast.shortForecast
      })
      console.log(this.state.temp)
    })
  }  

  componentDidMount(){
    this.updateWeatherData()
    setInterval(this.updateWeatherData,100000)
  }

  render(){
    let greeting;
 

    if (this.state.currentTime < 12) {
      greeting = 'Good Morning';
    } else if (this.state.currentTime < 18) {
      greeting = 'Good Afternoon';
    } else if (this.state.currentTime < 22) {
      greeting = 'Good Evening';
    } else {
      greeting = 'Good Night';
    }
  
    return (
      <div className="App">
        <h1>{greeting} 🫡</h1>
        <h2>the temperature is {this.state.temp} degrees</h2>
        <p> {this.state.forecast} </p>
        <div className="card">
            < Spotify/>
        </div>
      </div>
    )
  }
}

class Spotify extends React.Component {

  constructor(props){
    super(props)
    this.state={
      token: "",
      hash: window.location.hash,
      logout: () => {
        this.setState({
          token: ""
        })
        window.localStorage.removeItem("token")
      }
    }
  }

  getSpotifyData(token){
    fetchSpotifyData(token).then(data=>{
      const recentTracks = [`${data.items[0].track.name} by ${data.items[0].track.artists[0].name}`];
      const recentIDs = [`${data.items[0].track.id}`];
      console.log(recentTracks);
      console.log(data);
      this.setState({
        recentTracks: recentTracks,
        recentIDs: recentIDs,
      });
    }).catch(error=>console.log(error));
  }

 componentDidMount() {
  let token = window.localStorage.getItem("token");
  const hash = window.location.hash;

  if (!token && hash) {
    token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

    window.location.hash = "";
    window.localStorage.setItem("token", token);
  }

  this.setState({
    token: token
  });
}

  componentDidUpdate(){
    if (this.state.token != null) {
        this.getSpotifyData(this.state.token)
    }
  }


  render() {
    const { logout, token, recentTracks, recentIDs } = this.state;
    console.log(token);
    return (
      <div>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${scopes}&redirect_uri=${REDIRECT_URI}`}>log in to spotify</a>
          : <button onClick={logout}>log out</button>}
          <p>{recentTracks}</p>
          <p>{recentIDs}</p>
      </div>
    );
  }

}