drop table if exists hosts;

create table hosts (
    id uuid default gen_random_uuid(),
    pathname text not null,
    hostname text not null,
    primary key (id)
);

insert into hosts (pathname, hostname)
values ('users', 'http://0.0.0.0'), ('degrees', 'http://0.0.0.0'), ('courses', 'http://0.0.0.0');
