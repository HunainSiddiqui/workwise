import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from "../middleware"; 
import e from 'express';

const app = express();
const router = express.Router();
const prisma = new PrismaClient();

app.use(express.json());
interface AuthenticatedRequest extends Request {
    user?: { id: number; email: string }; // Should match the payload structure in your JWT
}

  

// Book Seats
router.post('/book', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { numOfSeats } = req.body;
    const userId = req.user?.id;

    if(!userId){
        return res.status(400).json({ message: 'User not found' });
    }

    try{
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }

    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  
    if (numOfSeats > 7) {
      return res.status(400).json({ message: 'Cannot book more than 7 seats' });
    }
  
    try {
      // Fetch available seats
      const seats = await prisma.seat.findMany({
        where: { isavailable: true },
        orderBy: [{ row: 'asc' }, { seat_number: 'asc' }],
      });
  
      // If insufficient seats
      if (seats.length < numOfSeats) {
        return res.status(500).json({ message: `Booking failed, only ${seats.length} seats available.` });
      }
  
      const rows = 12;
  
      // In this we just iterating through the rows and checking if we have enough seats in one row(i.e we can find all seat in single row)
      for (let r = 1; r <= rows; r++) {
        const rowSeats = seats.filter(seat => seat.row === r);
        const availableRowSeats = rowSeats.filter(seat => seat.isavailable);
  
        if (availableRowSeats.length >= numOfSeats) {
          const toBook = availableRowSeats.slice(0, numOfSeats);
  
          // available seats found now update the seats to booked status and perticular user
          await prisma.seat.updateMany({
            where: { id: { in: toBook.map(seat => seat.id) } },
            data: { isavailable: false, userId },
          });
  
          return res.status(200).json({ message: 'Seats booked successfully.', data: toBook });
        }
      }
  
      // If we can't find all seats in single row then we will find the nearest seats in this case we will store the avaliable seat in each
      //row in variable rowAvailability and then we will find the smallest range of rows that can fulfill the booking
      let rowAvailability: number[] = [];
      for (let r = 1; r <= rows; r++) {
        const rowSeats = seats.filter(seat => seat.row === r);
        const availableRowSeats = rowSeats.filter(seat => seat.isavailable).length;
        rowAvailability.push(availableRowSeats);
      }
  
      // Find the smallest range of rows that can fulfill the booking
      // We will use sliding window technique to find the range of rows that can fulfill the booking 
      let end = -1;
      let sum = 0;
      let minLen = Infinity;
      let start = -1;
      let ptr = 0;
  
      for (let i = 0; i < rowAvailability.length; i++) {
        sum += rowAvailability[i];
  
        // Check if the current range has enough seats
        while (sum >= numOfSeats) {
          const len = i - ptr + 1;
          if (len < minLen) {
            minLen = len;
            start = ptr;
            end = i;
          }
          sum -= rowAvailability[ptr];
          ptr++;
        }
      }
  
      // If a valid range is found, select and book the seats
      if (start !== -1 && end !== -1) {
        let bookedSeats: { id: number; row: number; seat_number: number; isavailable: boolean }[] = [];
        for (let r = start; r <= end; r++) {
          const rowSeats = seats.filter(seat => seat.row === r + 1 && seat.isavailable);
          bookedSeats = bookedSeats.concat(rowSeats);
        }
  
        bookedSeats = bookedSeats.slice(0, numOfSeats);
  
        // Update selected seats to booked status
        await prisma.seat.updateMany({
          where: { id: { in: bookedSeats.map(seat => seat.id) } },
          data: { isavailable: false, userId },
        });
  
        return res.status(200).json({ message: 'Seats booked successfully.', data: bookedSeats });
      }
  
      // If no valid range found
      return res.status(500).json({ message: 'Booking failed, not enough nearby seats available.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// Reset Seats
router.post('/reset', authMiddleware, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.seat.deleteMany();

    const totalRows = 12;
    const seatsPerRow = 7;

    const seats = [];
    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = row === totalRows ? 80 % seatsPerRow : seatsPerRow;
      for (let seatNum = 1; seatNum <= rowSeats; seatNum++) {
        seats.push({ seat_number: seatNum, row, isavailable: true });
      }
    }

    await prisma.seat.createMany({ data: seats });

    return res.status(200).json({ message: 'Seats reset successfully.' });
  } catch (error) {
    console.error('Error resetting seats:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get All Seats
router.get('/seats', authMiddleware, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const seats = await prisma.seat.findMany({
      orderBy: [{ row: 'asc' }, { seat_number: 'asc' }],
    });
    return res.status(200).json({ data: seats });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});


export const seatRouter = router;
