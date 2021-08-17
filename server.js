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
    try {
        allDepts = await db.promise().query('SELECT * from department')
        allRoles = await db.promise().query('SELECT * from role')
        allManagers = await db.promise().query('SELECT * from employee')
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
    }
]).then((data) => {
    if (data.employeeManager === 'View All Employees') {
        db.query(`SELECT 
        employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
       FROM employee
       LEFT JOIN role ON role.id = employee.id
       LEFT JOIN department ON department.id = role.department_id
       LEFT JOIN employee manager ON employee.manager_id = manager.id;`, function (err, results) {
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
        role.title AS role, role.salary, department.name AS department
    FROM role
    LEFT JOIN department ON department.id = role.department_id;`, function (err, results) {
            console.table(results);
            return employeeTracker();
        });  
    } else if (data.newDept) {
        db.query(`INSERT INTO department SET ?`, [{
            name:data.newDept
        }], function (err,results) {
            console.log(results + " department added successfully!");
            return employeeTracker();
        });
    } else if (data.newRole && data.salary && data.department) {
        db.query(`INSERT INTO role SET ?`, [{
            title:data.newRole, salary:data.salary, department_id:data.department
        }], function (err, results) {
            console.log(results + " department added successfully!");
            return employeeTracker();
        });
    } else if (data.firstName && data.lastName && data.role && data.managerName) {
        db.query(`INSERT INTO employee SET ?`, [{
            first_name:data.firstName, last_name:data.lastName, role_id:data.role, manager_id:data.managerName
        }], function (err, results) {
            console.log(results + " department added successfully!");
            return employeeTracker();
        });
    }
});
};
employeeTracker();