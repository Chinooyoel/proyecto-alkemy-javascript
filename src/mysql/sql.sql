CREATE DATABASE alkymer;

USE alkymer;

CREATE TABLE type_operation (
    id TINYINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(50)
);

CREATE TABLE operation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    concept VARCHAR(50),
    amount DECIMAL(10,2),
    date_operation DATE,
    type_operation_id TINYINT,
    FOREIGN KEY (type_operation) REFERENCES type_operation(id)
);

INSERT INTO type_operation( description ) VALUES ("Ingreso"), ("Egreso");