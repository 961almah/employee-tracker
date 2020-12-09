// Dependencies
// ======================================================================
const figlet = require('figlet');
const mysql = require('mysql');
const inquirer = require('inquirer');

// MySQL connection
// ======================================================================
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "96111961",
    database: "employees_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    runApp();
});

// App Functionality
// ======================================================================
// Start the app
const runApp = () => {
    // Create ASCII art with the words Employee Summary
    figlet('Employee\nSummary', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        // Display the art along with a mini app description
        console.log(data + '\n\nAdd departments, roles and employess within your company\nto easily organize and your plan your business.\n' + '\nBegin questions:\n')
        startingPrompt();
    });
};

// Ask what the user would like to do
function startingPrompt() {
    inquirer
        .prompt([
            // Gather answers
            {
                name: 'action',
                message: 'What would you like to do?',
                type: 'list',
                choices: [
                    "Add new role or employee",
                    "View existing departments, roles or employees",
                    "Update existing departments, roles or employees",
                    "Exit"
                ]
            }
        ])
        // Route the user depending on answer
        .then(function (answer) {
            switch (answer.action) {
                case "Add new role or employee":
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

// End the app
function endApp() {
    /* Use SIGTERM to end the program without killing any running or pending requests. https://flaviocopes.com/node-terminate-program/ */
    // process.on('SIGTERM', () => {
    console.log("Thanks for using our application! Goodbye");
    process.exit(0);
    // });
};

// Save new
// ===============================================================================
// Prompts for new department, role or employee
function addNew() {
    inquirer
        .prompt({
            // Gather answers
            name: "SelectAddNewOp",
            message: "Would you like to add a new department, role or employee?",
            type: "list",
            choices: [
                "Add new role",
                "Add new employee",
                "Return to main menu",
                "Exit"
            ]
        })
        // Route the user depending on answer
        .then(function (answer) {
            switch (answer.SelectAddNewOp) {
                case "Add new role":
                    addNewRole();
                    break;
                case "Add new employee":
                    addNewEmployee();
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
                name: "department",
                message: "Which department is this role under?",
                type: "list",
                choices: ["Engineering", "Management", "Wage Slavery"]
            },
            {
                name: "continue",
                message: "Is there anyting else you would like to do?",
                type: "list",
                choices: ["Add another role", "Update current employee's role", "Return to main menu", "Exit"]
            }
            // Ask the user if they would like to do more
        ]).then(function (answer) {
            const role = answer.newRole;
            const salary = answer.newSalary;
            let department = answer.department;
            switch (department) {
                case "Engineering":
                    department = 1;
                    break;
                case "Management":
                    department = 2;
                    break;
                case "Wage Slavery":
                    department = 3;
                    break;

            }

            connection.query("INSERT INTO role SET ?,?,?", [newRole, newSalary, department]);

            switch (answer.continue) {
                case "Add another role.":
                    addNewRole();
                    saveRole(answer);
                    break;
                case "Return to main menu":
                    runApp();
                    saveRole(answer);
                    break;
                case "Exit":
                    endApp();
                    saveRole(answer);
                    break;
            };
        });
};

// Save role
function saveRole(answer) {
    let departmentName = `INSERT INTO role (title, salary) VALUES ('${answer.newRole}', '${answer.newSalary}')`;
    connection.query(departmentName, function (err, res) {
        if (err) throw err;
    });
};

// Add a new employee ============================================================
function addNewEmployee() {
    // if no role or department, must add role or department before adding new employee
    // how to create choices from user input of roles and department
    inquirer
        .prompt([
            // Gather answers
            {
                name: "newEmployeeFN",
                message: "What is the first name of the new Employee?",
                type: "input"
            },
            {
                name: "newEmployeeLN",
                message: "What is the last name of the new Employee?",
                type: "input"
            },
            {
                name: "continue",
                message: "Is there anyting else you would like to do?",
                type: "list",
                choices: ["Add another employee", "Return to main menu", "Exit"]
            }
            // Ask the user if they would like to do more
        ]).then(function (answer) {
            switch (answer.continue) {
                case "Add another employee":
                    addNewEmployee();
                    saveEmployee(answer);
                    break;
                case "Return to main menu":
                    startingPrompt();
                    saveEmployee(answer);
                    break;
                case "Exit":
                    endApp();
                    saveEmployee(answer);
                    break;
            };
        });
};

// Save employee
function saveEmployee(answer) {
    let departmentName = `INSERT INTO employee (first_name, last_name) VALUES ('${answer.newEmployeeFN}', '${answer.newEmployeeLN}')`;
    connection.query(departmentName, function (err, res) {
        if (err) throw err;
    });
};

// View stored information
// ===============================================================================
function viewAll() {
    inquirer
        .prompt(
            // Gather answers
            {
                name: "viewData",
                message: "What would you like to view?",
                type: "list",
                choices: ["Current departments", "Current employee roles", "Current employees", "Company Overview", "Return to main menu", "Exit"]
            },
        )
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

// Delete existing
// ===============================================================================
function updateExisting() {
    inquirer
        .prompt([
            // Gather answers
            {
                name: 'action',
                message: 'What would you like to do?',
                type: 'list',
                choices: [
                    "Delete department",
                    "Delete role",
                    "Delete/update employee",
                    "Return to the main menu",
                    "Exit"
                ]
            }
        ])
        // Route the user depending on answer
        .then(function (answer) {
            switch (answer.action) {
                case "Delete department":
                    updateDepartment();
                    break;

                case "Delete role":
                    updateRole();
                    break;

                case "Delete/update employee":
                    updateEmployee();
                    break;

                case "Return to the main menu":
                    runApp();
                    break;

                case "Exit":
                    endApp();
                    break;
            };
        });
};

// Funtions used in the delete department prompts ================================
// Allows the user to view all saved departments so they know the ID numbers
// Allows the user to continue with the delete, return to the previous/main menu, or exit the app
function updateDepartment() {
    inquirer
        .prompt([
            {
                name: 'action',
                message: 'What would you like to do?',
                type: 'list',
                choices: ["View current departments and ID numbers",
                    "Delete a department by ID number",
                    "Return to the delete menu",
                    "Return to the main menu",
                    "Exit"
                ]
            }
        ]).then(function (answer) {
            switch (answer.action) {
                case "View current departments and ID numbers":
                    renderDept();
                    break;
                case "Delete a department by ID number":
                    deleteDepartment()
                    break;
                case "Return to the update menu":
                    updateExisting()
                    break;
                case "Return to the main menu":
                    runApp();
                    break;
                case "Exit":
                    endApp();
                    break;
            }
        });
};

// Prompts the user for the department ID number
// Deletes the department, or aborts
function deleteDepartment() {
    inquirer
        .prompt([
            {
                name: "id",
                message: "What is the ID number of the department you would like to delete?",
                type: "input",
            },
            {
                name: "confirm",
                message: "Are you sure you would like to delete this department?",
                type: "confirm"
            }
        ])
        .then(function (answer) {
            if (answer.confirm) {
                removeDept(answer);
                updateDepartment();
            } else {
                updateDepartment();
            }
        })
};

// Removes selected department from MYSQL
function removeDept(answer) {
    let departmentID = `DELETE FROM department WHERE id='${answer.id}' LIMIT 1`;
    connection.query(departmentID, function (err, res) {
        if (err) throw err;
    });
};

// Displays the currently saved departments 
function renderDept() {
    console.log("\n===========================================\nAll Departments:\n")
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].name + " | Department ID: " + res[i].id);
        };
        console.log("\n===========================================\n")
        updateDepartment();
    });
};

// Functions used in the delete role prompts ====================================
// Allows the user to view all saved roles so they know the ID numbers
// Allows the user to continue with the delete, return to the previous/main menu, or exit the app
function updateRole() {
    inquirer
        .prompt([
            {
                name: 'action',
                message: 'What would you like to do?',
                type: 'list',
                choices: ["View current roles and ID numbers",
                    "Delete a role by ID number",
                    "Return to the delete menu",
                    "Return to the main menu",
                    "Exit"
                ]
            }
        ]).then(function (answer) {
            switch (answer.action) {
                case "View current roles and ID numbers":
                    renderRoles();
                    break;
                case "Delete a role by ID number":
                    deleteRole()
                    break;
                case "Return to the update menu":
                    updateExisting()
                    break;
                case "Return to the main menu":
                    runApp();
                    break;
                case "Exit":
                    endApp();
                    break;
            }
        });
};

// Prompts the user for the department ID number
// Deletes the role, or aborts
function deleteRole() {
    inquirer
        .prompt([
            {
                name: "id",
                message: "What is the ID number of the role you would like to delete?",
                type: "input",
            },
            {
                name: "confirm",
                message: "Are you sure you would like to delete this role?",
                type: "confirm"
            }
        ])
        .then(function (answer) {
            if (answer.confirm) {
                removeRole(answer);
                updateRole();
            } else {
                updateRole();
            }
        })
};

// Removes selected role from MYSQL
function removeRole(answer) {
    let roleID = `DELETE FROM role WHERE id='${answer.id}' LIMIT 1`;
    connection.query(roleID, function (err, res) {
        if (err) throw err;
    });
};

// Displays the currently saved roles 
function renderRoles() {
    console.log("\n===========================================\nAll Roles:\n")
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Title: " + res[i].title + " | " + res[i].id);
        };
        console.log("\n===========================================\n")
        updateRole();
    });
};

// Functions used in the delete/update employee prompts ====================================
// Allows the user to view all saved employees so they know the ID numbers
// Allows the user to continue with the delete, return to the previous/main menu, or exit the app
function updateEmployee() {
    inquirer
        .prompt([
            {
                name: 'action',
                message: 'What would you like to do?',
                type: 'list',
                choices: [
                    "View current employees and ID numbers",
                    "Delete an employee by ID number",
                    "Assign an employee's role by ID number",
                    "Return to the delete menu",
                    "Return to the main menu",
                    "Exit"
                ]
            }
        ]).then(function (answer) {
            switch (answer.action) {
                case "View current employees and ID numbers":
                    renderEmployees();
                    break;
                case "Delete an employee by ID number":
                    deleteEmployee();
                    break;
                case "Assign an employee's role by ID number":
                    findRoleID()
                    break;
                case "Return to the update menu":
                    updateExisting()
                    break;
                case "Return to the main menu":
                    runApp();
                    break;
                case "Exit":
                    endApp();
                    break;
            }
        });
};

// Prompts the user for the department ID number
// Deletes the employee, or aborts
function deleteEmployee() {
    inquirer
        .prompt([
            {
                name: "id",
                message: "What is the ID number of the employee you would like to delete?",
                type: "input",
            },
            {
                name: "confirm",
                message: `Are you sure you would like to delete this employee?`,
                type: "confirm"
            }
        ])
        .then(function (answer) {
            if (answer.confirm) {
                removeEmployee(answer);
                updateEmployee();
            } else {
                updateEmployee();
            }
        });
};

// Removes selected role from MYSQL
function removeEmployee(answer) {
    let employeeID = `DELETE FROM employee WHERE id='${answer.id}' LIMIT 1`;
    connection.query(employeeID, function (err, res) {
        if (err) throw err;
    });
};

function findRoleID() {
    inquirer
        .prompt([
            {
                name: 'action',
                type: 'list',
                choices: [
                    "View current roles and ID numbers",
                    "Assign an employee's role by ID number",
                    "Return to the update menu",
                    "Return to the main menu",
                    "Exit"
                ]
            }
        ])
        .then(function (answer) {
            switch (answer.action) {
                case "View current roles and ID numbers":
                    renderRoles();
                    break;
                case "Assign an employee's role by ID number":
                    assignEmployee();
                    break;
                case "Return to the update menu":
                    updateExisting()
                    break;
                case "Return to the main menu":
                    runApp();
                    break;
                case "Exit":
                    endApp();
                    break;
            }
        });
}
function assignEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID number for the role you would like to assign?",
                name: "roleID"
            },
            {
                type: "input",
                message: "What is the ID number for the employee whose role you are assigning?",
                name: "id"
            }
        ]).then(function (answer) {
            saveEmRole(answer);

        })
}
// Assigns employee to role
function saveEmRole(answer) {
    let employeeID = `UPDATE employee SET role_id = '${answer.roleID}' WHERE id='${answer.id}'`;
    connection.query(employeeID, function (err, res) {
        if (err) throw err;
        console.log("Employee's role successfully updated!")
        updateEmployee()
    });
}

function renderRoles() {
    console.log("\n===========================================\nAll Roles:\n")
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " | " + "Title: " + res[i].title);
        };
        console.log("\n===========================================\n")
        findRoleID();
    });
}

// Displays the currently saved roles 
function renderEmployees() {
    console.log("\n===========================================\nAll Employees:\n")
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].first_name + " " + res[i].last_name + " | Employee ID: " + res[i].id);
        };
        console.log("\n===========================================\n")
        updateEmployee();
    });
};

