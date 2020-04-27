const mysql = require('mysql');
const inquirer = require('inquirer');

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
                    addEmployee();
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
    let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary ';
    query += "FROM employee INNER JOIN role ON (employee.role_id = role.id) ";
    query += "INNER JOIN department ON (role.department_id = department.id)";

    connection.query(query, function(err, data){
        if (err) throw err;
        for (let i = 0; i < data.length; i++) {
            console.log([
                `ID: ${data[i].id}
                First Name: ${data[i].first_name}
                Last Name: ${data[i].last_name}
                Role: ${data[i].title}
                Department: ${data[i].name}
                Salary: ${data[i].salary}
                `
            ])
            // console.table([{ ID: `${data[i].id}`, First_Name: `${data[i].first_name}`}], ['ID', 'First_Name']);
        }
        runTracker();
    });
}

function addEmployee() {
    connection.query('SELECT id,title FROM role', function(err, data){
        if (err) throw err;
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
                type: 'rawlist',
                message: 'What is the employee\'s role?',
                name: 'role',
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < data.length; i++) {
                      choiceArray.push(data[i].title);
                    }
                    return choiceArray;
                }
            },
            // {
            //     type: 'input',
            //     message: 'Who is the employee\'s manager?',
            //     name: 'manager'
            // }
        ]).then(function(answer) {
            let chosenItem;
            for (let i = 0; i < data.length; i++) {
                if(data[i].title === answer.role) {
                    chosenItem = data[i].id;
                }
            }
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: chosenItem,
                    // manager_id: answer.manager
                },
                function(err){
                    if (err) throw err;
                    console.log('Employee successfully added!');
                    runTracker();
                });
        })
    });
}