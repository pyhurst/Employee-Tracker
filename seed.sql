INSERT INTO department (name)
VALUES ('Sales');

INSERT INTO department (name)
VALUES ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ('Entry Sales', 50000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ('Accountant', 80000, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ('Financial Analyst', 70000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Phil', 'Hurst', 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Ken', 'Hurst', 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Schwyn', 'Francis', 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Kasey', 'Hurst', 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Joe', 'Schmoe', 2);