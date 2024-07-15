import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout').middleware('auth:api')
  Route.post('/verify-account', 'AuthController.verifyAccount')
  Route.post('/forgot-password', 'AuthController.forgotMyPassword')
  Route.post('/new-password', 'AuthController.newPassword')
}).prefix('/api/auth')
