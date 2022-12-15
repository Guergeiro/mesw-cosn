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

insert into hosts (pathname, hostname, protected)
values

('lecture', 'http://ec2-34-233-124-51.compute-1.amazonaws.com:5000', true),
('professor', 'http://ec2-34-233-124-51.compute-1.amazonaws.com:5000', true),
('assignment', 'http://ec2-34-233-124-51.compute-1.amazonaws.com:5000', true),
('course', 'http://ec2-34-233-124-51.compute-1.amazonaws.com:5000', true);

insert into hosts (pathname, hostname, protected)
values
('faculty', 'https://orlandopt.pythonanywhere.com', true),
('tuition-fee', 'https://hugofpaiva.pythonanywhere.com', true),
('classrooms', 'https://orlandop.pythonanywhere.com', true);
