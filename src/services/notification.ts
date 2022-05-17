import { notification } from '.';
import logger from '../logger';
import prisma from '../prisma';

export const getListNotifications = async (meId: string, page = 1, size = 10) => {
  const notificationList = await prisma?.notification?.findMany({
    where: {
      // senderId: meId,
      receiverId: meId,
    },
    skip: (page - 1) * size,
    take: size,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return notificationList;
};

export const sentRemiderNotification = async () => {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const remiderNotiList = await prisma.remiderNotification.findMany({
    where: {
      dateSent: {
        equals: new Date(currentDate),
      },
    },
  });

  if (remiderNotiList && remiderNotiList?.length == 0) return;

  for (let x = 0; x < remiderNotiList?.length; x++) {
    const remiderNoti = remiderNotiList[x];
    try {
      for (let y = 0; y < remiderNoti?.sendTo?.length; y++) {
        const receiverId = remiderNoti?.sendTo[y];
        const senderId = remiderNoti?.sentBy;
        const sendingNoti = await prisma?.notification?.create({
          data: {
            senderId,
            receiverId,
            title: remiderNoti?.title,
            description: remiderNoti?.description,
          },
        });

        if (!sendingNoti) break;
        //   pubsub.publish('ANSWER_HEALTH', {
        //     updateGetHealthCheckData: setAnswerToHealthCheck,
        //     teamId: args.teamId,
        //   });
        logger?.info('subscription here');
      }
    } catch (error) {
      logger?.error('send noti: ', error);
    } finally {
      await prisma?.remiderNotification?.delete({
        where: {
          id: remiderNoti?.id,
        },
      });
    }
  }
};

export const removeNotification = async (meId, args: { notificationId: string }) => {
  const removingNotification = await prisma?.notification?.delete({
    where: {
      id: args?.notificationId,
    },
  });

  return removingNotification;
};

export const getNumOfUnSeenNoti = async (meId) => {
  const numOfUnSeenNoti = await prisma?.notification?.count({
    where: {
      receiverId: meId,
      isSeen: false,
    },
  });

  return numOfUnSeenNoti;
};

export const seenNotification = async (meId: string, args: { notificationId: string }) => {
  const updatedNotification = await prisma?.notification?.update({
    where: {
      id: args?.notificationId,
    },
    data: {
      isSeen: true,
    },
  });

  return updatedNotification;
};
