var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
require('dotenv').config();

var sequelize = new Sequelize(process.env.POSTGRESQL_URI, {
    logging: false
})
var db = {};


sequelize.authenticate()
    .then(() => {
        console.log("Connected to PostgreSQL server")

        fs
            .readdirSync(__dirname)
            .filter(file => {
                return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
            })
            .forEach(file => {
                let model = sequelize.import(path.join(__dirname, file));
                db[model.name] = model;
            });

        Promise.all(Object.keys(db).map(modelName => {
            if (db[modelName].init) {
                return db[modelName].init(sequelize);
            }
        }))
            .then(() => {
                Object.keys(db).forEach(modelName => {
                    if (db[modelName].associate) {
                        db[modelName].associate(db);
                    }
                });
            })
            .then(() => {
                Promise.all(Object.keys(db).map(modelName => {
                    if (db[modelName].init) {
                        return db[modelName].sync();
                    }
                }))
            })
    })
    .catch((e) => {
        console.log("Failed to connect to PostgreSQL server >> ", e)
    })



// Object.keys(db).forEach(modelName => {
//     if (db[modelName].init) {
//         db[modelName].init(sequelize);
//         db[modelName].sync();
//     }
// });



// Object.keys(db).forEach(modelName => {
//     db[modelName].sync();
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;