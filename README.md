# GoComplaint: Backend

Welcome to the `GoComplaint's Backend Repository`. This repo is where our Backend development get stored and accessed. Our **Backend API** is made using `node.js` and `express.js` as the framework, while the **Machine Learning API** is made using `python` with `fastapi`framework. We use **GCP APP ENGINE** as the deployment solution, **GCP Cloud Storage** as the file stroage solution, and **Cloud SQL** as our MySql Relational Database.

## Authors Team ID: `CH2-PS153`

| Name        | Bangkit ID            | Roles | Colleges |
| :--------------- | :-------------- |:------| :------|
| Latifah Nurrohmah          | `M120BSX1179`           | ML | Institut Teknologi Telkom Purwokerto |
| Kelvin Fauzian Setiawan          | `M120BSY0288`           | ML | Institut Teknologi Telkom Purwokerto |
| I Kadek Krisna Apriana Dwi Guna          | `M014BSY1484`            | ML | Udayana University |
| Made Asthito Yogi Prasanna          | `C014BSY4090`            | CC | Udayana University |
| Kadek Cahyadi Yogachandra          | `C014BSY4091`           | CC | Udayana University |
| Ahmad Tri Fhatoni          | `A120BSY2579`           | MD | Institut Teknologi Telkom Purwokerto |
| Mohamad Arrizal          | `A314BSY2524`           | MD | Singaperbangsa Karawang University |

# Cloud Infrastructure!
![cc-arsitektur](https://github.com/GoComplaint/Backend-CC/assets/99982084/00f0ef61-69c4-4b1c-8815-710a3d33b05d)

## Deployment
How to deploy our Backend-CC, PredictAPI-ML, WebApp-CC :
1. Access the GCP
2. Open cloud shell
3. Clone the repo using `git clone url.git` command
4. Go to Backend-CC folder, and create a file for [.env](#.env) and upload you service account key.json that include access to **CLOUD SQL** admin
5. Deploy the app using `gcloud app deploy`
6. Go to PredictAPI-ML folder
7. Deploy the app using `gcloud app deploy`
8. Go to WebApp-CC folder
9. Deploy the app using `gcloud app deploy`
10. Done !

## .env
Requirement : 
- A mysql database on **GCP Cloud SQL**
This file will include : 
```
LOG_LEVEL=debug
PORT=5000 
DB_HOST=db_host
DB_NAME=db_name
DB_USER=db_user
DB_PASS=db_pass
DB_PORT=3306
PROJECT_ID=project_id
REFRESH_TOKEN_SECRET=random_string, ex : asdaskjdnadfhasdi9ofgjaewr8fi9j
ACCESS_TOKEN_SECRET=random_string, ex : klcmnvsoeirfgjoiawdjmfosdfmndapsdfo
```

# API Reference

## Endpoint Routes
| Route                                                    | HTTP Method | Description                                   |   API   | Header Token |
|----------------------------------------------------------|-------------|-----------------------------------------------|---------|--------------|
| **/auth/register** | POST | User Registration | Auth | X |
| **/auth/login** | POST | User Login | Auth | X |
| **/auth/refreshToken** | POST | Get new refresh Token | Auth | X |
| **/auth/accessToken** | POST | Get new access Token | Auth | X |
| **/auth/logout** | POST | Logout one device | Auth | X | 
| **/auth/logoutAll** | POST | Logout all device | Auth | X |
| **/main/complaints** | GET | Get all complaints | Main | X |
| **/main/complaints/:complaint_id** | GET | Get one specific complaint | Main | X |
| **/main/search?complaint='xx'** | GET | Search through complaints | Main | X |
| **/main/history/complaints/:user_id** | GET | Get history of the user's complaints | Main | Y |
| **/main/analysis?year=2xxx** | GET | Get analysis of the complaint on specific year | Main | X |
| **/main/complaints** | POST | Post a complaint | Main | Y |
| **/main/comments** | POST | Post a comment on a complaint | Main | Y |
| **/main/complaints/:complaint_id** | DELETE | Delete a complaint | Main | Y |
| **/main/comments/:comment_id** | DELETE | Delete a comment on a complaint | Main | Y |
| **/predict** | POST | Predict the urgency of the complaint | PredictAPI | X |


### Backend API (Auth, Main)
The Backend API that will be used to host Auth and Main API, either to do Authentication or access and creating complaints / comments.
- Framework : `node.js`, `express.js`
- Deployed Endpoint : `https://backend-dot-go-complaint.et.r.appspot.com`
- Full Documentation : `https://documenter.getpostman.com/view/29386956/2s9YkraeYg`
- Tools and Packages :
  - **@google-cloud/storage:** Version 7.7.0
  - **axios:** Version 1.6.2
  - **bcrypt:** Version 5.1.1
  - **body-parser:** Version 1.20.2
  - **cors:** Version 2.8.5
  - **dotenv:** Version 16.3.1
  - **express:** Version 4.18.2
  - **jsonwebtoken:** Version 9.0.2
  - **multer:** Version 1.4.5-lts.1
  - **mysql2:** Version 3.6.5
  - **pino:** Version 8.16.2
  - **pino-pretty:** Version 10.2.3
  - **sequelize:** Version 6.35.1

### Machine Learning API (PredictApi)
The Backend API that will be used to host PredictAPI to predict the urgency of a complaint.
- Framework : `python`, `fastapi`
- Deployed Endpoint : `https://ml-dot-go-complaint.et.r.appspot.com`
- Full Documentation : `https://documenter.getpostman.com/view/29386956/2s9YkraeYg`
- Requirements :
  - **fastapi:** Version 0.105.0
  - **uvicorn:** Version 0.24.0.post1
  - **gunicorn:** Version 21.2.0
  - **keras:** Version 2.15.0
  - **numpy:** Version 1.26.2
  - **pandas:** Version 2.1.4
  - **pydantic:** Version 2.5.2
  - **scikit_learn:** Version 1.3.2
  - **tensorflow:** Version 2.15.0
