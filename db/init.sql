CREATE TABLE "PAN_INFO" (
    "pan"  char(10) PRIMARY KEY,
    "data" json 
);

CREATE TABLE USER_INFO (
    "user_id" text PRIMARY KEY,
    "name"  TEXT,
    "email"  TEXT,
    "phone"  TEXT
);

CREATE TABLE COMPANY_INFO (
    "id"  SERIAL PRIMARY KEY,
    "name" text,
    "type" text,
    "age" text,
    "size" INTEGER,
    "user_id" INTEGER,
    "pan"  char(10),
    "annual_revenue"  INTEGER,
    "annual_profit" INTEGER,
    "credit_score" INTEGER,
    "loan_amount" INTEGER,
    "loan_tenure" INTEGER, -- in months
    "late_payments" INTEGER
);

