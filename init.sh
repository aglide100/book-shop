# /bin/bash/shell

# fish Shell에서는 안됨!!
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

export USERPWD

npm npm install --legacy-peer-deps

sh ./cmd/db/db_run.sh ${USERPWD}

cd ./ui

npm npm install --legacy-peer-deps

npm run make 

cd ../

npm run build
npm run start
