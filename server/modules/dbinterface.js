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

const createUser = async (user_id, first_name, last_name, username, native_l, new_l, gender, birth_date, birth_country, job, biography, avatar_image, email, goals, hobbies) => {
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
        email: email,
        goals: goals,
        hobbies: hobbies,
        points: 0,
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

const updateUserProfile = async (user_id, first_name, last_name, username, native_l, new_l, gender, birth_date, birth_country, job, biography, avatar_image, email, goals, hobbies) => {
    const coll = "users";

    const document = {
        $set: {
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
            email: email,
            goals: goals,
            hobbies: hobbies,
        },
    }

    const filter =  {
        user_id: user_id,
    };

    try {
        const result = updateOneDocument(coll, filter, document);

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


    try {

        const query_ = {
            user_id:  user_id,
        }
        const options = {
            projection: { user_id: 1, contacts: 1 }
        }

        //Forse inserire email
        const result_ = await findOneDocument(coll, query_, options);
        console.log(result_);
        if(result_.contacts){

            const contact_id = result_.contacts;
            
            console.log("contatti:" + contact_id);
            const users = [];
            const query = {
                user_id: { $in: contact_id } ,
            }
            
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
        }else{
            return false;
        }
        
    } catch(e) {
        console.error(e);
    }

}

const addContact = async (user_id, contact_id) => {

    const coll = "users";
    
    const filter = {
        user_id: user_id,
    };

    const updates = { 
        $addToSet: {
        "contacts":contact_id} 
    };

    try {
        const result = await updateOneDocument (coll, filter, updates);

        if(result) {
            return result;
        } else {
            return false;
        }
        
    } catch(e) {
        console.error(e);
    }
}

const getPossibleUsers = async (user_id) => {
    user_info = await getUserData(user_id);


    const coll = "users";
    const users = [];
    const query = {
        $and: [
                {
                    native_l: user_info.new_l
                },
                {
                    new_l: user_info.native_l
                },
                {
                    user_id: {$ne : user_id}
                    //non devo ritrovare me stesso
                }
            ]
    }

    try {
        //Forse inseire email
        const result = await findDocuments(coll, query);

        if(result) {
            result.forEach(item => {
                const struct = {
                    username: item.username,
                    avatar_image: item.avatar_image,
                    id: item.user_id,
                    new_l: item.new_l,
                    native_l: item.native_l,
                    biography: item.biography,
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
    getPossibleUsers,
    addContact,
    updateUserProfile,
}