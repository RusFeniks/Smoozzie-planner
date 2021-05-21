CREATE TABLE IF NOT EXISTS tips (
    id int(11) NOT NULL auto_increment,
    user_id int(11) NOT NULL,   
    date date NOT NULL,
    time time NOT NULL,
    title varchar(255) NOT NULL,  
    message text NOT NULL,
    PRIMARY KEY (id)
);