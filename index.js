const inquire = require('inquirer');
const chalk = require('chalk');
const sqlQueries = require('./assets/js/SQLqueries');
const Employee = require('./assets/js/Employee');
const Role = require('./assets/js/Role')
require('console.table')

const viewAllEmployees = () => {
    sqlQueries.viewAllEmployees().then(table => {
        console.table(table);
        init();
    }, rejection => {
        throw rejection
    })
};

const viewAllDepartments = () => {
    sqlQueries.viewAllDepartments()
        .then(table => {
            console.table(table);
            init()
        }, rejection => {
            throw rejection
        })
}


const viewEmployeesByDepartment = async () => {
    const departments = await sqlQueries.getDepartments();
    departments.push(`${chalk.bgYellow('GO BACK')}`)
    inquire.prompt({
        type: 'list',
        message: 'Which department would you like to view?',
        choices: departments,
        name: 'choice'
    }).then(
        async (prompt) => {
            if (prompt.choice == `${chalk.bgYellow('GO BACK')}`) {
                console.log('Returning to menu')
                init();
            } else {
                sqlQueries.viewEmployeesByDepartment(prompt.choice)
                    .then(success => {
                            console.table(success);
                            init();
                        },
                        rejection => {
                            throw rejection
                        });
            }
        })
};

const viewEmployeesByManager = async () => {
    const managers = await sqlQueries.getManagers();
    managers.push(`${chalk.bgYellow('GO BACK')}`)
    inquire.prompt({
        type: 'list',
        message: 'Whose employees would you like to view?',
        choices: managers,
        name: "choice"
    }).then(
        async (prompt) => {
            if (prompt.choice === `${chalk.bgYellow('GO BACK')}`) {
                console.log('Returning to menu')
                init();
            } else {
                sqlQueries.getManagerID(prompt.choice)
                    .then(manager_id => sqlQueries.viewEmployeesByManager(manager_id))
                    .then(table => {
                        console.table(table)
                        init();
                    }, rejection => {
                        throw rejection;
                    })
            }
        })
}

const addEmployee = async () => {
    let roles = await sqlQueries.getRoles();
    let managers = await sqlQueries.getManagers();
    managers.push("None");
    roles.push(`${chalk.bgYellow('GO BACK')}`);
    managers.push(`${chalk.bgYellow('GO BACK')}`)
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
            if (prompt.role == `${chalk.bgYellow('GO BACK')}` ||
                prompt.manager == `${chalk.bgYellow('GO BACK')}`) {
                console.log('Returning to menu')
                init();
            } else {
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
                    }, rejection => {
                        throw rejection;
                    })
            }
        })
}

const deleteEmployee = async () => {
    const employees = await sqlQueries.getEmployeeNames();
    employees.push(`${chalk.bgYellow('GO BACK')}`)
    inquire.prompt({
        type: 'list',
        message: "Which employee would you like to delete?",
        choices: employees,
        name: "choice"
    }).then(
        prompt => {
            if (prompt.choice === `${chalk.bgYellow('GO BACK')}`) {
                console.log("Returning to menu");
                init();
            } else {
                sqlQueries.deleteEmployee(prompt.choice)
                    .then(success => {
                        console.log(success);
                        init()
                    });
            }
        })
}

const addDepartment = () => {
    inquire.prompt({
        message: "What is the new department you want to add?",
        name: "choice"
    }).then(prompt => {
        const departmentToAdd = prompt.choice;
        sqlQueries.addDepartment(departmentToAdd)
            .then(success => {
                console.log(success);
                init();
            }, rejection => {
                throw rejection
            });
    })
}

const deleteDepartment = async () => {
    const departments = await sqlQueries.getDepartments();
    inquire.prompt({
        type: 'list',
        message: 'Which department gets the axe?',
        choices: departments,
        name: 'department'
    }).then(prompt => {
        const departmentToDelete = prompt.department;
        sqlQueries.deleteDepartment(departmentToDelete)
            .then(success => {
                console.log(success);
                init();
            });
    })
}

const addRole = async () => {
    const departments = await sqlQueries.getDepartments();
    departments.push(`${chalk.bgYellow('GO BACK')}`)
    inquire.prompt([{
            message: 'What is the title of the role you would like to add?',
            name: 'title'
        },
        {
            type: 'number',
            message: 'What is the salary for this role? (numbers only)',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'To what department does this role belong?',
            choices: departments,
            name: 'department'
        }
    ]).then(
        async (prompt) => {
            if (prompt.department === `${chalk.bgYellow('GO BACK')}`) {
                console.log('Returning to menu');
                init();
            } else {
                let {
                    title,
                    salary,
                    department
                } = prompt;
                const department_id = await sqlQueries.getDepartmentID(department);
                const roleToAdd = new Role(title, salary, department_id)
                sqlQueries.addRole(roleToAdd)
                    .then(success => {
                        console.log(success);
                        init()
                    }, rejection => {
                        throw rejection
                    })
            }
        })
}

const updateEmployeeRole = async () => {
    const employees = await sqlQueries.getEmployeeNames();
    const roles = await sqlQueries.getRoles();
    employees.push(`${chalk.bgYellow('GO BACK')}`);
    roles.push(`${chalk.bgYellow('GO BACK')}`)
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
            if (prompt.employee === `${chalk.bgYellow('GO BACK')}` ||
                prompt.role === `${chalk.bgYellow('GO BACK')}`) {
                console.log('Returning to menu');
                init();
            } else {
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
                    }, rejection => {
                        throw rejection;
                    });
            }
        }
    );
}

const updateEmployeeManager = async () => {
    const employees = await sqlQueries.getEmployeeNames();
    const managers = await sqlQueries.getManagers();
    employees.push(`${chalk.bgYellow('GO BACK')}`);
    managers.push(`${chalk.bgYellow('GO BACK')}`);
    inquire.prompt([{
            type: 'list',
            message: 'Which employee do you need to update?',
            choices: employees,
            name: 'employee'
        },
        {
            type: 'list',
            message: 'Who will be assigned as their new Manager?',
            choices: managers,
            name: 'manager'
        }
    ]).then(
        async (prompt) => {
            if (prompt.employee === `${chalk.bgYellow('GO BACK')}` ||
                prompt.manager === `${chalk.bgYellow('GO BACK')}`) {
                console.log('Returning to menu');
                init();
            } else {
                const employee_id = await sqlQueries.getEmployeeID(prompt.employee);
                const manager_id = await sqlQueries.getManagerID(prompt.manager);
                const employeesNewManager = {
                    employee_id: employee_id,
                    manager_id: manager_id
                }
                sqlQueries.updateEmployeeManager(employeesNewManager)
                    .then(success => {
                        console.log(success);
                        init();
                    }, rejection => {
                        throw rejection
                    })
            }
        })
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
            `${chalk.cyan("View all departments")}`,
            `${chalk.green("Add Department")}`,
            `${chalk.redBright("Remove department")}`,
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
            case `${chalk.cyan("View all departments")}`:
                viewAllDepartments();
                break;
            case `${chalk.green("Add Department")}`:
                addDepartment();
                break;
            case `${chalk.redBright("Remove department")}`:
                deleteDepartment();
                break;
            case `${chalk.green("Add Role")}`:
                addRole();
                break;
            case `${chalk.magentaBright("Update Employee Role")}`:
                updateEmployeeRole();
                break;
            case `${chalk.magentaBright("Update Employee Manager")}`:
                updateEmployeeManager();
                break;
            default:
                process.exit();
        }
    })
};

init();