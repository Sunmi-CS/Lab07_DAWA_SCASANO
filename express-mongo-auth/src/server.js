import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import viewRoutes from './routes/views.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use('/', viewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.use((req, res) => res.status(404).render('404'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then(async () => {
        console.log('Mongo connected');
        await seedRoles();
        await seedUsers();
        app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
    })
    .catch(err => { console.error(err); process.exit(1); });