import express from 'express';
import cors from 'cors';
const cookieParser = require('cookie-parser');
import {userRouter} from './router/user';
import {seatRouter} from './router/seat';


const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/seat", seatRouter);




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});