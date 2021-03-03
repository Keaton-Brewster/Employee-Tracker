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

const viewAllEmployees = () => {
    conn.query(`SELECT e.id,e.First_name,e.Last_name,Title,Salary,Department, CONCAT(m.First_name, " ", m.Last_name) as Manager 
                FROM employees e
                INNER JOIN roles r
                ON e.role_id = r.role_id
                INNER JOIN deps d
                ON r.department_id = d.id
                LEFT JOIN employees m
                ON m.id = e.Manager`,

        (err, table) => {
            if (err) throw err;


            console.table(table)

            setTimeout(() => {
                init();
            }, 100);
        })
};

const viewEmployeesByDepartment = () => {
    conn.query(`SELECT * FROM deps`, (err, table) => {
        if (err) throw err;

        let deps = []
        table.forEach(column => {
            deps.push(column.Department)
        })

        inquire.prompt([{
            type: "list",
            message: "Which department would you like to view?",
            choices: deps,
            name: "action"
        }]).then(your => {
            conn.query(`SELECT e.id,e.First_name,e.Last_name,Title,Salary,Department, CONCAT(m.First_name, " ", m.Last_name) as Manager 
                        FROM employees e
                        INNER JOIN roles r
                        ON e.role_id = r.role_id
                        INNER JOIN deps d
                        ON r.department_id = d.id
                        LEFT JOIN employees m
                        ON m.id = e.Manager
                        WHERE d.Department = "${your.action}"`,
                (err, table) => {
                    if (err) throw err;

                    console.table(table)
                    setTimeout(() => {
                        init();
                    }, 100);
                })
        })
    })
};

// const viewEmployeesByManager = () => {
//     conn.query(`SELECT e.id,e.First_name,e.Last_name,Title,Salary,Department, CONCAT(m.First_name, " ", m.Last_name) as Manager 
//                 FROM employees e
//                 INNER JOIN roles r
//                 ON e.role_id = r.role_id
//                 INNER JOIN deps d
//                 ON r.department_id = d.id
//                 LEFT JOIN employees m
//                 ON m.id = e.Manager 
//                 WHERE e.role_id = 3`,
//         (err, table) => {
//             if (err) throw err;

//             let choices = [];

//             table.forEach(column => {
//                 choices.push(`${column.First_name} ${column.Last_name}`)
//             })

//             inquire.prompt([{
//                 type: "list",
//                 message: "Who's employees would you like to view?",
//                 choices: choices,
//                 name: "action"
//             }]).then(your => {
//                 conn.query(`SELECT e.id,e.First_name,e.Last_name,Title,Salary,Department, CONCAT(m.First_name, " ", m.Last_name) as Manager 
//                         FROM employees e
//                         INNER JOIN roles r
//                         ON e.role_id = r.role_id
//                         INNER JOIN deps d
//                         ON r.department_id = d.department_id
//                         LEFT JOIN employees m
//                         ON m.id = e.Manager 
//                         WHERE Manager = "${your.action}"`,
//                     (err, table) => {
//                         if (err) throw err;

//                         console.table(table)
//                         setTimeout(() => {
//                             init();
//                         }, 300);
//                     })
//             })
//         })
// };



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
        // can probably merge these two into one function, since they work together
    ]).then(
        async (data) => {
            const {
                First_name,
                Last_name,
                role,
                manager
            } = data;

            if (manager === "None") {
                manager_id = null
            } else {
                manager_id = await sqlQueries.getManagerID(manager);
            }
            const role_id = await sqlQueries.getRoleID(role);
            const newEmployee = new Employee(First_name, Last_name, role_id, manager_id);
            sqlQueries.addEmployeeToDB(newEmployee).then(success => {
                console.log(success);
                init();
            }, rejected => {
                console.log(rejected);
                process.exit();
            })
        }
    )
}

const deleteEmployee = async () => {
    const employees = await sqlQueries.getEmployeeNames();
    inquire.prompt([{
        type: 'list',
        message: "Which employee would you like to delete?",
        choices: employees,
        name: "choice"
    }]).then(your => {
        sqlQueries.deleteEmployee(your.choice).then(success => {
            console.log(success);
            init()
        }, rejected => {
            console.log(rejected)
            process.exit();
        });
    })
}

const updateEmployeeRole = async (data) => {
    const role_id = await sqlQueries.getRoleID(data.role)
    const employee_id = await sqlQueries.getEmployeeID(data.employee);
    const newEmployeeRole = {
        id: employee_id,
        role_id: role_id
    }
    sqlQueries.updateEmployeeRole(newEmployeeRole).then(success => {
        console.log(success);
        init();
    }, rejected => {
        console.log(rejected);
        process.exit();
    });
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
    ]).then(update => updateEmployeeRole(update));
}

const init = () => {
    inquire.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: [
            `${chalk.cyan("View")} all employees`,
            `${chalk.cyan("View")} employees by Department`,
            // `${chalk.cyan("View")} employees by Manager`,
            `${chalk.green("Add")} employee`,
            `${chalk.redBright("Remove")} employee`,
            `${chalk.green("Add")} Department`,
            `${chalk.green("Add")} Role`,
            `${chalk.bgMagentaBright("Update")} employee role`,
            `${chalk.bgMagentaBright("Update")} employee Manager`,
            `${chalk.bgRedBright("EXIT")}`
        ],
        name: "action"
    }]).then(your => {
        switch (your.action) {
            case `${chalk.cyan("View")} all employees`:
                viewAllEmployees();
                break;
            case `${chalk.cyan("View")} employees by Department`:
                viewEmployeesByDepartment();
                break;
            case `${chalk.cyan("View")} employees by Manager`:
                viewEmployeesByManager();
                break;
            case `${chalk.green("Add")} employee`:
                addEmployee();
                break;
            case `${chalk.redBright("Remove")} employee`:
                deleteEmployee();
                break;
            case `${chalk.bgMagentaBright("Update")} employee role`:
                chooseEmployeeUpdates();
                break;
            case `${chalk.bgMagentaBright("Update")} employee Manager`:
                console.log("update manager")
                break;
            default:
                process.exit();
        }
    })
};

init();