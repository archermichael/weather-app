import express from 'express'
import * as path from 'path'
import { fileURLToPath } from 'url'
import hbs from 'hbs'
import geocode from './utils/geocode.js'
import forecast from './utils/forecast.js'

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsDirectoryPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsDirectoryPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Michael Archer'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        photo: '/img/robot.png',
        name: 'Michael Archer'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'This is a helpful message',
        name: 'Michael Archer'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            res.send({ error })
        } else {
            forecast(latitude, longitude, (error, data) => {
                if (error) {
                    res.send({ error })
                } else {
                    res.send({ 
                        forecast: data,
                        location,
                        address: req.query.address
                    })
                }
            }) 
        }
    })
})


// Wildcard help 404 page
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        error: 'Help article not found',
        name: 'Michael Archer'
    })
})

// 404 page using wildcard
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Page not found',
        name: 'Michael Archer'
    })
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})