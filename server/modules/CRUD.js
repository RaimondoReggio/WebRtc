const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://talktolearn:mifidosolodisiri22@cluster0.u0wafu3.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

client.connect();

const database = client.db("talk-to-learn");

// Modulo che definisce le interazioni base con MongoDB
// questo verrà importato tramite require() quindi il modulo
// verrà caricato una sola volta, usando sempre la stessa connessione con MongoDB

const findOneDocument = async (coll, query, options) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.findOne(query, options);

        return result;
    } catch(e) {
        console.error(e);
    }

}

const findDocuments = async (coll, query, options) => {

    try {
        const collection = database.collection(coll);
        const result = collection.find(query, options);
        
        const result_array = await result.toArray();

        return result_array;
    } catch(e) {
        console.error(e);
    }

}

const insertOneDocument = async (coll, document) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.insertOne(document);

        return result;
    } catch(e) {
        console.error(e);
    }

}

const insertDocuments = async (coll, document, ordered = false) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.insertMany(document, ordered);

        return result;
    } catch(e) {
        console.error(e);
    }

}

const updateOneDocument = async (coll, filter, updates, options) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.updateOne(filter, updates, options);

        return result;
    } catch(e) {
        console.error(e);
    }

}

const updateDocuments = async (coll, filter, updates, options) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.updateMany(filter,updates, options);

        return result;
    } catch(e) {
        console.error(e);
    }
}

const replaceDocument = async (coll, query, newDocument) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.replaceOne(query, newDocument);

        return result;
    } catch(e) {
        console.error(e);
    }

}

const deleteOneDocument = async (coll, query) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.deleteOne(query);

        return result
    } catch(e) {
        console.error(e);
    }

}

const deleteDocuments = async (coll, query) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.deleteMany(query);

        return result
    } catch(e) {
        console.error(e);
    }
}

const countDocuments = async (coll, query) => {

    try {
        const collection = database.collection(coll);
        const result = await collection.countDocuments(query);

        return result
    } catch(e) {
        console.error(e);
    }
}

module.exports = {
    findOneDocument,
    findDocuments,
    insertOneDocument,
    insertDocuments,
    updateOneDocument,
    updateDocuments,
    replaceDocument,
    deleteOneDocument,
    deleteDocuments,
    countDocuments,
}