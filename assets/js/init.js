const inquire = require('inquirer');
const chalk = require('chalk');
const Request = require('./Requests');

const init = () => {
    inquire.prompt([{
        type: "list",
        message: `${chalk.yellow("What would you like to do?")}`,
        choices: [
            `${chalk.cyan("View all Employees")}`,
            `${chalk.cyan("View Employees by Department")}`,
            `${chalk.cyan("View Employees by Manager")}`,
            `${chalk.green("Add Employee")}`,
            `${chalk.redBright("DELETE Employee")}`,
            `${chalk.cyan("View all Departments")}`,
            `${chalk.green("Add Department")}`,
            `${chalk.redBright("DELETE Department")}`,
            `${chalk.cyan('View all Roles')}`,
            `${chalk.green("Add Role")}`,
            `${chalk.redBright('DELETE Role')}`,
            `${chalk.magentaBright("Update Employee Role")}`,
            `${chalk.magentaBright("Update Employee Manager")}`,
            `${chalk.bgRedBright("EXIT")}`
        ],
        name: "action"
    }]).then(prompt => {
        switch (prompt.action) {
            case `${chalk.cyan("View all Employees")}`:
                Request.viewAllEmployees();
                break;

            case `${chalk.cyan("View Employees by Department")}`:
                Request.viewEmployeesByDepartment();
                break;

            case `${chalk.cyan("View Employees by Manager")}`:
                Request.viewEmployeesByManager();
                break;

            case `${chalk.green("Add Employee")}`:
                Request.addEmployee();
                break;

            case `${chalk.redBright("DELETE Employee")}`:
                Request.deleteEmployee();
                break;

            case `${chalk.cyan("View all Departments")}`:
                Request.viewAllDepartments();
                break;

            case `${chalk.green("Add Department")}`:
                Request.addDepartment();
                break;

            case `${chalk.redBright("DELETE Department")}`:
                Request.deleteDepartment();
                break;

            case `${chalk.cyan('View all Roles')}`:
                Request.viewAllRoles();
                break;

            case `${chalk.green("Add Role")}`:
                Request.addRole();
                break;
            case `${chalk.redBright('DELETE Role')}`:
                Request.deleteRole();
                break;
            case `${chalk.magentaBright("Update Employee Role")}`:
                Request.updateEmployeeRole();
                break;

            case `${chalk.magentaBright("Update Employee Manager")}`:
                Request.updateEmployeeManager();
                break;

            default:
                process.exit();
        }
    })
};

module.exports = init;