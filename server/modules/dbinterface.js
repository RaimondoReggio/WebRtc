const { MongoClient, Timestamp } = require('mongodb');

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

const createUser = async (user_id, first_name, last_name, username, native_l, new_l, gender, birth_date, birth_country, job, biography, avatar_image) => {
    const coll = "users";

    const document = {
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        username: username, 
        native_l: native_l, 
        new_l: new_l,
        gender: gender,
        birth_date: birth_date,
        birth_country: birth_country,
        job: job,
        biography: biography,
        avatar_image: avatar_image, 
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

const getUserData = async (user_id) => {
    const coll = "users";

    const query = {
        user_id: user_id,
    };

    try {
        const result = await findOneDocument(coll, query);

        if(result) {
            return result;
        } else {
            return false;
        }
        
    } catch(e) {
        console.error(e);
    }
}

const getContacts = async (user_id) => {
    const coll = "users";
    const users = [];
    const query = {
        user_id: {
            $ne: user_id,
        },
    }

    try {
        //Forse inserire email
        const result = await findDocuments(coll, query);

        if(result) {
            result.forEach(item => {
                const struct = {
                    username: item.username,
                    avatar_image: item.avatar_image,
                    id: item.user_id,
                }
                users.push(struct)
            });
            return users;
        } else {
            return false;
        }
        
    } catch(e) {
        console.error(e);
    }

}

const createMessage = async (message, from_id, to_id) => {
    const coll = "messages";

    const document = {
        message: message,
        users: [from_id, to_id],
        sender: from_id,
        createdAt: new Date(),
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

const getAllMessages = async (from_id, to_id) => {
    const coll = "messages";

    const query = {
        users: {
            $all: [from_id, to_id],
        }
    }

    const options = {
        sort: {
            createdAt: 1,
        }
    }

    try {
        const result = await findDocuments(coll, query, options);
        if(result) {
            const messages = result.map((msg) => {
                return {
                    fromSelf: msg.sender.toString() === from_id,
                    message: msg.message,
                }
            });
            return messages;
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
    getUserData,
    getAllMessages,
    getContacts,
    createMessage,
}