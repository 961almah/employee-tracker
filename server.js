const mysql = require("mysql")
const inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "96111961",
    database: "employees_DB"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err);
        return;
    }
});

const runApp = () => {
    startingPrompt();
};

function startingPrompt() {
    inquirer
        .prompt([
            {
                name: 'choice',
                message: 'What would you like to do?',
                type: 'list',
                choices: [
                    "Add a new employee, department or role",
                    "View existing",
                    "Update existing",
                    "Exit"
                ]
            }
        ])
        .then(function (response) {
            switch (response.action) {
                case "Add new":
                    add();
                    break;

                case "View existing":
                    view();
                    break;

                case "Update existing":
                    update();
                    break;

                case "Exit":
                    endApp();
                    break;
            };
        });
};

function endApp() {
    process.on('SIGTERM', () => {
        server.close(() => {
            console.log('Process terminated')
        });
    });
};

// for add new
function add() {
    inquirer
        .prompt({
            name: "SelectedNew",
            message: "Would you like to add a new employee, department or role?",
            type: "list",
            choices: [
                "Add new employee",
                "Add new department",
                "Add new role",
                "Return to main menu",
                "Exit"
            ]
        })
        .then(function (response) {
            switch (response.SelectedNew) {
                case "Add new employee":
                    addEmployee();
                    break;
                case "Add new department":
                    addDepartment();
                    break;
                case "Add new role":
                    addRole();
                    break;
                case "Return to main menu":
                    runApp();
                    break;
                case "Exit":
                    endApp();
                    break;
            };
        });
};

function addNew() {
    inquirer
        .prompt({
            // Gather answers
            name: "SelectAddNewOp",
            message: "Would you like to add a new department, role or employee?",
            type: "list",
            choices: [
                "Add new department",
                "Add new role",
                "Add new employee",
                "Return to main menu",
                "Exit"
            ]
        })
        // Route the user depending on answer
        .then(function (answer) {
            switch (answer.SelectAddNewOp) {
                case "Add new department":
                    addDepartment();
                    break;
                case "Add new role":
                    addRole();
                    break;
                case "Add new employee":
                    addEmployee();
                    break;
                case "Return to main menu":
                    runApp();
                    break;
                case "Exit":
                    endApp();
                    break;
            };
        });
};

// Add a new department ==========================================================
function addDepartment() {
    inquirer
        .prompt([
            // Gather answers
            {
                name: "newDepartment",
                message: "What is the name of the new department?",
                type: "input"
            },
            {
                name: "continue",
                message: "Is there anything else you would like to do?",
                type: "list",
                choices: ["Add another department", "Return to main menu", "Exit"]
            }
            // Ask the user if they would like to do more
        ]).then(function (response) {
            switch (response.continue) {
                case "Add another department":
                    addNewDepartment();
                    saveDepartment(response)
                    break;
                case "Return to main menu":
                    initialPrompt();
                    saveDepartment(response)
                    break;
                case "Exit":
                    endApp();
                    saveDepartment(response)
                    break;
            };
        });
};

function saveDepartment(response) {
    let departmentName = `INSERT INTO department (name) VALUES ('${response.newDepartment}')`;
    connection.query(departmentName, function (err, res) {
        if (err) throw err;
    })
};

// Add a new employee role =======================================================
function addNewRole() {
    inquirer
        .prompt([
            // Gather answers
            {
                name: "newRole",
                message: "What is the title of the new employee role?",
                type: "input"
            },
            {
                name: "newSalary",
                message: "What is the salary of the new employee role?",
                type: "input"
            },
            {
                name: "continue",
                message: "Is there anyting else you would like to do?",
                type: "list",
                choices: ["Add another role", "Update current employee's role", "Return to main menu", "Exit"]
            }
            // Ask the user if they would like to do more
        ]).then(function (response) {
            switch (response.continue) {
                case "Add another role.":
                    addRole();
                    saveRole(response);
                    break;
                case "Return to main menu":
                    runApp();
                    saveRole(response);
                    break;
                case "Exit":
                    endApp();
                    saveRole(response);
                    break;
            };
        });
};

function saveRole(response) {
    let departmentName = `INSERT INTO role (title, salary) VALUES ('${response.newRole}', '${response.newSalary}')`;
    connection.query(departmentName, function (err, res) {
        if (err) throw err;
    });
};

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "FirstName",
                message: "What is the employee's first name?",
                type: "input"
            },
            {
                name: "LastName",
                message: "What is the employee's last name?",
                type: "input"
            },
            {
                name: "continue",
                message: "Is there anyting else you would like to do?",
                type: "list",
                choices: ["Add another employee", "Return to main menu", "Exit"]
            }
            // Ask the user if they would like to do more
        ]).then(function (response) {
            switch (response.continue) {
                case "Add another employee":
                    addEmployee();
                    saveEmployee(response);
                    break;
                case "Return to main menu":
                    startingPrompt();
                    saveEmployee(response);
                    break;
                case "Exit":
                    endApp();
                    saveEmployee(response);
                    break;
            };
        });
};

// Save employee
function saveEmployee(response) {
    let departmentName = `INSERT INTO employee (first_name, last_name) VALUES ('${response.FirstName}', '${response.LastName}')`;
    connection.query(departmentName, function (err, res) {
        if (err) throw err;
    });
};