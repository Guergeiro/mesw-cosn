drop table if exists degrees;

create table degrees (
    "id" uuid default gen_random_uuid(),
    "facultyId" uuid not null,
    "code" text not null,
    "name" text not null,
    "eqfLevel" text not null,
    "status" text not null,
    "description" text not null,
    "goals" text,
    "url" text,
    "abbr" text,
    primary key (id)
);

drop table if exists faculties;

create table faculties (
    "id" uuid default gen_random_uuid(),
    primary key (id)
);

insert into faculties (id)
values ('73e12576-04e0-465d-9ba8-1c3c8bcd9d54'), ('78420303-653c-417f-a397-b9fc7e441975');