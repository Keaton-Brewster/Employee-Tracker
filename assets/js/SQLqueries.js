const {
    table,
    Console
} = require('console');
const {
    resolveCname
} = require('dns');
const {
    promises
} = require('fs');
const mysql = require('mysql');
const {
    resolve
} = require('path');
const {
    async
} = require('rxjs');
const {
    OuterSubscriber
} = require('rxjs/internal/OuterSubscriber');
const {
    inherits
} = require('util');

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'KeatonDev42420',
    database: 'employeeManager',
};

const conn = mysql.createConnection(config);





// const allRoles = (() => {
//     let allRoles = [];

//     conn.query('SELECT role_id,title,salary FROM roles', (err, table) => {
//         if (err) throw err;
//         allRoles = table
//     }).then(() => {
//         allRoles = allRoles.map(({
//                 role_id,
//                 title,
//                 salary
//             }) =>
//             ({
//                 id: role_id,
//                 title: `${title}`,
//                 salary: `${salary}`
//             })
//         )
//     });

//     return allRoles

// })();


const getRoles = async () => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT title FROM roles`, (err, table) => {
            if (err) reject(err);
            table = table.map(col => col.title)
            resolve(table);
        })
    })
};

const getManagers = async () => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT CONCAT(e.First_name," ",e.Last_name) as NAME
                    FROM employees e
                    INNER JOIN roles r
                    ON e.role_id = r.role_id
                    AND r.title = "Manager"`, (err, table) => {
            if (err) reject(err);
            table = table.map(col => col.NAME)
            resolve(table)
        })
    })
}

const getManagerID = async (managerName) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id FROM employees m
                    INNER JOIN roles r
                    ON r.title = "Manager"
                    WHERE CONCAT(m.First_name," ",m.Last_name) = "${managerName}"`,
            (err, table) => {
                if (err) reject(err);
                table = table.map(col => col.id)
                resolve(table)
            })
    })
}

const getRoleID = async (roleTitle) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT role_id FROM roles
                    WHERE ?`, {
            title: roleTitle
        }, (err, table) => {
            if (err) reject(err);
            table = table.map(col => col.role_id)
            resolve(table)
        })
    })
}

const addEmployeeToDB = (employeeOBJ) => {
    return new Promise((resolve, reject) => {
        const {
            First_name,
            Last_name,
            role_id,
            Manager
        } = employeeOBJ;
        conn.query(`INSERT INTO employees (First_name, Last_name, role_id, Manager)
                    VALUES ("${First_name}", "${Last_name}", ${role_id}, ${Manager})`,
            (err, dbRes) => {
                if (err) reject(err);
                resolve("Employee added!")
            })
    })
}

const deleteEmployee = (employeeFullName) => {
    return new Promise((resolve, reject) => {
        console.log(employeeFullName);
        conn.query(`DELETE FROM employees e
                WHERE
                CONCAT(e.First_name, " ", e.Last_name) = "${employeeFullName}"`,
            (err, dbRes) => {
                if (err) {
                    console.log("You cannot delete a manager who still has employees.\nPlease reassign the managers employees before deleting")
                    reject(err)
                }
                resolve("Employee Deleted!")
            })
    })
}

const getEmployeeNames = async () => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT CONCAT(e.First_name, " ", e.Last_name)
                AS name FROM employees e`, (err, table) => {
            if (err) reject(err);
            table.map(col => col.name)
            resolve(table)
        })
    })
}





const getEmployeeID = async (employeeName) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id FROM employees
                    WHERE CONCAT(First_name, " ", Last_name)
                    = "${employeeName}"`, (err, table) => {
            if (err) reject(err);
            table = table.map(col => col.id)
            resolve(table)
        })
    })
}

const updateEmployeeRole = async (newEmployeeRole) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE employees e
                SET role_id = ${newEmployeeRole.role_id}
                WHERE id = ${newEmployeeRole.id}`,
            (err, updateRes) => {
                if (err) reject(err);
                resolve("Role updated!")
            })
    })
}







const print = async (callback) => {
    let data = await callback("Manager");
    console.log(data)
}


print(getRoleID)


// const viewEmployeesByManager = async () => {
//     let choices = await employeeDB_CRUD.getManagers();
//     console.log(choices);
//     return new Promise((resolve, reject) => {
//         inquirer.prompt([{
//             name: "manager",
//             type: "list",
//             message: "Please select a department: ",
//             choices: choices
//         }]).then(({
//             manager
//         }) => {
//             console.log(manager);
//             resolve();

module.exports = {
    getRoles: getRoles,
    getRoleID: getRoleID,
    getManagers: getManagers,
    getManagerID: getManagerID,
    addEmployeeToDB: addEmployeeToDB,
    deleteEmployee: deleteEmployee,
    getEmployeeNames: getEmployeeNames,
    getEmployeeID: getEmployeeID,
    updateEmployeeRole: updateEmployeeRole,
}