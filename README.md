# Seat Booking System

This is a seat booking system that allows users to book and reset their seat reservations. The system includes a backend API built using Node.js, Express, and MongoDB. The frontend allows users to book seats, view seat availability, and reset bookings.

### Features:
- **User Authentication**: Users can log in using their email and password.
- **Seat Booking**: Users can book seats by selecting available ones.
- **Seat Reset**: Admins can reset all seat bookings.


---

### Installation

#### Prerequisites:
- Node.js (v16+)
- Postgres SQL with prisma orm (or any database of your choice)
- Postman or any API client for testing

#### Steps to Set Up the Project:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/seat-booking.git
    cd seat-booking
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```
    Database_URI=your-mongo-db-uri
    JWT_SECRET=your-secret-key
    PORT=3000
    ```

4. Run the application:
    ```bash
    npm start
    ```

---

### Backend API Documentation

#### 1. **User Authentication**

##### POST `/api/v1/user/signin`
- **Description**: Logs the user in and returns a JWT token.
- **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
- **Response**:
    - **200 OK**:
        ```json
        {
            "token": "your-jwt-token"
        }
        ```
    - **400 Bad Request**: Invalid credentials
    - **500 Internal Server Error**: Server-side error

---

#### 2. **Seat Booking**

##### POST `/api/seats/book`
- **Description**: Books the requested seats if they are available.
- **Headers**:
    - `Authorization: Bearer <token>`
- **Request Body**:
    ```json
    {
        "seatIds": [1, 2, 3] 
    }
    ```
- **Response**:
    - **200 OK**:
        ```json
        {
            "message": "Seats booked successfully"
        }
        ```
    - **409 Conflict**: Some or all requested seats are already booked
    - **500 Internal Server Error**: Server-side error

---

##### POST `/api/seats/reset`
- **Description**: Resets all seat bookings (Admin-only).
- **Headers**:
    - `Authorization: Bearer <token>`
- **Response**:
    - **200 OK**:
        ```json
        {
            "message": "All bookings have been reset"
        }
        ```
    - **403 Forbidden**: Unauthorized request (Admin required)
    - **500 Internal Server Error**: Server-side error

---




### Frontend

The frontend allows users to view available seats, select them, and book them. It uses React and Tailwind CSS for styling.

---

---



### Error Handling

- **400 Bad Request**: Returned when the request body is invalid or required parameters are missing.
- **401 Unauthorized**: Returned when authentication is required but not provided or invalid.
- **403 Forbidden**: Returned when the user is not authorized to access a resource (e.g., admin actions).
- **409 Conflict**: Returned when a requested resource is already booked or locked by another user.
- **500 Internal Server Error**: General server error.

---

### Testing with Postman

1. **Login**: Make a `POST` request to `/api/v1/user/signin` with valid credentials to receive a JWT token.

2. **Booking Seats**: Use the token received from login to make a `POST` request to `/api/seats/book` with an array of seat IDs.

3. **Reset Booking**: Admin can reset seat bookings by making a `POST` request to `/api/seats/reset` with the token.

---

### Notes

- The seat booking system only allows a user to book seats that are available.
- The lock mechanism ensures that there are no conflicts when multiple users attempt to book the same seat.
- The server handles errors gracefully and provides informative responses.

---
### Developed by Hunain Siddiqui

### License

MIT License. See `LICENSE` for more details.
