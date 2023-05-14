import Role from '../model/Role.js'


const getRole = async(req,res) => {
    const role = await Role.find();
    if(role){
        return res.status(201).json(role)
    }
    return  res.status(401).json({ message: "No data found", status: 401 });
}

const storeRole = async(req,res) => {
    const role = new Role({
        name: req.body.name
    })
    role.save().then(data => {
            res.send({
                message: "Role created successfully!!",
                role: data
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating user"
            });
        });
}

const updateRole = async(req,res) => {
    const { _id } = req.params;
    const { name } = req.body;
    try {
        const role = await Role.findByIdAndUpdate(_id, { name }, { new: true });

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}
const deleteRole = async(req,res) => {
    const { _id } = req.params;
    try {
        const role = await Role.findByIdAndDelete(_id, { new: true });

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}
export {
    getRole,
    storeRole,
    updateRole,
    deleteRole
}