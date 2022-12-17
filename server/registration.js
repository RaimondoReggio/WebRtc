const express = require('express');
const http = require('http');
const port = 4000;
const { MongoClient } = require('mongodb');

const app = express();

async function main() {

    const uri = "mongodb+srv://taltk-to-learn:mifidosolodisiri22.@cluster0.fmsue0z.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await listeDB(client);
    } catch (e) {
        console.log(e);
    } finally {
        await client.close()
    }

}

main().catch(console.error);

async function listeDB(client) {
    const databaseList = await client.db().admin().listDatabases();

    console.log("Databases:");
    
    databaseList.databases.forEach(db => console.log(` - ${db.name}`));
}

