SELECT 
 employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
FROM employee
LEFT JOIN role ON role.id = employee.id
LEFT JOIN department ON department.id = role.department_id
LEFT JOIN employee manager ON employee.manager_id = manager.id;

SELECT
    role.title AS role, role.salary, department.name AS department
FROM role
LEFT JOIN department ON department.id = role.department_id;
