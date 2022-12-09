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