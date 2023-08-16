const express = require('express');
const {json} = require('express')
const cors = require('cors');
const geohash = require('ngeohash');
const SpotifyWebApi = require('spotify-web-api-node');
const port = 3000;
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_ID,
});

async function refreshSpotifyToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    const accessToken = data.body.access_token;
    spotifyApi.setAccessToken(accessToken);
  } catch (error) {
    console.error('Error getting access token:', error.message);
  }
}
async function handleSpotifyToken(){
  await refreshSpotifyToken();
  setInterval(refreshSpotifyToken, 1000 * 60 * 60);
}

class Event {
  constructor(date, time, icon, Name, genre, venue, eventId, segments, subGenre, type, artists, ticketStatus, seatMap, buyTickets, priceRanges, category){
    this.date = date
    this.time = time
    this.icon = icon
    this.Name = Name
    this.genre = genre
    this.venue = venue
    this.eventId = eventId
    this.segments = segments
    this.subGenre = subGenre
    this.type = type
    this.artists = artists
    this.ticketStatus = ticketStatus
    this.seatMap = seatMap
    this.buyTickets = buyTickets
    this.priceRanges = priceRanges
    this.category = category
  }
}


class Artist {
  constructor(name, id, image, popularity, numFollowers, spotifyUrl) {
    this.name = name
    this.id = id
    this.image = image
    this.popularity = popularity
    this.numFollowers = numFollowers
    this.spotifyUrl = spotifyUrl
  }
}


segmentLookup = {"Music": "KZFzniwnSyZfZ7v7nJ", "Sports": "KZFzniwnSyZfZ7v7nE",
                 "Arts & Theatre": "KZFzniwnSyZfZ7v7na", "Film": "KZFzniwnSyZfZ7v7nn",
                 "Miscellaneous": "KZFzniwnSyZfZ7v7n1", 'Default': ''}


const app = express();
app.use(cors());
app.use('/', express.static('dist/hw8'))

const ticketMasterKey = 'QdStd50Qg56HkTqC81RuovXmPqGD4Ce3'
const eventUrl = "https://app.ticketmaster.com/discovery/v2/events.json?"
const specificEventUrl = "https://app.ticketmaster.com/discovery/v2/events"

// https://app.ticketmaster.com/discovery/v2/suggest?apikey=YOUR_API_KEY&keyword=[KEYWORD]

app.get('/', function(req, res) {
  __dirname = process.cwd()
  res.sendFile(__dirname + '/src/index.html');
});

const suggestUrl = 'https://app.ticketmaster.com/discovery/v2/suggest'
app.get('/suggestions/:keywords', async function (req, res) {
  try {
    let keywords = req.params.keywords;
    let formattedKeywords = keywords.split(' ').join('+');
    let resp = await fetch(`${suggestUrl}?keyword=${formattedKeywords}&apikey=${ticketMasterKey}`);

    if (!resp.ok) {
      return res.status(resp.status).send(`Error from Ticketmaster API: ${resp.statusText}`);
    }

    let jsonData = await resp.json();
    let names = {};
    let items = jsonData?._embedded?.attractions;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if ('name' in items[i]) {
          names[i] = items[i].name;
        }
      }
    }
    res.send(names);
  } catch (error) {
    console.error('Error in /suggestions/:keywords:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

app.get('/event', async function(req, res){

  let eventArgs = {
    "geoPoint": geohash.encode(req.query.lat, req.query.lon, 7),
    "radius": req.query.radius,
    "segmentId": segmentLookup[req.query.category],
    "keyword": req.query.keywords,
    'apikey': ticketMasterKey
  }
  let events = await fetch(eventUrl + new URLSearchParams(eventArgs))
    .then((resp) => {
      if (resp.ok) {
        return resp.json()
      }
    }).then((jsonObj) => {
      return jsonObj?._embedded?.events
    })

  let eventsData = [];
  let index = 0
  if (events && Object.keys(events).length > 0) {
    for (let event of events) {
      if (index >= 20) {
        break
      }
      let date = event?.dates?.start?.localDate
      let time = event?.dates?.start?.localTime
      let images = event?.images
      let icon = ''
      if (images.length > 0) {
        icon = images[0]?.url
      }
      let Name = event?.name
      let genre = event?.classifications[0]?.genre?.name
      let segment = event?.classifications[0]?.segment?.name
      let subGenre = event?.classifications[0]?.subGenre?.name
      let type = event?.classifications[0]?.type?.name
      let venues = event?._embedded?.venues
      let attractions = event?._embedded?.attractions
      let ticketStatus = event?.dates?.status?.code
      let seatMap = event?.seatmap?.staticUrl
      let buyTickets = event?.url
      let priceRanges = ''
      if (event?.priceRanges && event?.priceRanges.length > 0){
        priceRanges = `${event?.priceRanges[0]?.min} - ${event?.priceRanges[0]?.max}`
      }
      let artists = []
      if (attractions && attractions.length > 0) {
        for (let attraction of attractions){
          artists.push(attraction.name)
        }
      }
      let venue = ''
      if (venues.length > 0) {
        venue = venues[0]?.name
      }
      let eventId = event?.id

      eventsData.push(new Event(date, time, icon, Name, genre, venue, eventId, segment, subGenre, type, artists, ticketStatus, seatMap, buyTickets, priceRanges))
      //
      index++
    }
    eventsData.sort((a, b) => {
      if(a.date + a.time < b.date + b.time) return -1;
      else return 1
    })
    res.send(eventsData)
  }else{
    res.send({})
  }

})


// get venue details
app.get('/venue/:venueName', async function(req, res){
  let venueDetails = await fetch(`https://app.ticketmaster.com/discovery/v2/venues.json?keyword=${req.params.venueName}&apikey=${ticketMasterKey}`)
    .then((resp) => {
      if (resp.ok) {
        return resp.json()
      }
    }).then((jsonObj) => {
      let [name, Address, openHours, phone, generalRule, childRule] = ['', '', '', '', '', '']
      let venue = jsonObj?._embedded?.venues[0]
      if (venue) {
        name = venue?.name
        Address = venue?.address?.line1
        openHours = venue?.boxOfficeInfo?.openHoursDetail
        phone = venue?.boxOfficeInfo?.phoneNumberDetail
        generalRule = venue?.generalInfo?.generalRule
        childRule = venue?.generalInfo?.childRule
      }
      return {name, Address, openHours, phone, generalRule, childRule}
    })
  res.send(venueDetails)
})

app.get('/spotify/artist/:eventId', async function(req, res){
  // get event from ticketmaster using eventid
  let musicArtists = []
  await fetch(specificEventUrl + '/' + req.params.eventId + `.json?apikey=${ticketMasterKey}`)
    .then((resp) => {
    if (resp.ok) {
      return resp.json()
    }
  }).then((jsonObj) => {
    // if segments.toLowerCase() == 'music'
    let classifications = jsonObj?.classifications
    if (classifications && classifications.length > 0) {
      for (let classification of classifications) {
        if (classification?.segment?.name.toLowerCase() === 'music') {
          let artists = jsonObj?._embedded?.attractions
          if (artists && artists.length > 0) {
            for (let artist of artists) {
              musicArtists.push(artist.name)
            }
          }
        }
      }
    }
  })
  console.log('music artsits: ', musicArtists)
  await refreshSpotifyToken()
  const options = {
    limit: 2,
    offset: 0,
  };
  let promises = []
  for (let i = 0; i < musicArtists.length; i++) {
    promises.push(spotifyApi.searchArtists(musicArtists[i], options))
  }
  let i = 0;
  let artistDetails = []
  try {
    const responses = await Promise.all(promises);
    for (let response of responses) {
      let artistId = response?.body?.artists?.items[0]?.id;
      let artistUrl = response?.body?.artists?.items[0]?.external_urls?.spotify;
      let popularity = response?.body?.artists?.items[0]?.popularity;
      let numFollowers = response?.body?.artists?.items[0]?.followers?.total;
      let artistImg = response?.body?.artists?.items[0]?.images[0]?.url;
      let newArtist = new Artist(musicArtists[i], artistId, artistImg, popularity, numFollowers, artistUrl);
      //                        (name,              id,       image,      genres,   popularity, spotifyUrl)
      artistDetails.push(newArtist);
      i++;
    }
    // Access the artistDetails array here, after it has been filled.
  } catch {
    console.log('error')
  }
  res.send(artistDetails)

});

app.get('/spotify/albums/:artistId', async function(req, res){
  await refreshSpotifyToken()
  const artistId = req.params.artistId;
  const options = {
    limit: 3,
    offset: 0,
  };
  spotifyApi.getArtistAlbums(artistId, options)
    .then(function(data) {
      let albumImages = []
      let items = data.body.items
      if(items?.length > 0){
        for (let item of items) {
          albumImages.push(item.images[0].url)
        }
      }
      res.send(albumImages)
    }, function(err) {
      console.error(err);
      res.send(err)
    });

});

app.get('/event/:eventId', async function(req, res) {
  let musicArtistNames = []
  await fetch(specificEventUrl + '/' + req.params.eventId + `.json?apikey=${ticketMasterKey}`)
    .then((resp) => {
      return resp.json()
    }).then((jsonObj) => {
      let attractions = jsonObj?._embedded?.attractions
      if (attractions?.length > 0) {
        for (let attraction of attractions) {
          if (attraction?.classifications[0]?.segment?.name.toLowerCase() === 'music') {
            musicArtistNames.push(attraction?.name)
          }
        }
      }
    }).then(() => {
      res.send(musicArtistNames)
    })
})

app.listen(port,async function () {
  // await handleSpotifyToken()
  console.log(`Server listening on port ${port}`);
});




