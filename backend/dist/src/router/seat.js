"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seatRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const app = (0, express_1.default)();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
// Book Seats
router.post('/book', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { numOfSeats } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(400).json({ message: 'User not found' });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (numOfSeats > 7) {
        return res.status(400).json({ message: 'Cannot book more than 7 seats' });
    }
    try {
        // Fetch available seats
        const seats = yield prisma.seat.findMany({
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
                yield prisma.seat.updateMany({
                    where: { id: { in: toBook.map(seat => seat.id) } },
                    data: { isavailable: false, userId },
                });
                return res.status(200).json({ message: 'Seats booked successfully.', data: toBook });
            }
        }
        // If we can't find all seats in single row then we will find the nearest seats in this case we will store the avaliable seat in each
        //row in variable rowAvailability and then we will find the smallest range of rows that can fulfill the booking
        let rowAvailability = [];
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
            let bookedSeats = [];
            for (let r = start; r <= end; r++) {
                const rowSeats = seats.filter(seat => seat.row === r + 1 && seat.isavailable);
                bookedSeats = bookedSeats.concat(rowSeats);
            }
            bookedSeats = bookedSeats.slice(0, numOfSeats);
            // Update selected seats to booked status
            yield prisma.seat.updateMany({
                where: { id: { in: bookedSeats.map(seat => seat.id) } },
                data: { isavailable: false, userId },
            });
            return res.status(200).json({ message: 'Seats booked successfully.', data: bookedSeats });
        }
        // If no valid range found
        return res.status(500).json({ message: 'Booking failed, not enough nearby seats available.' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}));
// Reset Seats
router.post('/reset', middleware_1.authMiddleware, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.seat.deleteMany();
        const totalRows = 12;
        const seatsPerRow = 7;
        const seats = [];
        for (let row = 1; row <= totalRows; row++) {
            const rowSeats = row === totalRows ? 80 % seatsPerRow : seatsPerRow;
            for (let seatNum = 1; seatNum <= rowSeats; seatNum++) {
                seats.push({ seat_number: seatNum, row, isavailable: true });
            }
        }
        yield prisma.seat.createMany({ data: seats });
        return res.status(200).json({ message: 'Seats reset successfully.' });
    }
    catch (error) {
        console.error('Error resetting seats:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}));
// Get All Seats
router.get('/seats', middleware_1.authMiddleware, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seats = yield prisma.seat.findMany({
            orderBy: [{ row: 'asc' }, { seat_number: 'asc' }],
        });
        return res.status(200).json({ data: seats });
    }
    catch (error) {
        console.error('Error fetching seats:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}));
exports.seatRouter = router;
