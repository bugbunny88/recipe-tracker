Feature: New user signup

@unit
Scenario Outline: Email addresses are normalized
    Given a user enters <email>
    When normalized
    Then their email is saved as <normalized>

    Examples:
    | email              | normalized            |
    | denisek.xo@gmail.com | denisek.xo@gmail.com |
    | Denisek.xo@gmail.com | denisek.xo@gmail.com |
    | DeniseK.xo+1@gmail.com | denisek.xo+1@gmail.com |

@not-covered @api @ui
Scenario: User cannot sign up with an email address that already exists
    Given a user enters an existing email address
    When they click "Signup"
    Then they see an error message "User with this email already exists"
