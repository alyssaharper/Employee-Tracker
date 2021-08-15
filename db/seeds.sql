INSERT INTO department (name)
VALUES ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 4),
       ('Account Manager', 160000, 2),
       ('Lead Engineer', 150000, 1),
       ('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('John', 'Doe', 1),
       ('Ashley', 'Rodriquez', 3),
       ('Kunal', 'Singh', 2),
       ('Tom', 'Allen', 4);
