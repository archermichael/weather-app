import request from 'request'

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=0f479bef3c26118247237e60364fdadc&query=' + lat + "," + long + '&units=f'

    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to weather services')
        } else if (body.error) {
            callback('Unable to find location')
        } else {
            callback(undefined, body.current.weather_descriptions + ". It is currently " + body.current.temperature + " degrees out. There is a " + body.current.precip + "% chance of rain.")
        }
    })
}

export default forecast