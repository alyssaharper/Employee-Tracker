const { listenerCount } = require('events');
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password1',
    database: 'employee_db'
});

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
        type: 'input',
        message: `What is the employee's role?`,
        name: 'role',
        when: (answer) => answer.employeeManager === 'Add Employee'
    },
    {
        type: 'input',
        message: `Who is the employee's manager?`,
        name: 'managerName',
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
        type: 'input',
        message: `Please enter the department for the new role.`,
        name: 'department',
        when: (answer) => answer.employeeManager === 'Add Role'
    },
    {
        type: 'input',
        message: `Please enter the new department you want to add.`,
        name: 'newDept',
        when: (answer) => answer.employeeManager === 'Add Department'
    }
]).then((data) => {
    if (data.employeeManager === 'View All Employees') {
        db.query('SELECT * FROM employee', function (err, results) {
            console.table(results);
        });
    } else if (data.employeeManager === 'View All Departments') {
        db.query('SELECT * FROM department', function (err, results) {
            console.table(results);
        });  
    } else if (data.employeeManager === 'View All Roles') {
        db.query('SELECT * FROM role', function (err, results) {
            console.table(results);
        });  
    }
});