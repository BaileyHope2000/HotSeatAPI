const mysql = require('mysql2');
const fs = require('fs');

var connection = mysql.createConnection({
    host: "azne-p-cag-prod-mysqlserver-01.mysql.database.azure.com",
    user: "CAGAzureAdmin",
    password: "[15534Gwhz.hh34[",
    database: "hotdeskdb",
    port: 3306,
    ssl: {
        ca: fs.readFileSync('./DigiCertGlobalRootCA.crt.pem') // replace with the path to your CA certificate
    }
})

connection.connect((error) => {
    if (error) {
        console.error(error);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = connection;
