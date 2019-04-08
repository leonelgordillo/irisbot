'use strict';

const config = require('../config');
const express = require('express');
const service = express();
const request = require('superagent');

// Key: AIzaSyCbFrHuSj-q7WT9oqGC2y921v7lhfEtJqA
// https://maps.googleapis.com/maps/api/geocode/json?address=viennna&key=AIzaSyCbFrHuSj-q7WT9oqGC2y921v7lhfEtJqA
// https://maps.googleapis.com/maps/api/timezone/json?location=38.908133,-77.047119&timestamp=1458000000&key=YOUR_API_KEY


service.get('/service/:location', (req, res, next) =>{

    request.get('http://api.openweathermap.org/data/2.5/weather?q=' + 
    req.params.location + `&appid=${config.openWeatherApiKey}&units=imperial`, 
    (err, response) => {

        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }

        res.json({result: `${response.body.weather[0].description} at ${response.body.main.temp} degrees fahrenheit`});

    });
})

module.exports = service;