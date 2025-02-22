import Role from '../models/roleModel.js'


const createRoles = async () => {
    const roles = ['user', 'admin']

    try {
        for (const roleName of roles) {
            const existingRole = await Role.findOne({ name: roleName })
            if (!existingRole) {
                await Role.create({ name: roleName })
                console.log(`Role ${roleName} created successfully`)
            }
        }
    } catch (error) {
        console.error('Error creating roles:', error)
    }
}

export default createRoles