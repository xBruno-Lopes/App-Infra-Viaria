import * as fs from 'fs';
import path from "path";
import { parse } from 'csv-parse/sync';
import { FormData } from 'formdata-node';
import fetch, { blobFrom } from 'node-fetch';

const __dirname = path.resolve()
const dbPath = path.join(__dirname, 'data.csv')

async function populate() {
    const fileContent = fs.readFileSync(dbPath);
    const records = parse(fileContent, {columns: true});
    for (let record of records) {
        if(record.cod_endereco != "DESCONHECIDA"){
            const classe = Object.keys(JSON.parse(record.classe)).toString()
            const endereco = record.cod_endereco
            const latitude = record.lat_geodesica
            const longitude = record.long_geodesica
            const dataDeColeta = record.data
            const quantidade = Object.values(JSON.parse(record.classe)).reduce((a, b) => a + b, 0)

            const coverPath = path.join(__dirname, `./${record.imagem}`)

            const json = JSON.stringify({
                classe,
                endereco,
                latitude,
                longitude,
                dataDeColeta,
                quantidade
            })
            
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
}

await populate()
