const { leerInput, inquirerMenu, pausa, listadoCiudades } = require('./helpers/inquirer.js');
const Busquedas = require('./models/busquedas.js');

const main = async() => {
    
    // Se crea una instancia de la clase Busquedas para utilizar sus metodos.
    const busquedas = new Busquedas();
    let opt;
    do {
        
        // esto escribira en la consola las opciones y se podran elegir con el cursos
        // esto devuelve un numero dependiendo de la opcion que hayamos elegido
        opt = await inquirerMenu();

        // hacemos lo que se necesite para la opcion que se haya elegido
        switch( opt ){
            case 1:
                // El usuario introduce la ciudad que quiere buscar y la guarda en la variable
                const termino = await leerInput('Ciudad: ');

                // Buscamos las ciudades dependiendo del termino de busqueda que le hayamos pasado
                // y devolvemos un array con el listado de ciudades
                const lugares = await busquedas.ciudad(termino);

                // a listadoCiudades se le pasa un array de ciudades y podemos elegir la que queramos con las 
                // flechas y nos devuelve el id de la ciudad
                const id = await listadoCiudades(lugares);

                // Si el id es igual a cero no hacemos nada y seguimos a la siguiente iteracion del bucle do while
                if(id === '0') continue;

                // Buscamos el id de la ciudad que nos han devuelto en el array de lugares para saber que ciudad hemos
                // selecionado y quedarnos solo con esa
                const lugarSel = lugares.find( l => l.id === id);
                
                // ya que tenemos la ciudad la agregamos al historial
                busquedas.agregarHistorial(lugarSel.nombre);

                // Como ya tenemos las coordenadas ahora hacemos otra llamada para obtener el clima de esa ciudad
                // usando las cooredenas y nos devuelve un objeto con los datos que queremos usar
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // Mostramos por pantalla los datos que queremos mostrar del lugar selecionado y del clima obtenido
                console.clear();
                console.log('Informacion de la ciudad'.green);
                console.log('Ciudad: ',lugarSel.nombre);
                console.log('Lat: ',lugarSel.lat);
                console.log('Lng: ',lugarSel.lng);
                console.log('Temperatura: ',clima.temp);
                console.log('Minima: ',clima.min);
                console.log('Maxima: ',clima.max);
                console.log('Tiempo: ',clima.desc);
            break;
            case 2:

                // Si elegimos la opcion 2 en la primera opcion obtenemos el historial y esto lo que hace es recoger de la 
                // clase Busquedas el array de historial, que a su vez lo esta recibiendo del archivo .json
                busquedas.historialCapitalizado.forEach((lugar, i)=>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
            break;
        }

        if( opt !== 0 ) await pausa();

    } while (opt !== 0);

}


main();