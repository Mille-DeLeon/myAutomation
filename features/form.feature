Feature: Practice site form

  Scenario: Fill in name, email and phone with random data
    Given I open the home page
    When I enter a random name
    And I enter a random email
    And I enter a random phone number
    And I enter a random address
    Then the form should show the entered values
