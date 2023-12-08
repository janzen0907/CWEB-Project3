# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

Console script to run to create tables and insert info if you need it
reate table Car(
id  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
make varchar(50) not null,
model varchar(50) not null,
year int not null,
km int not null,
price int not null,
transmission varchar(3) not null,
drivetrain varchar(50) not null,
numUpVotes int DEFAULT 0,
numDownVotes int DEFAULT 0,
traderEmail varchar(300),
traderName varchar(50),
FOREIGN KEY (traderEmail) REFERENCES Trader(email),
FOREIGN KEY (traderName) REFERENCES Trader(name)

);

INSERT INTO Car values (1, 'Subaru', 'WRX STI', 2015, 105000, '$30000', 'Manual', 'AWD', 0, 0,'janzen3j@gmail.com', 'John Janzen' );

INSERT INTO Car values (2, 'Aston', 'Vantage', 2023, 8, '$200,000', 'Auto', 'RWD', 0, 0,'janzen3j@gmail.com', 'John Janzen' );

--Create the trader Table first
create table Trader(
id integer PRIMARY KEY autoincrement not null,
email varchar(200) not null UNIQUE ,
name varchar(300) UNIQUE ,
rating int,
ratingCount int
);

INSERT INTO Trader(id, email, name) VALUES (1, 'janzen3j@gmail.com', 'John Janzen');

-- THIS TABLE COMPLETELY BREAKS OUR DELETE TRADER FUNCTIONALITY
CREATE TABLE CarLookup(
carID INTEGER not null,
carMake VARCHAR(30) not null,
carModel VARCHAR(30) not null,
carYear int not null,
FOREIGN KEY (carID) REFERENCES Car (id),
FOREIGN KEY (carMake) REFERENCES Car (make),
FOREIGN KEY (carModel) REFERENCES Car (model),
FOREIGN KEY (carYear) REFERENCES Car (year)
);

ALTER TABLE CarLookup
ADD COLUMN carDescription VARCHAR(100);

UPDATE CarLookup SET carDescription = CAST(carYear AS Text) || ' ' || carMake || ' ' || carModel;

INSERT INTO CarLookup (carID, carMake, carModel, carYear)
SELECT id, make, model, year FROM Car;


Drop Table car;
Drop Table Trader;
Drop TABLE CarLookup;
