#!/bin/bash
echo "starting db..."
echo 'Shell script location:' $0
RELATIVER_DIR=`dirname "$0"`
echo 'Dir:' $RELATIVER_DIR

cd $RELATIVER_DIR
SHELL_PATH=`pwd -P`
echo $SHELL_PATH

docker-compose down

docker-compose build

docker-compose up -d

# docker rm book_shop__postgres

# docker build -t book-shop--db/latest .
# docker run --name book_shop__postgres -it book-shop--db/latest -p 5432:5432 \
# -e POSTGRES_PASSWORD=1q2w3e4r \
# -e POSTGRES_DB=book-shop \
# -e POSTGRES_USER=table_admin \
# -d book_shop__postgres
# -e POSTGRES_PASSWORD=Hello!asdad \
# -e POSTGRES_INITDB_ARGS=--encoding=UTF-8 \