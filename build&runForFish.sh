# /bin/bash/shell

# fish Shell에서는 안됨!!
# if [ -f .env ]
# then
#   export $(cat .env | sed 's/#.*//g' | xargs)
# fi

# export USERPWD
# echo $USERPWD

sh ./cmd/db/db_run.sh 

cd ./ui

npm run make 

cd ../

npm run build
npm run start
