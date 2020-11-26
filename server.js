// Dependencies
const mysql = require("mysql")
const inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "96111961",
    database: "employeesDB"
});

// Initiate MySQL Connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
});

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
        // Route the user depending on answer
        .then(function (answer) {
            switch (answer.action) {
                case "Add new department, role or employee":
                    addNew();
                    break;

                case "View existing departments, roles or employees":
                    viewAll();
                    break;

                case "Update existing departments, roles or employees":
                    updateExisting();
                    break;

                case "Exit":
                    endApp();
                    break;
            };
        });
};