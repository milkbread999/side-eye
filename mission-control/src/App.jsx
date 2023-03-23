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
const scopes = "user-read-private user-read-email user-read-currently-playing"


async function fetchWeatherData(){
  const data = await fetch("https://api.weather.gov/gridpoints/MTR/86,95/forecast")
  return (data.json())
}

async function fetchSpotifyData(token){
  const spotify = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method:'get',
    headers: new Headers({
      'Authorization':'Bearer ' + token,
    }),
  })
  return (spotify.json())
  
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
      greeting = 'Good Morning 🌞';
    } else if (this.state.currentTime < 18) {
      greeting = 'Good Afternoon 😎';
    } else if (this.state.currentTime < 22) {
      greeting = 'Good Evening ⭐️';
    } else {
      greeting = 'Good Night 🌚';
    }
  
    return (
      <div className="App">
        <h1>{greeting} </h1>
        <h2>the temperature is {this.state.temp} degrees</h2>
        <p> {this.state.forecast} </p>
        <div className="card">
            <p>-----</p>
            < Quotes/>
            <p>-----</p>
            < Spotify/>
        </div>
      </div>
    )
  }
}
class Quotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: null,
    };
    this.quotes = {
      "i get everything i want 'cause i attract it": {
        artist: "Ariana Grande",
        song: "Just Like Magic",
      },
      "my dream is like a child and i'm taking all the custody": {
        artist: "Saweetie",
        song: "Icy Grl",
      },
      "when i walk in the room, i can still make the whole place shimmer": {
        artist: "Taylor Swift",
        song: "Bejeweled",
      },
      "on a scale of one to ten i'm at a hundred": {
        artist: "Ariana Grande",
        song: "The Way",
      },
      "my presence sweet and my aura bright": {
        artist: "Ariana Grande",
        song: "Shut Up",
      },
      "good karma, my aesthetic, keep my conscience clear, that’s why i’m so magnetic": {
        artist: "Ariana Grande",
        song: "Just Like Magic",
      },
      "get into it, yuh": {
        artist: "Doja Cat",
        song: "Get Into It (Yuh)",
      },
    };
  }

  getQuote() {
    const quotesKeys = Object.keys(this.quotes);
    const randomQuote = this.quotes[quotesKeys[Math.floor(Math.random() * quotesKeys.length)]];
    console.log(randomQuote);
    this.setState({
      quote: randomQuote,
    });
  }

  render() {
    const { quote } = this.state;
    return (
      <div>
        <p>
          {quote && `"${Object.keys(this.quotes).find((key) => this.quotes[key] === quote)}"`}
        </p>
        <p>
          {quote && `— ${quote.artist}, ${quote.song}`}
          </p>
        <button onClick={() => this.getQuote()}>get motivated</button>
        <p> </p>
      </div>
    );
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
      const title = `${data?.item?.name} by ${data?.item?.artists?.[0]?.name}`;
      const cover = `${data.item?.album?.images?.[0]?.url}`;
      const artist = `${data?.item?.artists?.[0]?.name}`;
      console.log(title);
      console.log(cover);
      console.log(data);
      console.log("test")
      console.log(artist)
      this.setState({
        title: title,
        cover: cover,
        artist: artist,
      });
    }).catch(error=>console.log(error));
  }


 componentDidMount() {

  this.getSpotifyData(this.state.token)
  setInterval(this.getSpotifyData,100000)

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
    const { logout, token, title, cover, artist} = this.state;
    // console.log(token);
    let slayfulness = "0%";
    if ((artist ===
      "Ariana Grande")||(artist ===
        "Taylor Swift")||(artist ===
          "SZA")||(artist ===
            "Doja Cat")||(artist ===
              "Rihanna")||(artist ===
                "Beyoncé"))
      {
        slayfulness = "100%";
      }
    if ((artist ===
        "BTS")||(artist ===
          "Kali Uchis")||(artist ===
            "Nicki Minaj")||(artist ===
              "The Weeknd")||(artist ===
                "Megan Thee Stallion")||(artist ===
                  "TAEMIN"))
        {
          slayfulness = "76%";
        }
    if ((artist ===
          "Lizzo")||(artist ===
            "Frank Ocean")||(artist ===
              "Drake")||(artist ===
                "BLACKPINK")||(artist ===
                  "Ice Spice")||(artist ===
                    "Cardi B"))
          {
            slayfulness = "42%";
          }
    
    
    return (
      <div>
        <style>
  @import url('https://fonts.googleapis.com/css2?family=Cutive+Mono&display=swap');
</style>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${scopes}&redirect_uri=${REDIRECT_URI}`}>log in to spotify</a>
          : <button onClick={logout}>log out</button>}
          <h2>now playing: {title}</h2>
          <img className='albumcover' src={cover}/>
          <p>slayfulness = {slayfulness}</p>
      </div>
    );
  }

}