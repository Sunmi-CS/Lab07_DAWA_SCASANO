import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

function validatePassword(password) {
    if (password.length < 8) return 'El password debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'El password debe tener al menos 1 mayúscula';
    if (!/[0-9]/.test(password)) return 'El password debe tener al menos 1 dígito';
    if (!/[#$%&*@]/.test(password)) return 'El password debe tener al menos un carácter especial (#$%&*@)';
    return null;
}

class AuthService {
    async signUp({ email, password, name, lastName, phoneNumber, birthdate, url_profile, address, roles = ['user'] }) {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            const err = new Error('El email ya se encuentra en uso');
            err.status = 400; throw err;
        }
        const pwError = validatePassword(password);
        if (pwError) {
            const err = new Error(pwError);
            err.status = 400; throw err;
        }
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash(password, saltRounds);

        const roleDocs = [];
        for (const r of roles) {
            let roleDoc = await roleRepository.findByName(r);
            if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
            roleDocs.push(roleDoc._id);
        }
        const user = await userRepository.create({
            email, password: hashed, name, lastName,
            phoneNumber, birthdate, url_profile, address, roles: roleDocs
        });
        return { id: user._id, email: user.email, name: user.name };
    }

    async signIn({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const err = new Error('Credenciales inválidas');
            err.status = 401; throw err;
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            const err = new Error('Credenciales inválidas');
            err.status = 401; throw err;
        }
        const token = jwt.sign(
            { sub: user._id, roles: user.roles.map(r => r.name) },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
        return { token, roles: user.roles.map(r => r.name) };
    }
}
export default new AuthService();