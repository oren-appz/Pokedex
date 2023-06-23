# Pokedex project for PrizePicks

## Business Requirements

Use the Pokemon API to make API requests for data https://pokeapi.co/docs/v2.

- Able to search for any Pokemon.
- Able to see a history of what has been searched and revisit at anytime. Technical Requirements

## Technical requirements

- This project should be done with the latest Redux framework.
- This project should be done using TypeScript.
- This project should be done using version control, preferably git.
- This project can be styled with SCSS/CSS or Styled Components if anything needs to be styled.
- This project should include a README that addresses anything you may not have completed.
- It should also address what additional changes you might need to make if the application were intended to run in a concurrent environment.
- Any other comments or thoughts about the project are also welcome.

## How to Run

### Clone the repository

```bash
git clone https://github.com/oren-appz/Pokedex.git
```

### Navigate to the directory

```bash
cd Pokedex
```

### Install dependencies

```bash
npm install
```

### Start the app

```bash
npm start
```

## Unit testing

The unit tests are written using Jest and React Testing Library. To run the tests, run the following command:

```bash
npm run test
```

### Test Coverage

```bash
npm run test:coverage
```

The coverage for the components is high which is the desired result.

## Notes

Mui was used as the ui library to create the presentation layer.

In order not to exceed the API limit, I used caching with local storage but added redundancy with memoize as I noticed some edge cases where there as an exceeding the amount allowed in local storage.

Given more time to write this code to be enterprise worthy I would add the following :

1. e2e testing
2. mobile responsiveness (responsive design or adaptive design))
3. used storybook to create the components
4. used atomic design as the design pattern
5. add anayltics to track user behaviour and improve the user experience with Sentry or Datadog to track errors.
