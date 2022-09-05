const inquirer = require('inquirer');
require('colors');

// Es un array con las opciones que tendremos al iniciar el programa.
const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.green } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.green } Historial`
            },
            {
                value: 0,
                name: `${ '0.'.green } Salir`
            }
            
        ]
    }
];

// con este metodo obtenemos las opciones del array de las preguntas usando un modulo descargado que se llama 
// Inquirer que hace toda la logica para poder seleccionarlo con las flechas
const inquirerMenu = async() => {

    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción'.white );
    console.log('==========================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}

// con este metodo nos quedamos a la espera de que el usuario pulse 'enter' para poder continuar
const pausa = async() => {
    
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'enter'.green } para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}

// Con este metodo devolvemos lo que escribe el usuario tambien usando el modulo Inquirer
const leerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

// Este metodo se le pasa como parametro un array de las ciudades que recogio la llamada anterior con el termino de busqueda
// igual usa el modulo Inquirer para que se puedan elegir las ciudades con las flechas y devuelva el id de la ciudad elegida.
const listadoCiudades = async( lugares = [] ) => {

    const choices = lugares.map( (lugar, i) => {

        const idx = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name:  `${ idx } ${ lugar.nombre }`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Ciudades:',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;
}  

// Exportamos todas las funciones para que se puedan llamar en cualquier parte de la app
module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoCiudades
}
