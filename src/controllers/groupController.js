const mongoose = require('mongoose');
const GroupModel = require('../models/groupModel');
const groupmodel = mongoose.model("Group");

exports.createGroup = async (req, res) => {
    //verifier les donnees NAME
    let name = req.body.name.trim();

    await GroupModel.findOne({"name": name}, (error, result) => {
        if (error) return res.status(500)
        if (result) return res.status(400).json({error: "This group name is already used"});
    });
    const initGroup = new GroupModel({
        _id_admin: req.user._id,
        name: name,
        user: req.body.user
    });
    initGroup.save((error) => {
        if (error) {
            res.status(500);
            res.json({message: "Erreur serveur."});
        }
        res.json({message: "Thank you for creating your group"});
    });
};
exports.deleteGroup = (req, res) => {
    GroupModel.remove({"_id": req.params.group_id}, (error) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json({"message": "Group successfully removed"});
        }
    })
};


exports.getGroupById = (req, res) => {
    GroupModel.findById({"_id": req.params.group_id}, (error, group) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Error server"})
        } else {
            res.status(200);
            res.json(group);
        }
    })
};

exports.getGroupsList = (req, res) => {
    groupmodel.find({}, (error, groupmodel) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server Error."})
        } else {
            res.status(200);
            res.json(groupmodel);
        }
    });
};

exports.getGroups = (req, res) => {
    groupmodel.find(
        {
            $or: [
                {'_id_admin': req.params.user_id},
                {'user.user_id': req.params.user_id}
                ]
        }, (error, groupmodel) => {
            if (error) {
                res.status(500);
                console.log(error);
                res.json({message: "Server Error."})
            } else {
                res.status(200);
                res.json(groupmodel);
            }
        });
};

exports.updateGroup = async (req, res) => {
    const {error} = groupValidation(req.body);
    if (error) return res.status(400).json({message: req.body});

    const group = {
        name: req.body.name,
        admin: req.body.admin,
        members: req.body.members
    };

    const filter = {
        _id: req.params.group_id
    }

    groupmodel.findOneAndUpdate(filter, group, {new: true}, (error, group) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({message: "Server error"});
        } else {
            res.status(200);
            res.json(group);
        }
    });
};

