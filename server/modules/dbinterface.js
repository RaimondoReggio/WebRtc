const { query } = require('express');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://user:user@cluster0.fmsue0z.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

client.connect();

const {findOneDocument, findDocuments, insertOneDocument, insertDocuments, updateOneDocument, updateDocuments, replaceDocument, deleteOneDocument, deleteDocuments, countDocuments} = require('./CRUD');


const checkIfUserExist = async (user_id) => {
    const coll = "users";

    const query = {
        user_id: user_id,
    };

    try {
        const result = await findOneDocument(coll, query);

        if(result) {
            return true;
        } else {
            return false;
        }
        
    } catch(e) {
        console.error(e);
    }
}

const createUser = async (user_id, username, native_l, new_l) => {
    const coll = "users";

    const document = {
        user_id: user_id,
        username: username,
        native_language: native_l,
        new_language: new_l,
    }

    try {
        const result = insertOneDocument(coll, document);

        if(result) {
            return true;
        } else {
            return false;
        }

    } catch(e) {
        console.error(e);
    }
}

module.exports = {
    checkIfUserExist,
    createUser,
}