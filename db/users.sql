drop table if exists users;

create table users (
    id uuid default gen_random_uuid(),
    email text not null,
    password text not null,
    role text not null,
    name text not null,
    deleted boolean not null default false,
    primary key (id)
);

insert into users (email, password, role, name)
values ('breno@breno.com', 'pw', 'admin', 'breno'), ('diogo@diogo.com', 'pw', 'faculty', 'diogo'), ('to@to.com', 'pw', 'student', 'to');
