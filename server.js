const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',
    password: 'root',
    database: 'employeeTracker_DB'
});

connection.connect(function (err) {
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
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "Remove Role",
                "Update Role",
                "View All Departments",
                "Total Utilized Budget by Department",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.start) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Employees by Department":
                    viewByDepartment();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    deleteEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Remove Role":
                    deleteRole();
                    break;
                case "Update Role":
                    updateRole();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "Total Utilized Budget by Department":
                    viewBudget();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewEmployees() {
    let query = 'SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name, roles.salary ';
    query += "FROM employee INNER JOIN roles ON (employee.role_id = roles.id) ";
    query += "INNER JOIN department ON (roles.department_id = department.id)";

    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        runTracker();
    });
}

function addEmployee() {
    connection.query('SELECT id,title FROM roles', function (err, res) {
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
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].title);
                        }
                        return choiceArray;
                    }
                }
            ]).then(function (answer) {
                let chosenItem;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].title === answer.role) {
                        chosenItem = res[i].id;
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
                    function (err) {
                        if (err) throw err;
                        console.log('Employee successfully added!');
                        runTracker();
                    });
            })
    });
}

function viewByDepartment() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    type: 'rawlist',
                    message: 'What department would you like to view?',
                    name: 'department',
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].name);
                        }
                        return choiceArray;
                    }
                }

            ).then(function (answer) {
                let chosenItem;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name === answer.department) {
                        chosenItem = res[i].id;
                    }
                }

                let query = 'SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name, roles.salary ';
                query += "FROM employee INNER JOIN roles ON (employee.role_id = roles.id) ";
                query += "INNER JOIN department ON (roles.department_id = department.id)";
                query += `WHERE (roles.department_id = ${chosenItem})`;

                connection.query(query, function (err, data) {
                    if (err) throw err;
                    console.table(data)
                    runTracker();
                });
            })
    })
}

function deleteEmployee() {
    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    type: 'rawlist',
                    message: 'Which employee would you like to remove?',
                    name: 'remove',
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].first_name + " " + res[i].last_name);
                        }
                        return choiceArray;
                    }
                }

            ).then(function (answer) {
                let result = answer.remove.split(' ');
                let chosenItem;

                for (let i = 0; i < res.length; i++) {
                    if (res[i].first_name === result[0] && res[i].last_name === result[1]) {
                        chosenItem = res[i].id;
                    }
                }

                let query = 'DELETE FROM employee WHERE id = ?';

                connection.query(query, chosenItem, function (err, data) {
                    if (err) throw err;
                    console.log(`${answer.remove} has been deleted.`);
                    runTracker();
                });
            })
    })
}

function updateEmployeeRole() {
    let chosenEmployeeName;
    let chosenEmployeeId;
    let chosenRoleId;

    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        inquirer.prompt(
            {
                type: 'rawlist',
                message: 'Which employee\'s role would you like to update?',
                name: 'name',
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].first_name + " " + res[i].last_name);
                    }
                    return choiceArray;
                }
            }
        ).then(function (answer) {
            let result = answer.name.split(' ');
            chosenEmployeeName = answer.name;

            for (let i = 0; i < res.length; i++) {
                if (res[i].first_name === result[0] && res[i].last_name === result[1]) {
                    chosenEmployeeId = res[i].id;
                }
            }


            connection.query('SELECT * FROM roles', function (err, response) {
                if (err) throw err;

                inquirer.prompt(
                    {
                        type: 'rawlist',
                        message: 'What is this employee\'s new role?',
                        name: 'role',
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < response.length; i++) {
                                choiceArray.push(response[i].title);
                            }
                            return choiceArray;
                        }
                    }

                ).then(function (answer) {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].title === answer.role) {
                            chosenRoleId = response[i].id;
                        }
                    }

                    let query = 'UPDATE employee SET role_id = ? WHERE id = ?';

                    connection.query(query, [chosenRoleId, chosenEmployeeId], function (err, data) {
                        if (err) throw err;
                        console.log(`${chosenEmployeeName}'s role is change to ${answer.role}`);
                        runTracker();
                    });
                });
            });
        });
    });
}

function viewRoles() {
    let query = 'SELECT roles.title, roles.salary, department.name ';
    query += "FROM roles INNER JOIN department ON (roles.department_id = department.id)";

    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        runTracker();
    });
}

function addRole() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is the title of the new role?',
                    name: 'title'
                },
                {
                    type: 'input',
                    message: 'What is the salary of this role?',
                    name: 'salary'
                },
                {
                    type: 'rawlist',
                    message: 'What department is this role in?',
                    name: 'department',
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            if (choiceArray.includes(res[i].name) === false) {
                                choiceArray.push(res[i].name);
                            }
                        }
                        return choiceArray;
                    }
                }
            ]).then(function (answer) {
                let chosenItem;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name === answer.department) {
                        chosenItem = res[i].id;
                    }
                }

                connection.query(
                    'INSERT INTO roles SET ?',
                    {
                        title: answer.title.trim(),
                        salary: answer.salary.trim(),
                        department_id: chosenItem
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Role successfully added!');
                        runTracker();
                    });
            })
    });
}

function deleteRole() {
    connection.query('SELECT * FROM roles', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    type: 'rawlist',
                    message: 'Which role would you like to delete?',
                    name: 'remove',
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].title);
                        }
                        return choiceArray;
                    }
                }

            ).then(function (answer) {
                let chosenItem;

                for (let i = 0; i < res.length; i++) {
                    if (res[i].title === answer.remove) {
                        chosenItem = res[i].id;
                    }
                }

                let query = 'DELETE FROM roles WHERE id = ?';

                connection.query(query, chosenItem, function (err, data) {
                    if (err) throw err;
                    console.log(`${answer.remove} has been deleted.`);
                    runTracker();
                });
            })
    })
}

function updateRole() {
    let oldRoleName;
    let chosenRoleId;
    let chosenDepartmentId;
    let chosenTitle;
    let chosenSalary;

    connection.query('SELECT * FROM roles', function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'rawlist',
                message: 'Which role would you like to update?',
                name: 'name',
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].title);
                    }
                    return choiceArray;
                }
            },
            {
                type: 'input',
                message: 'What is the role\'s new title?',
                name: 'title',
            },
            {
                type: 'input',
                message: 'What is the role\'s new salary?',
                name: 'salary',
            }
        ]).then(function (answer) {
            for (let i = 0; i < res.length; i++) {
                if (res[i].title === answer.name) {
                    chosenRoleId = res[i].id;
                }
            }
            oldRoleName = answer.name;
            chosenTitle = answer.title;
            chosenSalary = answer.salary;

            connection.query('SELECT * FROM department', function (err, response) {
                if (err) throw err;

                inquirer.prompt(
                    {
                        type: 'rawlist',
                        message: 'In what department is the new role?',
                        name: 'department',
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < response.length; i++) {
                                choiceArray.push(response[i].name);
                            }
                            return choiceArray;
                        }
                    }

                ).then(function (answer) {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].name === answer.department) {
                            chosenDepartmentId = response[i].id;
                        }
                    }

                    let query = 'UPDATE roles SET ? WHERE id = (?)';

                    connection.query(query, [
                        {
                            title: chosenTitle,
                            salary: chosenSalary,
                            department_id: chosenDepartmentId
                        }
                    , [chosenRoleId]], function (err, data) {
                        if (err) throw err;
                        console.log(`${oldRoleName}'s title was change to ${chosenTitle} with a salary of $${chosenSalary} inside of the ${answer.department} department.`);
                        runTracker();
                    });
                });
            });
        });
    });
}

function viewDepartments() {
    connection.query('SELECT * FROM department', function (err, data) {
        if (err) throw err;
        console.table(data);
        runTracker();
    });
}

function viewBudget() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    type: 'rawlist',
                    message: 'What department would you like to view?',
                    name: 'department',
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].name);
                        }
                        return choiceArray;
                    }
                }

            ).then(function (answer) {
                let chosenItemId;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name === answer.department) {
                        chosenItemId = res[i].id;
                    }
                }

                let query = 'SELECT salary FROM roles WHERE department_id = ?';

                connection.query(query, chosenItemId, function (err, data) {
                    if (err) throw err;

                    let totalSum = 0;

                    for (let i = 0; i < data.length; i++) {
                        totalSum += data[i].salary;
                    }

                    console.log(`The total utilized budget for ${answer.department} is $${totalSum}.`);

                    runTracker();
                });
            })
    })
}