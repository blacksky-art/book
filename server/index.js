import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDatabase from './database.js';
import productRoutes from './routes/productRoutes.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to Database
connectToDatabase();

// Routes
app.use('/api/products', productRoutes)

const PORT = 5000;
app.get('/',(req,res) => {
    res.send('Api is running ');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
