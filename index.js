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
            }, 300);
        })
};

const viewEmployeesByDepartment = () => {
    conn.query(`SELECT * FROM deps`, (err, table) => {
        if (err) throw err;

        console.log(table)
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
                    }, 300);
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

const addEmployee = async (data) => {
    const {
        First_name,
        Last_name,
        role,
        manager
    } = data;
    const managerID = await sqlQueries.getManagerID(manager);
    const roleID = await sqlQueries.getRoleID(role);
    const newEmployee = new Employee(First_name, Last_name, role, managerID);
    console.log(newEmployee);
    //killing process for now.
    process.exit();
}

const buildEmployee = async () => {
    let roles = await sqlQueries.getRoles();
    let managers = await sqlQueries.getManagers();
    console.log(roles);
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
    ]).then(data => addEmployee(data))
}

const init = () => {
    inquire.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: [
            `View ${chalk.green("all")} employees`,
            `View employees by ${chalk.cyanBright("Department")}`,
            // `View employees by ${chalk.magentaBright("Manager")}`,
            `${chalk.green("Add")} employee`,
            `${chalk.redBright("Remove")} employee`,
            `Update employee role`,
            `Update employee Manager`,
            "EXIT"
        ],
        name: "action"
    }]).then(your => {
        switch (your.action) {
            case `View ${chalk.green("all")} employees`:
                viewAllEmployees();
                break;
            case `View employees by ${chalk.cyanBright("Department")}`:
                viewEmployeesByDepartment();
                break;
            case `View employees by ${chalk.magentaBright("Manager")}`:
                viewEmployeesByManager();
                break;
            case `${chalk.green("Add")} employee`:
                buildEmployee();
                break;
            case `${chalk.redBright("Remove")} employee`:
                console.log("remove")
                break;
            case "Update employee role":
                console.log("update role")
                break;
            case "Update employee Manager":
                console.log("update manager")
                break;
            default:
                process.exit();
        }
    })
};

init();