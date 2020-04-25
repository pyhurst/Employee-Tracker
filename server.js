const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',
    password: 'root',
    database: ''
});

connection.connect(function(err) {
    if (err) throw err;
});