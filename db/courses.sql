drop table if exists courses;

create table courses (
    "id" uuid default gen_random_uuid(),
    "degreeId" uuid not null,
    "code" text not null,
    "name" text not null,
    "description" text not null,
    "status" text not null,
    "abbr" text not null,
    "ects" smallint not null,
    "scientificArea" text not null,
    primary key (id)
);

drop table if exists degrees;

create table degrees (
    id uuid default gen_random_uuid(),
    primary key (id)
);

insert into degrees (id)
values ('ef304524-4024-4407-bc30-84face053203'), ('51d71434-d3a2-4b2d-804d-ff1d190bc4af');