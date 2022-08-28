const { leerInput, inquirerMenu, pausa, listadoCiudades } = require('./helpers/inquirer.js');
const Busquedas = require('./models/busquedas.js');

const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;
    do {
        
        opt = await inquirerMenu();

        switch( opt ){
            case 1:
                const termino = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad(termino);
                const id = await listadoCiudades(lugares);
                if(id === '0') continue;
                const lugarSel = lugares.find( l => l.id === id);
                busquedas.agregarHistorial(lugarSel.nombre);
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

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