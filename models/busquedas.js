const fs = require('fs');
const axios = require('axios');


class Busquedas{



    dbPath='./db/database.json';
    historial =[''];
    constructor(){
        this.leerBD();
    }

    get historialCapitalizado(){
        return this.historial.map(l =>{
            return l.charAt(0).toUpperCase() + l.substring(1)
        });
    }

    get paramsMapBox(){
        return { 
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
            'language': 'es'}
    }
    get paramsWheatherMap(){
        return { 
            'appid': process.env.OPENWETHER_KEY,
            'units': 'metric',
            'lang': 'es'}
    }

    async ciudad(lugar = ''){
        //peticion HTTP 
        // console.log('ciudad',lugar);
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                    id: lugar.id,
                    nombre: lugar.place_name,
                    lng: lugar.center[0],
                    lat: lugar.center[1]
            }));
        

          //Retornar lugares que coinciden con parametro
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon){
        try {
            //intancia de axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWheatherMap, lat, lon}
            });
            const resp = await instance.get();
            const{main,weather } = resp.data;
            //Resp extraer informacion en la data resp.data
            return{
                desc:weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '')
    {

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar en DB
        this.guardarDB();
    }

    guardarDB(){
        const payload={
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    leerBD(){
        if(!fs.existsSync(this.dbPath))return;
        const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
        // const info... readFileSync...path{ endoding : 'utf-8'}
        // const data = JSON.asdasdasd(info);

        // this.historial= ...historial
    }
    
}

module.exports = Busquedas;