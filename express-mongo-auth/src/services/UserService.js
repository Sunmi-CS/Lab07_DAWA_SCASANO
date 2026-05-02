import userRepository from '../repositories/UserRepository.js';

function calcularEdad(birthdate) {
    const hoy = new Date();
    const nacimiento = new Date(birthdate);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
}

class UserService {
    async getAll() {
        const users = await userRepository.getAll();
        return users.map(u => ({
            id: u._id,
            email: u.email,
            name: u.name,
            lastName: u.lastName,
            phoneNumber: u.phoneNumber,
            birthdate: u.birthdate,
            edad: calcularEdad(u.birthdate),
            address: u.address,
            url_profile: u.url_profile,
            roles: u.roles.map(r => r.name),
            createdAt: u.createdAt
        }));
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) { const err = new Error('Usuario no encontrado'); err.status = 404; throw err; }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            edad: calcularEdad(user.birthdate),
            address: user.address,
            url_profile: user.url_profile,
            roles: user.roles.map(r => r.name),
            createdAt: user.createdAt
        };
    }

    async updateMe(id, data) {
        const allowed = ['name', 'lastName', 'phoneNumber', 'birthdate', 'address', 'url_profile'];
        const update = {};
        for (const key of allowed) { if (data[key] !== undefined) update[key] = data[key]; }
        const user = await userRepository.updateUser(id, update);
        if (!user) { const err = new Error('Usuario no encontrado'); err.status = 404; throw err; }
        return this.getById(id);
    }
}
export default new UserService();