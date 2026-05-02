import express from 'express';
import ViewController from '../controllers/ViewController.js';
import { requireAuth, requireRole } from '../middlewares/authView.js';

const router = express.Router();
router.get('/', (req, res) => res.redirect('/signIn'));
router.get('/signIn', ViewController.signIn);
router.get('/signUp', ViewController.signUp);
router.get('/profile', requireAuth, ViewController.profile);
router.get('/dashboard/user', requireAuth, requireRole(['user', 'admin']), ViewController.dashboardUser);
router.get('/dashboard/admin', requireAuth, requireRole(['admin']), ViewController.dashboardAdmin);
router.get('/403', ViewController.page403);
export default router;