import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import createRoles from './config/roleSetup.js';

// routes
import authRoutes from './routes/authRoutes.js';
import userManagementRoutes from './routes/userRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import cardRoutes from './routes/cardRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: `http://localhost:${port}`,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userManagementRoutes);

app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspace', boardRoutes);

app.use('/api/board', cardRoutes);

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// connect to db and create roles (user, admin)
const startServer = () => {
    mongoose.connect(process.env.MONG_URI)
        .then(async () => {
            console.log('Connected to db');

            await createRoles();
            console.log('Roles created successfully');

            app.listen(port, () => {
                console.log(`Server is listening on port ${port}!`);
            });
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err);
        });
}

startServer();