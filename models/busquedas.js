const fs = require('fs');
require('dotenv').config();
const axios = require('axios');

class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    // El constructor lo que hace es rellenar el array del historial con lo que haya en el archivo database.json
    constructor(){
        //TODO: leer DB si existe
        this.leerDB();
    }

    // Obtenemos todo lo que hay en el array de historial y lo devolvemos capitalizando la primera letra que haya despues de cada espacio
    get historialCapitalizado(){
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');

        });
    }

    // Son lo parametros que necesita Axios para realizar la llamada 
    get paramsMapBox(){
        return{
            'access_token': process.env.MAPBOX_TOKEN,
            'limit': 5,
            'language': 'es'
        }
    }

    // Esto devuelve un array de objetos con los lugares que se reciben en la llamada a la API de MAPBOX
    // en ese array de objetos nos quedamos con las propiedades que queremos como por ejemplo:
    // El id, el nombre del lugar, la latitud y la longitud que usaremos en las llamadas de despues. 
    async ciudad(lugar=''){

        
        try {
            // Se crea una instancia con axios pasandole el objeto con todos los parametros necesarios.
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
                params: this.paramsMapBox
            });

            // Se realiza la peticion http que devuelve todos los datos.
            const resp = await instance.get();
            
            // Filtramos los datos de la response y nos quedamos con los que queremos usar
            // y devolvemos un array con esos objetos.
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

    // Este metodo se le pasa la latitud y la longitud y hace la llamada a la API de OpenWeatherMap para obtener
    // el clima en la ciudad que hayamos selecionado
    async climaLugar(lat, lon){
        
        try {

            // Creamos una instancia de axios pasandole el objeto que deseamos con los parametros que necesita para la llamada
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

            // Realizamos la peticion http y obtenemos un objeto con la respuesta de la API
            const resp = await instance.get();
            
            // Devolvemos un objeto con los datos de la respuesta que queremos mostrar en la pantalla
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

    // Con este metodo agregamos al array del historial solo en el caso de que no exista ya en el array
    // y lo guardamos todo en minusculas, y solo sera el array de 6 ciudades
    agregarHistorial(lugar = ''){

        if( this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB();
    }

    // Con este metodo guardamos el array con los objetos en el archivo de database.json
    guardarDB() {
        
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify(payload));

    }

    // Con este metodo leemos el archivo siempre desde el constructor de esta clase para inicializar la variable de array
    // historial para despues poder trabajar con el.
    leerDB(){
        
        if(!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;

    }

}



module.exports = Busquedas;