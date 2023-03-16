# INFO-6225-Cloud-Assignments

### Aarti Gupta - 002193082

# Objective
Create a web application using a technology stack that meets Cloud-Native Web Application Requirements. Start implementing APIs for the web application. Features of the web application will be split among various applications. For this assignment, we will focus on the backend API (no UI) service. Additional features of the web application will be implemented in future assignments. We will also build the infrastructure on the cloud to host the application. This assignment will focus on the user management aspect of the application.

# Build and Deploy Application: Prerequisites

## Build
1. Clone the fork repository `git clone git@github.com:rtGupta/webapp.git` on your local machine

2. Configure `.env` file as follows - 
   ```
    HOST=your_host
    USER=your_DB_username
    PASSWORD=your_DB_password
    DB=your_DB
    DIALECT=postgres
    PORT=5432
   ```

3. Install Dependencies using `npm install` command

4. Run `db-migrate` commands to setup your database tables and schemas using following command - `npx sequelize-cli db:migrate`

5. Run the app using command `npm start`.

## Test

6. Run unit-tests by running the command `npm test`.

## Deploy

7. Github Actions workflow is triggered when a PR is raised from the fork repo to the org repo.
8. To run the workflow manually, click on `Actions` tab under your fork repo name.
9. In the left sidebar menu, select the `workflow` you want to run.
10. From the list of workflow runs, select the name of the `run` you want to run.
11. Under `Jobs` , click the `Explore-GitHub-Actions` job.