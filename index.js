require('dotenv').config()

const { leerInput, inquirerMenu,pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {
    const busquedas = new Busquedas();
    let opt = 0;

    do{
        opt = await inquirerMenu();
        switch(opt){
            case 1:
                //Mostrar mensaje para que la persona escriba
                const termino = await leerInput('Ciudad: ');
                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                //Seleccionar lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);
                //GUARAR EN DB
                busquedas.agregarHistorial(lugarSel.nombre);

                //Clima
                // const clima = await busquedas.climaLugar()
                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);
                
                //Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre.green);
                console.log('Lat: ',lugarSel.lat);
                console.log('Lng: ',lugarSel.lng);
                console.log('Temperatura: ',clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ',clima.max);
                console.log('Como esta el clima: ',clima.desc.green);//Desc
            break;
            case 2:
                // Historial
                busquedas.historialCapitalizado.forEach((lugar, i) =>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
            break;
            case 0:
                //Salir
                console.log('Salir');
            break;
            
        }
        await pausa();
    }while(opt !== 0);

}

main();

