const mysql = require('mysql');
const inquire = require("inquirer");
const chalk = require('chalk');
const tables = require('console.table');

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'KeatonDev42420',
    database: 'employeeManager',
};

const conn = mysql.createConnection(config);


const viewAllEmployees = () => {
    conn.query(`SELECT * FROM employees`, (err, table) => {
        if (err) throw err;
        console.table(table);
    })
};

module.exports = {
    viewAllEmployees: viewAllEmployees
}