1. docker exec -it mongo_container bash
   mongosh
   use admin
   db.auth('root','example')
   show dbs
