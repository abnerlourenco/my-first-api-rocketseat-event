-- Custom SQL migration file, put your code below! --
UPDATE "users" SET "password" = id where "password" is null;