import express from 'express';

import {getAllUsers, deleteUser, updateUser, getAllUsersByName, getUserByToken} from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.post('/users', isAuthenticated, getAllUsersByName);
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
    router.post('/user', isAuthenticated, updateUser);
    router.get('/user', isAuthenticated, getUserByToken);

};