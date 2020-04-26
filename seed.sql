INSERT INTO department (id, name)
VALUES (1, 'Sales')

INSERT INTO department (id, name)
VALUES (2, 'Finance')

INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Sales Lead', 100000, 1)

INSERT INTO role (id, title, salary, department_id)
VALUES (2, 'Entry Sales', 50000, 1)

INSERT INTO role (id, title, salary, department_id)
VALUES (3, 'Accountant', 80000, 2)

INSERT INTO role (id, title, salary, department_id)
VALUES (4, 'Financial Analyst', 70000, 2)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Phil', 'Hurst', 4, 1)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ken', 'Hurst', 1, 1)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Schwyn', 'Francis', 3, 2)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kasey', 'Hurst', 2, 2)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joe', 'Schmoe', 2, 2)