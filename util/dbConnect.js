const mongoose = require('mongoose');
const CONFIG = require('../config');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
const getConnection = function () {
    if (!global.cachedConnectionPromise) {
        try {
            let connectionPromise = mongoose.connect(CONFIG[process.env.DEPLOYMENT_STAGE].DB_CONNECTION_URL, {
                useMongoClient: true
            });
            global.cachedConnectionPromise = connectionPromise; //GLOBAL
            connectionPromise.then(() => {
                if (mongoose.connection) {
                    mongoose.connection.on('error', function (err) {
                        console.error('Mongoose default connection error: ', err);
                    });

                    mongoose.connection.on('disconnected', function () {
                        console.log('DB Connection disconnected');
                        global.cachedConnectionPromise = null;
                    });

                    process.on('SIGINT', function () {
                        console.log('Closing the connection before process exit');
                        mongoose.connection.close(function () {
                            process.exit(0);
                        });
                    });
                }
                console.log('Connection successful');
            }).catch((err) => {
                console.error("Error in connectionPromise  " + err);
                global.cachedConnectionPromise = undefined;
                getConnection();
            });
        } catch (error) {
            console.error(error);
            return;
        }
    }
}

const getCollection = function (collectionName) {
    return new Promise((resolve, reject) => {
        mongoose.connection.db.collection(collectionName, function (err, collection) {
            resolve(collection)
        });
    })
        .catch(err => reject(err))
}
module.exports = {
    getCollection: getCollection,
    getConnection: getConnection
}
