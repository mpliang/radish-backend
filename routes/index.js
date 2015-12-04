var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

var locations = [];
router.post('/location', function (req, res, next) {
  var location = req.body;
  location['time'] = Date.now();
  locations.push(location);
  if (locations.length > 1) {
    var loc1 = locations[locations.length - 2];
    var loc2 = locations[locations.length - 1];
    var coord1 = loc1.coordinates;
    var coord2 = loc2.coordinates;
    var time1 = loc1.time;
    var time2 = loc2.time;
    var time = (time2 - time1) / 1000 / 60 / 60;
    var speed = haversineDistance(coord1, coord2) / time;
    var direction = vehicleBearing(coord1, coord2);
    res.status(200).send({
      speed: Math.round(speed*100)/100,
      direction: direction
    });
  } else {
    res.status(200).send(locations);
  }

})

//need functions to calculate speed and direction

function haversineDistance(coords1, coords2) {
  var isMiles = true;

  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lat1 = parseFloat(coords1.split(', ')[0]);
  var lon1 = parseFloat(coords1.split(', ')[1]);

  var lat2 = parseFloat(coords2.split(', ')[0]);
  var lon2 = parseFloat(coords2.split(', ')[1]);

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if (isMiles) d /= 1.60934;

  return d;
}

function vehicleBearing(endPoint, startPoint) {

  var lat1 = parseFloat(endPoint.split(', ')[0]);
  var lon1 = parseFloat(endPoint.split(', ')[1]);

  var lat2 = parseFloat(startPoint.split(', ')[0]);
  var lon2 = parseFloat(startPoint.split(', ')[1]);

  var radians = getAtan2((lon1 - lon2), (lat1 - lat2));

  function getAtan2(y, x) {
    return Math.atan2(y, x);
  };

  var compassReading = radians * (180 / Math.PI);

  var coordNames = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
  var coordIndex = Math.round(compassReading / 45);
  if (coordIndex < 0) {
    coordIndex = coordIndex + 8
  };

  return coordNames[coordIndex]; // returns the coordinate value
}

module.exports = router;
