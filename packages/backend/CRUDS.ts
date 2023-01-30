import prisma from './utils/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

interface DeleteReqBody extends Request {
  body: {
    userId: string;
  };
}

interface UserQueryParams {
  username?: string;
}

interface InsertUser {
  password: string;
  email: string;
  username: string;
}

// UserUpdateArgs

// Get all users or a specific user by providing username in query params
// router.get(
//   '/users',
//   async (
//     req: Request<{}, {}, {}, UserQueryParams>,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     console.log('Users get hited');
//     try {
//       console.log('has query params', req.query);
//       const { username: usernameQuery } = req.query;

//       if (!usernameQuery) {
//         const users = await prisma.user.findMany({
//           select: {
//             username: true,
//             email: true,
//           },
//         });

//         return res.status(200).json({
//           data: users,
//         });
//       }

//       const user = await prisma.user.findFirst({
//         where: {
//           username: usernameQuery,
//         },
//         select: {
//           email: true,
//           username: true,
//         },
//       });

//       if (!user) {
//         return res.status(200).json({
//           message: `Couldnt find user in database with username: ${usernameQuery}`,
//         });
//       }

//       return res.status(200).json({
//         data: user,
//       });
//     } catch (error) {
//       return next(error);
//     }
//   },
// );

// Insert user
// router.post(
//   '/insert',
//   async (
//     req: Request<{}, {}, InsertUser>,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({
//         message: 'Invalid request params',
//       });
//     }

//     try {
//       const isExistingUser = await prisma.user.findFirst({
//         where: {
//           OR: [
//             {
//               email: email,
//             },
//             {
//               username: username,
//             },
//           ],
//         },
//       });

//       if (isExistingUser) {
//         return res.status(400).json({
//           message: 'Username or email already in use',
//         });
//       }

//       // const hassedPw = await bcrypt.hash(password, 10);

//       await prisma.user.create({
//         data: {
//           username: username || 'andrei.radu',
//           email: email || 'andrei.radu@expenxy.com',
//           password: hassedPw ?? null,
//         },
//       });

//       return res.status(200).json({
//         message: 'Inserted',
//         password: hassedPw,
//       });
//     } catch (error) {
//       console.log('error Insert', error);
//       return next(error);
//     }
//   },
// );

// Delete user by userId
// router.post('/delete', async (req: DeleteReqBody, res, next) => {
//   const { userId } = req.body;

//   console.log('userId', userId);

//   if (!userId) {
//     const error = new Error('Invalid request params');
//     return next(error);
//   }

//   try {
//     await prisma.user.delete({
//       where: {
//         id: userId,
//       },
//     });
//     return res.status(200).json({
//       message: 'Deleted',
//     });
//   } catch (error) {
//     if (error instanceof PrismaClientKnownRequestError) {
//       const { code, message, meta }: PrismaClientKnownRequestError = error;
//       return next({ message: meta, status: 400 });
//     }
//     return next(error);
//   }
// });

// Update user by userId
// router.put('/update', async (req, res, next) => {
//   const userId = req.query;
//   const { email, password } = req.body;

//   if (typeof userId !== 'string') {
//     return res.status(500).json({
//       message: ' Invalid query params',
//     });
//   }

//   const dataToUpdate = {};
//   email && Object.assign(dataToUpdate, { email: email });
//   password && Object.assign(dataToUpdate, { password: password });

//   try {
//     await prisma.user.update({
//       data: dataToUpdate,
//       where: {
//         id: userId,
//       },
//     });

//     return res.status(200).json({
//       message: 'Success',
//     });
//   } catch (error) {
//     return next(error);
//   }
// });
