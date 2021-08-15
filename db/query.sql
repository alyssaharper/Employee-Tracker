SELECT 
 employee.first_name, employee.last_name, role.title AS role, department.name AS Department, role.salary
FROM department
LEFT JOIN role ON role.department_id = department.id
LEFT JOIN employee ON employee.role_id = role.id;