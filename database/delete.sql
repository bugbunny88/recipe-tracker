-- see all users
SELECT * FROM users;

-- see which test users to delete
SELECT * FROM users WHERE email ILIKE '%test%';

-- delete test users
DELETE FROM users WHERE email ILIKE '%test%';
