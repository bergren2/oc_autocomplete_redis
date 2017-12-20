Summary
=====================

Implementing autocomplete with Redis, NodeJS and jQuery:

http://www.codeproject.com/Articles/853819/AutoComplete-with-Redis-NodeJS-and-jQuery

## Dan's Notes

Install things:

    $ brew install redis

Run Redis:

    $ redis-server /usr/local/etc/redis.conf

Populate Redis database:

    $ ruby build_data_redis.rb data/icd9.txt icd9
    $ ruby build_data_redis.rb data/icd9p.txt icd9p

Run Node server (w/ Redis still running locally):

    $ node node_app.js

Go to http://127.0.0.1:1337/index.html and type in some characters for
autocomplete!
