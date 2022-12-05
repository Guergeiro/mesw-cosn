drop table if exists users;

create table users (
    id uuid default gen_random_uuid(),
    email text not null,
    password text not null,
    primary key (id)
);

insert into users (email, password)
values ('breno@breno.com', 'pw'), ('diogo@diogo.com', 'pw'), ('to@to.com', 'pw');
