# Le Café Backend

Le Café Backend is the server-side component of the Le Café coffee shop ordering platform. It provides the necessary APIs and services to support both dine-in and delivery services, including user authentication, order management, and integration with various third-party services.

## 📋 Table of Contents
- [🚀 Features](#-features)
- [📚 API Documentation](#-api-documentation)
- [🧪 Unit Testing](#-unit-testing)
- [🔐 Environment Variables](#-environment-variables)
- [⚙️ Installation](#️-installation)
- [🔗 Frontend Repository](#-frontend-repository)

## 🚀 Features

- **🔐 Authentication**: Secure user registration and login system with JWT.
- **📦 Order Management**: Handle creation and processing of customer orders.
- **🗺️ Geolocation Services**: Integration with geocoding and routing services for delivery.
- **💳 Payment Integration**: Seamless integration with Midtrans payment gateway.
- **📧 Email Notifications**: Automated email services for user verification and notifications.
- **☁️ Cloud Storage**: Image upload and storage using Cloudinary.
- **🔥 Firebase Integration**: Utilize Firebase services for enhanced functionality.
- **📊 Database Management**: Supports both development (local MySQL) and production (TiDB Cloud) environments.

## 📚 API Documentation
Explore our comprehensive API documentation:
![api documentation](https://github.com/user-attachments/assets/26aee2a5-b1b8-4c54-9ed0-8dddb25e7f57)

🔗 [Le Café API Documentation](https://lecafe-be.onrender.com/api-docs/)

This interactive documentation provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## 🧪 Unit Testing
![unit testing](https://github.com/user-attachments/assets/b5af09cb-1a15-467d-9097-f3e03d178411)



## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

```env
PORT=your_port
BASE_URL=your_base_url
JWT_EXPIRES_IN=your_jwt_expires_in
JWT_SECRET=your_jwt_secret
MAIL_SERVICE=your_mail_service
MAIL_USERNAME=your_mail_username
MAIL_APP_PASSWORD=your_mail_app_password
BASE_URL_FRONTEND=your_base_url_frontend

NODE_ENV=your_node_env
DB_USERNAME_DEVELOPMENT=your_db_username_development
DB_PASSWORD_DEVELOPMENT=your_db_password_development
DB_NAME_DEVELOPMENT=your_db_name_development
DB_HOST_DEVELOPMENT=your_db_host_development
DB_PORT_DEVELOPMENT=your_db_port_development
DB_DIALECT_DEVELOPMENT=your_db_dialect_development

DB_USERNAME_PRODUCTION=your_db_username_production
DB_PASSWORD_PRODUCTION=your_db_password_production
DB_NAME_PRODUCTION=your_db_name_production
DB_HOST_PRODUCTION=your_db_host_production
DB_PORT_PRODUCTION=your_db_port_production
DB_DIALECT_PRODUCTION=your_db_dialect_production

FIREBASE_TYPE=your_firebase_type
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_AUTH_URI=your_firebase_auth_uri
FIREBASE_TOKEN_URI=your_firebase_token_uri
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=your_firebase_auth_provider_x509_cert_url
FIREBASE_CLIENT_X509_CERT_URL=your_firebase_client_x509_cert_url
FIREBASE_UNIVERSE_DOMAIN=your_firebase_universe_domain

GEOCODE_URL=your_geocode_url
ROUTER_OSRM_URL=your_router_osrm_url
STORE_LONGITUDE=your_store_longitude
STORE_LATITUDE=your_store_latitude

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

POSTMAN_API_URL=your_postman_api_url
POSTMAN_ACCESS_KEY=your_postman_access_key

SERVER_KEY_MIDTRANS=your_server_key_midtrans
SNAP_URL_MIDTRANS=your_snap_url_midtrans
BASE_URL_MIDTRANS=your_base_url_midtrans
```

## ⚙️ Installation

1. Clone the repository:


```shellscript
git clone https://github.com/your-username/lecafe-be.git
cd lecafe-be
```

2. Install dependencies:


```shellscript
npm install
```

3. Set up your environment variables as described in the section above.
4. Run database migrations:


```shellscript
npm run migrate:up
npm run seed:up
```

5. Start the development server:


```shellscript
npm run dev
```

The server should now be running on `http://localhost:3000`.

## 💻 Frontend Repository

For the complete Le Café experience, check out our frontend repository:

🔗 [Le Café Frontend](https://github.com/Fiorezarn/lecafe-fe)
