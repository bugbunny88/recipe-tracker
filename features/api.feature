Feature: Recipe Tracker API

Background:

```json
{
  "email": "denisekxo@gmail.com",
  "password": "Password123!"
}
```

Endpoint: Auth: Signup
- [x] success
- [x] invalid email
- [x] user already exists

Scenario: Success
    Given a user enters the background data
    When they click "Signup"
    Then they see a 201 status code and a success message "User created successfully"

Endpoint: Auth: Login
- [x] success
- [x] invalid email
- [x] invalid password
- [x] user not found
- [x] empty password

Endpoint: Auth: Me
- [x] success
- [x] unauthorized

Endpoint: Auth: Logout
- [x] success
- [x] forbidden