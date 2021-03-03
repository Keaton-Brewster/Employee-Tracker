class Employee {
    constructor(First_name, Last_name, role_id, manager_id) {
        this.First_name = First_name;
        this.Last_name = Last_name;
        this.role_id = role_id;
        this.Manager = manager_id
    };
}

module.exports = Employee;