FROM mysql:5.7.21

ENV MYSQL_ROOT_PASSWORD matcha
ENV MYSQL_DATABASE matcha
ENV MYSQL_USER matcha
ENV MYSQL_PASSWORD matcha

ADD dump.sql /docker-entrypoint-initdb.d
