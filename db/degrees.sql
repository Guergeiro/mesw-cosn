drop table if exists degrees;

create table degrees (
    "id" uuid default gen_random_uuid(),
    "facultyId" integer not null,
    "code" text not null,
    "name" text not null,
    "eqfLevel" text not null,
    "status" text not null,
    "description" text not null,
    "tuition" numeric(15,4) not null,
    "goals" text,
    "url" text,
    "abbr" text,
    primary key (id)
);

drop table if exists faculties;

create table faculties (
    "id" integer not null,
    primary key (id)
);

insert into faculties (id)
values (1), (2);