const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',
    password: 'root',
    database: 'employeeTracker_DB'
});

connection.connect(function(err) {
    if (err) throw err;
    runTracker();
});

function runTracker() {
    inquirer
        .prompt({
            name: 'start',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View All Roles",
                "Add Role",
                "Remove Role",
                "Exit"
            ]
        }).then(function(answer) {
            switch (answer.start) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Employees by Department":
                    break;
                case "View All Employees by Manager":
                    break;
                case "Add Employee":
                    break;
                case "Remove Employee":
                    break;
                case "Update Employee Role":
                    break;
                case "Update Employee Manager":
                    break;
                case "View All Roles":
                    break;
                case "Add Role":
                    break;
                case "Remove Role":
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewEmployees() {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, ', function(err, data){
        if (err) throw err;
    });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the employee\'s first name?',
                name: 'first'
            },
            {
                type: 'input',
                message: 'What is the employee\'s last name?',
                name: 'last'
            },
            {
                type: 'input',
                message: 'What is the employee\'s role?',
                name: 'role'
            },
            {
                type: 'input',
                message: 'Who is the employee\'s manager?',
                name: 'manager'
            }
        ]).then(function(answer) {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.role,
                    manager_id: answer.manager
                },
                function(err){
                    if (err) throw err;
                    console.log('Employee successfully added!');
                    runTracker();
                });
        })
}