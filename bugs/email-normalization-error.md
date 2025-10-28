# Email normalization causing unexpected login behavior

When testing the login endpoint, users expect to log in with the exact email format they used during signup. However, the email normalization was happening inconsistently, causing confusion when `denisek.xo@gmail.com` was normalized to `denisekxo@gmail.com` during validation but the database lookup might not match.

- Status: `something`
- Severity: `p1`
- tags:

## Repro Steps

1. Send the following request and include/exclude any special characters from the email address and observe successful login
   (e.g., `denisek.xo@gmail.com` and `denisekxo@gmail.com` both logged in successfully)

   endpoint: `/api/auth/login`
   body:

   ```json
   {
     "email": "denisek.xo@gmail.com",
     "password": "Password123!"
   }
   ```

## Expected Result

Using special characters should throw an `"error": :Invalid email or password"`

## Changes or Updates

Status: FIXED - Implemented consistent email normalization (case sensitive):

- Removed express-validator's normalizeEmail()
- Added custom normalizeEmail() function
- Both signup and login now normalize emails consistently
- Email normalization is now CASE SENSITIVE
- Database stores normalized version for consistency

The fix ensures that:

1. Gmail addresses are normalized consistently (dots removed, case preserved)
2. Users can sign up with `denisek.xo@gmail.com`
3. Users can log in with either `denisek.xo@gmail.com` OR `denisekxo@gmail.com`
4. Users CANNOT log in with `DENISEK.XO@GMAIL.COM` (case sensitive)
5. Database stores the normalized version `denisekxo@gmail.com` (preserving original case)
