import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

// const insert = async () => {
//   return prisma.user.create({
//     data: {
//       username: 'andrei.radu',
//     },
//   });
// };

// (async () => {
//   try {
//     // await insert();
//     await prisma.$disconnect();
//   } catch (error) {
//     console.log('error insert seed', error);
//     await prisma.$disconnect();
//     process.exit(1);
//   }
// })();

// const deleteUser = async (userId: User['id']) => {
//   return prisma.user.delete({
//     where: {
//       id: userId,
//     },
//   });
// };
