const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password1',
    database: 'employee_db'
});

const employeeTracker = async () => {
    let allDepts;
    let allRoles;
    let allManagers;
    let allEmployees;
    let updateRoles;
    try {
        allDepts = await db.promise().query('SELECT * from department')
        allRoles = await db.promise().query('SELECT * from role')
        allManagers = await db.promise().query('SELECT * from employee')
        allEmployees = await db.promise().query('SELECT * from employee')
        updateRoles = await db.promise().query('SELECT * from role')
    } catch (error) {
        console.log(error)
    }
    
inquirer.prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'employeeManager',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    },
    {
        type: 'input',
        message: `What is the employee's first name?`,
        name: 'firstName',
        when: (answer) => answer.employeeManager === 'Add Employee'
    },
    {
        type: 'input',
        message: `What is the employee's last name?`,
        name: 'lastName',
        when: (answer) => answer.employeeManager === 'Add Employee'
    },
    {
        type: 'list',
        message: `What is the employee's role?`,
        name: 'role',
        choices: allRoles[0].map(role => ({name:role.title, value:role.id})),
        when: (answer) => answer.employeeManager === 'Add Employee'
    },
    {
        type: 'list',
        message: `Who is the employee's manager?`,
        name: 'managerName',
        choices: allManagers[0].map(manager => ({name:`${manager.first_name} ${manager.last_name}`, value:manager.id})),
        when: (answer) => answer.employeeManager === 'Add Employee'
    },
    {
        type: 'input',
        message: `Please enter the new role you want to add.`,
        name: 'newRole',
        when: (answer) => answer.employeeManager === 'Add Role'
    },
    {
        type: 'input',
        message: `Please enter the salary for the new role.`,
        name: 'salary',
        when: (answer) => answer.employeeManager === 'Add Role'
    },
    {
        type: 'list',
        message: `Please select the department for the new role.`,
        name: 'department',
        choices: allDepts[0].map(dept => ({name:dept.name, value:dept.id})),
        when: (answer) => answer.employeeManager === 'Add Role'
    },
    {
        type: 'input',
        message: `Please enter the new department you want to add.`,
        name: 'newDept',
        when: (answer) => answer.employeeManager === 'Add Department'
    },
    {
        type: 'list',
        message: `Which employee's role do you want to update?`,
        name: 'employeeRole',
        choices: allEmployees[0].map(employee => ({name:`${employee.first_name} ${employee.last_name}`, value:employee.id})),
        when: (answer) => answer.employeeManager === 'Update Employee Role'
    },
    {
        type: 'list',
        message: `What role do you want to assign the selected employee?`,
        name: 'updatedRole',
        choices: allRoles[0].map(role => ({name:role.title, value:role.id})),
        when: (answer) => answer.employeeManager === 'Update Employee Role'
    }
]).then((data) => {
    if (data.employeeManager === 'View All Employees') {
        db.query(`SELECT 
        employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
       FROM employee
       LEFT JOIN role ON role.id = employee.role_id
       LEFT JOIN department ON department.id = role.department_id
       LEFT JOIN employee manager ON employee.manager_id = manager.id
       WHERE employee.id <> 6;`, function (err, results) {
            console.table(results);
            return employeeTracker();
        });
    } else if (data.employeeManager === 'View All Departments') {
        db.query('SELECT * FROM department', function (err, results) {
            console.table(results);
            return employeeTracker();
        });  
    } else if (data.employeeManager === 'View All Roles') {
        db.query(`SELECT
        role.id AS id, role.title AS role, role.salary, department.name AS department
    FROM role
    LEFT JOIN department ON department.id = role.department_id;`, function (err, results) {
            console.table(results);
            return employeeTracker();
        });  
    } else if (data.newDept) {
        db.query(`INSERT INTO department SET ?`, [{
            name:data.newDept
        }], function (err,results) {
            console.log("Department added successfully!");
            return employeeTracker();
        });
    } else if (data.newRole && data.salary && data.department) {
        db.query(`INSERT INTO role SET ?`, [{
            title:data.newRole, salary:data.salary, department_id:data.department
        }], function (err, results) {
            console.log("Role added successfully!");
            return employeeTracker();
        });
    } else if (data.firstName && data.lastName && data.role && data.managerName) {
        db.query(`INSERT INTO employee SET ?`, [{
            first_name:data.firstName, last_name:data.lastName, role_id:data.role, manager_id:data.managerName
        }], function (err, results) {
            console.log("Employee added successfully!");
            return employeeTracker();
        });
    } else if (data.employeeRole && data.updatedRole) {
        db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [
            data.updatedRole, data.employeeRole
        ], function (err, results) {
            console.log(`Updated employee's role successfully!`);
            return employeeTracker();
        });
    }
});
};

employeeTracker();