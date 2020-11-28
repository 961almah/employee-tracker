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

runApp();

function endApp() {
    process.on('SIGTERM', () => {
        server.close(() => {
            console.log('Process terminated')
        });
    });
};

function startingPrompt() {
    inquirer
        .prompt([
            {
                name: 'choice',
                message: 'What would you like to do?',
                type: 'rawlist',
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
                case "Add a new employee, department or role":
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

// for add new
function add() {
    inquirer
        .prompt({
            name: "SelectedNew",
            message: "Would you like to add a new employee, department or role?",
            type: "rawlist",
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
                    startingPrompt();
                    break;
                case "Exit":
                    endApp();
                    break;
            };
        });
};

function addEmployee() {
    inquirer
        .prompt({
            // Gather answers
            name: "SelectAddNew",
            message: "Would you like to add a new department, role or employee?",
            type: "rawlist",
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
            switch (answer.SelectAddNew) {
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
                    startingPrompt();
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
                type: "rawlist",
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
                    startingPrompt();
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
function addRole() {
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
                type: "rawlist",
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
                    startingPrompt();
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
                type: "rawlist",
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

function viewAll() {
    inquirer
        .prompt([
            // Gather answers
            {
                name: "viewData",
                message: "What would you like to view?",
                type: "rawlist",
                choices: ["Current departments", "Current employee roles", "Current employees", "Company Overview", "Return to main menu", "Exit"]
            },
        ])
        // Route the user depending on answer
        .then(function (answer) {
            switch (answer.viewData) {
                case "Current departments":
                    departmentSearch();
                    break;
                case "Current employee roles":
                    roleSearch();
                    break;
                case "Current employees":
                    employeeSearch();
                    break;
                case "Company Overview":
                    allInformation()
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

// Return all currently saved department data
function departmentSearch() {
    console.log("\n===========================================\nAll Departments:\n")
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].name + " | Department ID: " + res[i].id);
        };
        console.log("\n===========================================\n")
        viewAll();
    });
};

// Return all currently saved role data
function roleSearch() {
    console.log("\n===========================================\nAll Roles:\n")
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Title: " + res[i].title + " | Salary: " + res[i].salary + " | Department ID: " + res[i].department_id);
        };
        console.log("\n===========================================\n")
        viewAll();
    });
};

// Return all currently saved employee data
function employeeSearch() {
    console.log("\n===========================================\nAll Employees:\n")
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].first_name + " " + res[i].last_name + " | Employee ID: " + res[i].id);
        };
        console.log("\n===========================================\n")
        viewAll();
    });
};

// View all information
function allInformation() {
    console.log("\n===========================================\nAll Company Data:\n")
    connection.query("SELECT r.title, e.role_id, e.first_name, e.last_name, r.salary, e.manager_id FROM department d JOIN role r ON d.id = r.department_id JOIN employee e ON e.role_id = r.id", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].first_name + " " + res[i].last_name + " | Title: " + res[i].title + " | Employee ID: " + res[i].role_id + " | Salary: " + res[i].salary + " | Manager ID: " + res[i].manager_id);
        };
        console.log("\n===========================================\n")
        viewAll();
        if (err) throw (err)
    });
};