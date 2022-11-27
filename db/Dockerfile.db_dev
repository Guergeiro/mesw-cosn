FROM postgres
ARG DB
COPY $DB.sql /docker-entrypoint-initdb.d/$DB.sql
