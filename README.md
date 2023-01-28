# Barber-shop

## Install

1. Run command on your cmd or terminal
```
composer install
```

2. Copy .env.example file to .env on the root folder. You can type copy .env.example to .env

3. Open your .env file and change the database name (DB_DATABASE) to whatever you have, username (DB_USERNAME) and password (DB_PASSWORD) field correspond to your configuration.

4. Run command
```
Run php artisan key:generate
```

5. Run command
```
php artisan migrate
```

6. Run command
```
php artisan serve
```

5. Go to http://localhost:8000/
