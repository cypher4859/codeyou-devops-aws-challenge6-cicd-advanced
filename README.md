# CI/CD Pipelines in GitHub Actions: In-Class Challenge Activity

This activity is designed to introduce students to creating and managing CI/CD pipelines using GitHub Actions. The activity is split into two phases: a guided walkthrough and a timed challenge.

## Phase 1: Guided Walkthrough

### Objective
Set up a CI/CD pipeline for a sample TypeScript project using GitHub Actions.

### Prerequisites
1. A GitHub account.
2. Docker installed on your local machine.
3. Basic understanding of Git, Docker, and TypeScript.

### Steps

#### 1. Clone the Starter Repository
1. Clone the provided starter repository: `git clone https://github.com/example/repo.git`.
2. Navigate to the project directory: `cd repo`.

#### 2. Examine the TypeScript Project
The project includes:
- A basic TypeScript CLI application (see below).
- A `Dockerfile` to containerize the application.
- Unit tests using Jest.

Sample TypeScript Application:

```typescript
// src/index.ts
export const greet = (name: string): string => `Hello, ${name}!`;

if (require.main === module) {
  const name = process.argv[2] || "World";
  console.log(greet(name));
}
```

Add the following scripts to `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "lint": "eslint .",
    "test": "jest"
  }
}
```

#### 3. Set Up GitHub Actions Workflow

##### Jobs Overview
We will create the following jobs in our pipeline:

1. **Lint**: Ensure code quality by checking for linting errors.
2. **Security**: Scan for vulnerabilities in dependencies.
3. **Test**: Run unit tests to verify functionality.
4. **Build**: Build a Docker image for the application.
5. **Push**: Push the Docker image to DockerHub.

##### Writing the Workflow File Step-by-Step

1. **Create the Lint Job**
   - Navigate to `.github/workflows/`.
   - Create a file named `test.yml`.
   - Add the linting step:

```yaml
name: Test Pipeline

on:
  push:
    branches:
      - test

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm ci
      - name: Lint Code
        run: npm run lint
```

2. **Add the Security Job**
   - Add a job to check for vulnerabilities:

```yaml
  security:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm ci
      - name: Check for Vulnerabilities
        run: npm audit
```

3. **Add the Test Job**
   - Add a job to run unit tests:

```yaml
  test:
    runs-on: ubuntu-latest
    needs: security
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm ci
      - name: Run Tests
        run: npm test
```

4. **Add the Build Job**
   - Add a job to build the Docker image:

```yaml
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Image
        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/typescript-app:test .
```

5. **Add the Push Job**
   - Add a job to push the Docker image to DockerHub:

```yaml
  push:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - name: Login to DockerHub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
      - name: Push Docker Image
        run: docker push ${{ secrets.DOCKER_USERNAME }}/typescript-app:test
```

6. **Create the `main` Workflow File**
   - Duplicate the steps above, but modify the `on:` section to trigger on `main` branch pushes
   - Additionally, make sure that the tag of our image is `latest` for the `main` branch workflow.

```yaml
on:
  push:
    branches:
      - main
```

#### 4. Add Secrets and Environment Variables
1. Go to your repository’s **Settings > Secrets and variables > Actions**.
2. Add:
   - `DOCKER_USERNAME`: Your DockerHub username.
   - `DOCKER_PASSWORD`: Your DockerHub password.

#### 5. Test the Pipeline
1. Create and push changes to the `test` branch.
2. Verify the pipeline executes successfully.
3. Merge to the `main` branch and confirm the main workflow runs.

---

## Phase 2: Timed Challenge

### Objective
Recreate a CI/CD pipeline for a similar TypeScript project independently.

### Instructions
1. Clone the new starter repository provided for the challenge.
2. Perform the following tasks:
   - Write a `test.yml` workflow to:
     1. Lint code.
     2. Check for security vulnerabilities.
     3. Run unit tests.
     4. Build a Docker image.
     5. Push the Docker image to DockerHub.
   - Write a `main.yml` workflow to trigger on the `main` branch.
   - Set up GitHub secrets for DockerHub credentials.
   - Ensure the pipeline uses environment variables where applicable.
   - Confirm the Docker image builds and pushes successfully.
3. Complete all tasks within the allotted time.

### Evaluation Criteria
1. Functional pipelines for both `test` and `main` branches.
2. Proper use of secrets and environment variables.
3. Successful linting, testing, building, and pushing to DockerHub.
4. Efficient and clean workflow files.

---

## Resources
1. [GitHub Actions Documentation](https://docs.github.com/en/actions)
2. [Docker Documentation](https://docs.docker.com/)
3. [TypeScript Documentation](https://www.typescriptlang.org/docs/)
4. [Jest Documentation](https://jestjs.io/docs/getting-started)

---

This activity introduces students to the fundamentals of CI/CD pipelines, security best practices, and containerization, ensuring they gain hands-on experience in real-world development workflows.

