const express = require('express');
const AuthController = require('../controllers/authController');
const UserController = require('../controllers/userController');

const userRouter = express.Router();

// Ruta de prueba para verificar que el endpoint esté funcionando
userRouter.get('/', (req, res) => {
    res.status(200).json({
        message: "User endpoint is working!",
    });
});

// Rutas de autenticación
userRouter.post('/signup', AuthController.signup);
userRouter.post('/login', AuthController.LoginwithEmailandPassword);

// Rutas de usuario
userRouter.post('/updateMeasures/:id', UserController.updateUserMeasurables);
userRouter.post('/uploadimage/:id', UserController.uploadUserBodyImage);
userRouter.post('/deleteimages/:id', UserController.deleteImageOfUserBody);
userRouter.get('/updateMeasureRecords/:id/:measure', UserController.updateUserBodyMeasureRecord);
userRouter.post('/updateusername', AuthController.AuthMiddleware, UserController.updateusername);
userRouter.post('/updateuserimage', AuthController.AuthMiddleware, UserController.updateuserimage);
userRouter.post('/updateuserpassword', AuthController.AuthMiddleware, UserController.changePassword);

// Rutas de recuperación de contraseña
userRouter.post('/forgotpassword', AuthController.forgotPassword);
userRouter.post('/matchotp', AuthController.matchOtp);
userRouter.post('/resetpassword', AuthController.resetpassword);

module.exports = userRouter;
