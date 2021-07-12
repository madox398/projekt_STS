-- auto-generated definition
create table keymap
(
    id                int auto_increment
        primary key,
    name              varchar(45) not null,
    key_code          varchar(15) not null,
    time_pressed      int         not null,
    time_to_next_char int         not null
);

