import * as fs from 'fs';
import path from "path";
import { parse } from 'csv-parse/sync';
import { FormData } from 'formdata-node';
import fetch, { blobFrom } from 'node-fetch';

const __dirname = path.resolve()
const dbPath = path.join(__dirname, './images_info.csv')


function parseDMS(input) => {
    let parts = input.split(/[^\d\w]+/);
    let data = convertDMSToDD(parts[0], parts[1], parts[2], parts[3]);

    return data;
}
  
function convertDMSToDD(degrees, minutes, seconds, miSeconds) => {
    let dd =
    Number(degrees) +
    Number(minutes) / 60 +
    (Number(seconds) + Number(miSeconds) / 100) / 6000;

    return dd * -1;
}

function convertCodEndereco(cod) {
    let num = cod.substring(0, 3);
    let estado = cod.substring(4, 6);

    return estado + ' - ' + num;
  }
  
async function getCity(lat, long){
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=pt-br`,{
    	method: 'get'
    })
    
    const data = await response.json()
    return data.city + ", " + data.principalSubdivisionCode.split("-")[1]
}

/*
const classeDeDefeitos = [
    'no_defect',
    'pothole',
    'crack',
    'patche'
]
*/


async function populate() {
    const fileContent = fs.readFileSync(dbPath);
    const records = parse(fileContent, {columns: true});
    for (let record of records) {
        const classe = record.classe
        const codEndereco = convertCodEndereco(record.cod_endereco)
        const latitude = parseDMS(record.lat_geodesica)
        const longitude = parseDMS(record.long_geodesica)
        const dataColeta = record.data
        const cidade = await getCity(latitude, longitude)


        const coverPath = path.join(__dirname, `./${record.imagem}`)

        const json = JSON.stringify({
            endereco: codEndereco,
            latitude,
            longitude,
            cidade,
            classe,
            dataDeColeta:dataColeta
        })

        //console.log(json)
         const form = new FormData();

         form.append('data', json)
        
        const file = await blobFrom(coverPath, 'image/jpeg');
        form.append('files.imagem', file, path.basename(coverPath));

        
        const response = await fetch('http://127.0.0.1:1337/api/defeitos', {
            method: 'post',
            body: form
        });
        const data  =  await response.json()
        console.log(data)
        
    }
}

await populate()
