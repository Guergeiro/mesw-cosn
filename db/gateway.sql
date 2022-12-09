drop table if exists hosts;

create table hosts (
    id uuid default gen_random_uuid(),
    pathname text not null,
    hostname text not null,
    primary key (id)
);

insert into hosts (pathname, hostname)
values ('users', 'http://users:8787'),('auth', 'http://users:8787'), ('degrees', 'https://brenosalles.com'), ('courses', 'http://0.0.0.0');
