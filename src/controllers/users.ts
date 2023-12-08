import express from 'express';

import {deleteUserById, getUsers, getUserByName, getUserBySessionToken, updateUserById} from '../db/users';
import {get} from "lodash";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const getAllUsersByName = async (req: express.Request, res: express.Response) => {
    try {
        const { username } = req.body;
        const users = await getUserByName(username);
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

// export const updateUser = async (req: express.Request, res: express.Response) => {
//     try {
//         const { id } = req.params;
//         const { username } = req.body;
//
//         if (!username) {
//             return res.sendStatus(400);
//         }
//
//         const user = await getUserById(id);
//
//         user.username = username;
//         await user.save();
//
//         return res.status(200).json(user).end();
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// }

export const getUserByToken = async (req: express.Request, res: express.Response) => {
    try {
        const sessionToken = get(req, "cookies.sessionToken");

        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500); // Use 500 for server errors
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        // You would typically get the user ID from the session token or a URL parameter
        const sessionToken = get(req, "cookies.sessionToken");

        const userData = await getUserBySessionToken(sessionToken);
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userData._id;
        const updates = req.body;

        // Validate the updates here - ensure no additional properties are being updated
        const allowedUpdates = ['email', 'password', 'username', 'sex'];
        const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates!' });
        }
        // Update the user
        const updatedUser = await updateUserById(String(userId) , updates);

        // Depending on your setup, you might want to handle the situation where no changes are made
        if (!updatedUser) {
            return res.status(404).json({ error: 'Update failed, user not found or no changes made.' });
        }

        // Return the updated user data
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
