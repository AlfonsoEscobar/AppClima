const fs = require('fs');
require('dotenv').config();
const axios = require('axios');

class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        //TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');

        });
    }

    get paramsMapBox(){
        return{
            'access_token': process.env.MAPBOX_TOKEN,
            'limit': 5,
            'language': 'es'
        }
    }

    async ciudad(lugar=''){

        //peticion http
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();
            
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        
        } catch (error) {
        
            return [];
        
        }
    }

    async climaLugar(lat, lon){
        //peticion http
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'lat': lat, 
                    'lon': lon,
                    'appid': process.env.WEATHER_TOKEN,
                    'units': 'metric',
                    'lang': 'es'
                }
            });

            const resp = await instance.get();
            
            return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp
            };
        
        } catch (error) {
        
            return [];
        
        }
    }

    agregarHistorial(lugar = ''){

        if( this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB();
    }

    guardarDB() {
        
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify(payload));

    }

    leerDB(){
        
        if(!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;

    }

}



module.exports = Busquedas;