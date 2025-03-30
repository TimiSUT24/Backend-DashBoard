const express = require('express'); 
const cors = require('cors');
require('dotenv').config();  


const app = express();
const port = 3020;
app.use(cors())

app.get('/api/photos', async (req, res) => {
    try {
        if (!process.env.MY_API_KEY) {
            return res.status(500).json({ error: "API key is missing in the backend" });
        }
        const randomPic = Math.floor(Math.random() * 100) + 1;
        const pictureUrl = `https://api.pexels.com/v1/curated?per_page=${randomPic}&page=${randomPic}`;
        
        const response = await fetch(pictureUrl, {
            headers: {
                'Authorization': process.env.MY_API_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const pictureData = await response.json();
        res.json(pictureData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const fetchWeatherData = async (endpoint, params = '') => {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/${endpoint}.json?key=${apiKey}${params}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching data from API: ${error.message}`);
    }
}

app.get('/api/weather/current', async (req, res) => {
        const {lat,lon} = req.query
    try {
        const weatherData = await fetchWeatherData('current', `&q=${lat},${lon}&lang=sv`);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/weather/forecast', async (req, res) => {
    const {lat,lon} = req.query
try {
    const forecastData = await fetchWeatherData('forecast', `&q=${lat},${lon}&days=3&aqi=no&alerts=no&lang=sv`);
    res.json(forecastData);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

app.get('/api/weather/sports', async (req, res) => {
    
try {
    const sportsData = await fetchWeatherData('sports', `&q=England`);
    res.json(sportsData);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});


app.get("/", (req,res) => {
    res.send("backend working")
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});