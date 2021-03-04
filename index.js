const mysql = require('mysql');
const inquire = require('inquirer');
const chalk = require('chalk');
const sqlQueries = require('./assets/js/SQLqueries');
const Employee = require('./assets/js/Employee');
require('console.table')

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'KeatonDev42420',
    database: 'employeeManager',
};

const conn = mysql.createConnection(config);


// COULD PROBABLY REWRITE THIS SO THAT IT IS A PROMISE, AND CAN REJECT IF SOMETHING GOES AMISS
const viewAllEmployees = () => {
    conn.query(`SELECT e.id,e.First_name,e.Last_name,Title,Salary,Department, CONCAT(m.First_name, " ", m.Last_name) as Manager 
                FROM employees e
                INNER JOIN roles r
                ON e.role_id = r.role_id
                INNER JOIN deps d
                ON r.department_id = d.id
                LEFT JOIN employees m
                ON m.id = e.Manager
                ORDER BY id`,

        (err, table) => {
            if (err) throw err;
            console.table(table)
            setTimeout(() => {
                init();
            }, 100);
        })
};


const viewEmployeesByDepartment = async () => {
    const departments = await sqlQueries.getDepartments();
    console.log(departments)
    inquire.prompt({
        type: 'list',
        message: 'Which department would you like to view?',
        choices: departments,
        name: 'choice'
    }).then(async (prompt) => {
        sqlQueries.viewEmployeesByDepartment(prompt.choice)
            .then(success => {
                    console.table(success);
                    init();
                },
                rejected => {
                    throw rejected
                });
    })
};

const viewEmployeesByManager = async () => {
    const managers = await sqlQueries.getManagers();
    inquire.prompt({
        type: 'list',
        message: 'Whose employees would you like to view?',
        choices: managers,
        name: "choice"
    }).then(async (prompt) => {
        sqlQueries.getManagerID(prompt.choice)
            .then(manager_id => sqlQueries.viewEmployeesByManager(manager_id))
            .then(table => {
                console.table(table)
                init();
            }, rejected => {
                throw rejected;
            })
    })
}

const addEmployee = async () => {
    let roles = await sqlQueries.getRoles();
    let managers = await sqlQueries.getManagers();
    managers.push("None");
    inquire.prompt([{
            message: "What is the employees first name?",
            name: "First_name"
        },
        {
            message: "What is the employees last name?",
            name: "Last_name"
        },
        {
            type: "list",
            message: "What is the employees role?",
            choices: roles,
            name: "role"
        },
        {
            type: "list",
            message: "Who is this employees Manager? (esc for null)",
            choices: managers,
            name: "manager"
        }
    ]).then(
        async (prompt) => {
            const {
                First_name,
                Last_name,
                role,
                manager
            } = prompt;

            if (manager === "None") {
                manager_id = null
            } else {
                manager_id = await sqlQueries.getManagerID(manager);
            }
            const role_id = await sqlQueries.getRoleID(role);
            const newEmployee = new Employee(First_name, Last_name, role_id, manager_id);
            sqlQueries.addEmployee(newEmployee)
                .then(success => {
                    console.log(success);
                    init();
                }, rejected => {
                    throw rejected;
                })
        }
    )
}

const deleteEmployee = async () => {
    const employees = await sqlQueries.getEmployeeNames();
    inquire.prompt({
        type: 'list',
        message: "Which employee would you like to delete?",
        choices: employees,
        name: "choice"
    }).then(prompt => {
        sqlQueries.deleteEmployee(prompt.choice)
            .then(success => {
                console.log(success);
                init()
            }, rejected => {
                throw rejected;
            });
    })
}

const addDepartment = async () => {
    inquire.prompt({
        message: "What is the new department you want to add?",
        name: "choice"
    }).then(prompt => {
        const departmentToAdd = prompt.choice;
        sqlQueries.addDepartment(departmentToAdd)
            .then(success => {
                console.log(success);
                init();
            }, rejected => {
                throw rejected
            });
    })
}

const chooseEmployeeUpdates = async () => {
    const employees = await sqlQueries.getEmployeeNames();
    const roles = await sqlQueries.getRoles();
    inquire.prompt([{
            type: "list",
            message: "Which employee do you need to update?",
            choices: employees,
            name: "employee"
        },
        {
            type: "list",
            message: "What should their new role be?",
            choices: roles,
            name: "role"
        }
    ]).then(
        async (prompt) => {
            const role_id = await sqlQueries.getRoleID(prompt.role)
            const employee_id = await sqlQueries.getEmployeeID(prompt.employee);
            const newEmployeeRole = {
                id: employee_id,
                role_id: role_id
            }
            sqlQueries.updateEmployeeRole(newEmployeeRole)
                .then(success => {
                    console.log(success);
                    init();
                }, rejected => {
                    throw rejected;
                });
        }
    );
}

const init = () => {
    inquire.prompt([{
        type: "list",
        message: `${chalk.yellow("What would you like to do?")}`,
        choices: [
            `${chalk.cyan("View all employees")}`,
            `${chalk.cyan("View employees by Department")}`,
            `${chalk.cyan("View employees by Manager")}`,
            `${chalk.green("Add Employee")}`,
            `${chalk.redBright("Remove employee")}`,
            `${chalk.green("Add Department")}`,
            `${chalk.green("Add Role")}`,
            `${chalk.magentaBright("Update Employee Role")}`,
            `${chalk.magentaBright("Update Employee Manager")}`,
            `${chalk.bgRedBright("EXIT")}`
        ],
        name: "action"
    }]).then(prompt => {
        switch (prompt.action) {
            case `${chalk.cyan("View all employees")}`:
                viewAllEmployees();
                break;
            case `${chalk.cyan("View employees by Department")}`:
                viewEmployeesByDepartment();
                break;
            case `${chalk.cyan("View employees by Manager")}`:
                viewEmployeesByManager();
                break;
            case `${chalk.green("Add Employee")}`:
                addEmployee();
                break;
            case `${chalk.redBright("Remove employee")}`:
                deleteEmployee();
                break;
            case `${chalk.green("Add Department")}`:
                addDepartment();
                break;
            case `${chalk.magentaBright("Update Employee Role")}`:
                chooseEmployeeUpdates();
                break;
            case `${chalk.magentaBright("Update Employee Manager")}`:
                console.log("update manager")
                break;
            default:
                process.exit();
        }
    })
};

init();