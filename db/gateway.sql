drop table if exists hosts;

create table hosts (
    id uuid default gen_random_uuid(),
    pathname text not null,
    hostname text not null,
    protected boolean not null,
    primary key (id)
);

insert into hosts (pathname, hostname, protected)
values
('users', 'http://users:8787', true),
('auth', 'http://users:8787', false),
('degrees', 'http://degrees:8787', true),
('courses', 'http://courses:8787', true);
