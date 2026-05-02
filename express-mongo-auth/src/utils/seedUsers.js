import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
    const existing = await userRepository.findByEmail('admin@app.com');
    if (existing) return;

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashed = await bcrypt.hash('Admin@1234', saltRounds);

    let adminRole = await roleRepository.findByName('admin');
    if (!adminRole) adminRole = await roleRepository.create({ name: 'admin' });

    await userRepository.create({
        email: 'admin@app.com',
        password: hashed,
        name: 'Admin',
        lastName: 'Sistema',
        phoneNumber: '999000000',
        birthdate: new Date('1990-01-01'),
        roles: [adminRole._id]
    });
    console.log('Admin creado: admin@app.com / Admin@1234');
}