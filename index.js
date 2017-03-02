require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var oxford = require('project-oxford')
let fetch = require('node-fetch')

const {COG_KEY, GROUPID, SEAT} = process.env

// var fetch = require('node-fetch')
var client = new oxford.Client(COG_KEY, 'https://westus.api.cognitive.microsoft.com')

var app = express()
let people = {}

let assignedSeatName

fetch('https://cabinescape.azurewebsites.net/api/State?code=OeccpDX69UKbQWMz95emnELnwP7/y3c9/zdwQIB6RB1DodxTKPzJmg==')
  .then(res => res.json())
  .then(data => {
    let assignedPlayer = data.players.filter((player) => {
      return player.seat === SEAT
    })[0]
    assignedSeatName = assignedPlayer.name.toLowerCase()
    console.log(`name of the person who is supposed to sit in ${SEAT}: ${assignedSeatName}`)
  })

client.face.person.list(GROUPID).then((response) => {
  response.forEach((person) => {
    people[person.personId] = person.name
  })
  console.log(people)
})

function parseDataURL (body) {
  var match = /data:([^;]+);base64,(.*)/.exec(body)
  if (!match) {
    return null
  }

  return {
    contentType: match[1],
    data: new Buffer(match[2], 'base64')
  }
}

app.use(bodyParser.json({limit: '10mb'}))

app.use('/', express.static('public'))

app.post('/submit', (req, res) => {
  const {data} = req.body

  var upload = parseDataURL(data)

  console.log(upload.data.byteLength)
  client.face.detect({
    data: upload.data,
    analyzesAge: true,
    analyzesGender: true,
    returnFaceId: true,
    returnFaceLandmarks: true
  }).then((response) => {
    console.log(response)
  }).catch((err) => {
    console.log(err)
  })
})

app.post('/train', (req, res) => {
  const {data, personId} = req.body
  const upload = parseDataURL(data)
  const imageData = upload.data
  console.log('got faceId', personId)
  client.face.person.addFace(GROUPID, personId, {
    data: imageData
  }).then((response) => {
    console.log(response)
    res.json(response)
  })
})

app.post('/identify', (req, res) => {
  const {data} = req.body
  const upload = parseDataURL(data)
  const imageData = upload.data
  client.face.detect({
    data: imageData,
    analyzesAge: false,
    analyzesGender: false,
    returnFaceId: true,
    returnFaceLandmarks: false
  }).then((response) => {
    return response.map(face => face.faceId)
  }).then((faceIds) => {
    console.log('faceId', faceIds, GROUPID)
    client.face.identify(faceIds, GROUPID, 1)
      .then(response => {
        const names = response.map((data) => {
          const personId = data.candidates[0].personId
          return people[personId]
        })
        const detectedName = names[0].toLowerCase()
        if (detectedName === assignedSeatName) {
          res.json(detectedName + ' is in the right seat')
        } else {
          res.json(detectedName + ' is not in the right seat')
        }
      }).catch(err => console.log(err))
  })
})

app.listen(3000, () => {
  console.log('Camera App is now listening on port 3000!')
})
