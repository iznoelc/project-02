# Universal Careers
Universal Careers creates a full stack job portal application. There are three kinds of users: job seekers, recruiters, and admins. Job seekers can register through email or Google sign-up; recruiters must register by email because there is additional form data; admins must be assigned manually in the database. Job seekers can search for jobs, favorite jobs, and apply to jobs. On the job seeker dashboard, they can see all the jobs they've applied to. Recruiters can post jobs, but they must first wait for their account to be approved by an admin. Admins can see all the users on the site, delete users, and approve recruiters. They can also view the job search page in order to delete postings if needed. All three types of users have profiles where they can see account information. Recruiters can see their additional account information (like their organization name or website) and job seekers can see the jobs they have favorited. 

## LIVE LINK: https://universal-careers.netlify.app/

## VIDEO WALK THROUGH

## TEAM
Izzy Carlson (Project Manager), Landon Chapin, Esperanza Paulino

## TEAM CONTRIBUTIONS
**Izzy Carlson (Project Manager)**
- Home Page, Navbar, Footer
- Job seeker dashboard
- Consistent design (UI) and debugging
- User authentication with firebase and user creation and editing through APIs
- Authentication related pages
- Database setup
  
**Esperanza Paulino**
- Admin Dashboard - Delete users, approve recruiters
- Job Details Page
- Job Application Page/Creation
  
**Landon Chapin**
- Job Search - Delete jobs
- Recruiter Dashboard - Create jobs
- UML (Component interaction diagram)

## PROOF OF COLLABORATION:
- Discord
  <img width="956" height="504" alt="image" src="https://github.com/user-attachments/assets/7938c2f0-febb-42e0-b313-e7c7bde859c6" />

- Met once for the first two weeks and twice in the final week.

## STATE DIAGRAM:
<img width="1305" height="839" alt="Screenshot 2026-04-23 224137" src="https://github.com/user-attachments/assets/f8b57da2-43d8-404c-bbda-a4e3b2e32d5c" />

## UML (COMPONENT INTERACTION DIAGRAM):
[UML diagram.pdf](https://github.com/user-attachments/files/27031388/UML.diagram.pdf)


## STACK
### FRONTEND
- React 19 - Web Framework
- Tailwind CSS and Daisy UI - Styling
- Firebase - Authentication
- Additional packages
  - React Router
  - React Router Dom
  - React Icons
  - React Toastify
 
### BACKEND
- Node.js - Server Environment
- Express - Backend Framework
- Additional packages
  - Joi - Validation
  - FIrebase Admin - Authentication
  - Mongoose - Enforcing Schema
  - Dotenv
  - Cors

### DATABASE
- MongoDB Atlas

## DEPLOYED
- Using Railway for server
- Using Netlify for client

## Assets
- [Home page image](https://unsplash.com/photos/business-professionals-collaborating-around-a-conference-table-ob1oe1CGQ1s)
- [SVG icon](https://www.flaticon.com/free-icons/planet)
