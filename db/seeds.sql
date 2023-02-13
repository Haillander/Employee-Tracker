INSERT INTO departments (department_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Markenting"),
       ("Legal");

INSERT INTO roles (job_title, department_id, salary)
VALUES ("Marketing Manager", 4, 58000),
       ("Acount Manager", 2, 73560),
       ("Software Engineer", 1, 25890),
       ("Lawyer", 3, 1005820),
       ("back End Developer", 1, 95802);

INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id)
VALUES ("Jhon", "Doe", 1, 4, NULL),
       ("Mike", "chan", 2, 2, 1),
       ("Sarah", "Rebecca", 3, 1, 1),
       ("Kevin", "Milgarde", 4, 3, 1);
