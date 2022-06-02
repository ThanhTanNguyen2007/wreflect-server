import { checkIsMemberOwningTeam } from './essential';
import { addMemberToTeamType, setRoleMemberType } from '../types';
import prisma from '../prisma';
import _ from 'lodash';

import { sendMail } from './nodemailer';
import { User } from '.prisma/client';
import config from '../config';
import { ApolloError } from 'apollo-server-errors';
import { StatusCodes } from 'http-status-codes';
import * as service from '.';
import error from '../errorsManagement';

export const getListMembers = async (teamId?: string, userId?: string) => {
  const members = await prisma.member.findMany({
    where: {
      teamId,
      userId,
    },
    orderBy: [
      {
        isSuperOwner: 'desc',
      },
      {
        isOwner: 'desc',
      },
    ],
  });

  return members;
};

export const getMember = async (memberId?: string) => {
  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) throw new ApolloError('Member not found', `${StatusCodes.NOT_FOUND}`);
  return member;
};

export const addMembersToTeam = async (meId: string, args: addMemberToTeamType) => {
  const memberOwnedTeam = await checkIsMemberOwningTeam(args.teamId, meId);

  const currentUsers: User[] = await prisma.user.findMany({
    where: {
      email: {
        in: args.emailUsers.map((mail) => mail.toLowerCase()),
      },
    },
  });
  const currentMailsUser = currentUsers.map((user) => user.email);

  const success = [] as string[];
  const warnings = [] as string[];
  const errors = [] as string[];
  const newEmail = _.filter(args.emailUsers, (email) => !currentMailsUser.includes(email));
  if (newEmail.length > 0) {
    for (let idx = 0; idx < newEmail.length; idx++) {
      const email = newEmail[idx];
      try {
        sendMail(
          email,
          `Invite to team ${args.teamId}`,
          `${memberOwnedTeam?.user?.nickname} invite you to team ${memberOwnedTeam?.team.name} - ${args.teamId}: ${config?.CLIENT_URL}/invite-link/${args?.teamId}`,
        );
        warnings.push(`We have sent email invite to ${email}`);

        await prisma.user.create({
          data: {
            email: email,
            isRegistered: false,
            sub: 'temp',
            members: {
              create: {
                teamId: args.teamId,
                invitedBy: meId,
                isPendingInvitation: true,
              },
            },
            nickname: 'UnRegistered',
            picture: `${config.SERVER_URL}/uploads/avatarDefault.png`,
          },
        });
      } catch (error) {
        errors.push(`Something failed with ${email}`);
      }
    }
  }

  if (currentUsers.length > 0) {
    for (let idx = 0; idx < currentUsers.length; idx++) {
      const email = currentMailsUser[idx];
      try {
        const member = await prisma.member.findUnique({
          where: {
            userId_teamId: {
              teamId: args.teamId,
              userId: currentUsers[idx].id,
            },
          },
        });
        if (member) {
          errors.push(`${currentUsers[idx].email} already exists in this team`);
        } else {
          await prisma.member.create({
            data: {
              invitedBy: meId,
              userId: currentUsers[idx].id,
              teamId: args?.teamId,
            },
          });
          sendMail(
            email,
            `Invite to team ${args.teamId}`,
            `${memberOwnedTeam?.user?.nickname} invite you to team ${memberOwnedTeam?.team.name} - ${args.teamId}: ${config?.CLIENT_URL}/invite-link/${args?.teamId}`,
          );

          success.push(`${currentUsers[idx]?.email} added in this team`);
        }
      } catch (error) {
        errors.push(`Something failed with ${currentUsers[idx]?.email}`);
      }
    }
  }
  const updatedTeam = await prisma.team.findUnique({
    where: {
      id: args.teamId,
    },
    include: {
      members: true,
    },
  });

  return {
    team: updatedTeam,
    success,
    warnings,
    errors,
  };
};

export const removeMember = async (meId: string, args: { memberId: string; teamId: string }) => {
  const memberOwnedTeam = await checkIsMemberOwningTeam(args.teamId, meId);

  const memberNeedRemove = await service.member.getMember(args.memberId);
  if (memberNeedRemove.isSuperOwner) {
    return error.Forbidden("You can't remove Super Owner");
  }
  if (!memberOwnedTeam.isSuperOwner && memberNeedRemove.isOwner) {
    return error.Forbidden('Only super owner can remove of other owner');
  }

  const team = await prisma.team.update({
    where: {
      id: args.teamId,
    },
    data: {
      members: {
        delete: {
          id: args.memberId,
        },
      },
    },
  });

  if (!team) return error.NotFound('Member not found in this team');
  return team;
};

export const changeRoleMember = async (meId: string, args: setRoleMemberType) => {
  const memberOwnedTeam = await checkIsMemberOwningTeam(args.teamId, meId);

  const memberNeedChangeRole = await service.member.getMember(args.memberId);
  if (memberNeedChangeRole.isSuperOwner) {
    return error.Forbidden("You don't have permission to change role of Super Owner");
  }
  if (!memberOwnedTeam.isSuperOwner && memberNeedChangeRole.isOwner) {
    return error.Forbidden('Only super owner can change role of other owner');
  }

  const team = await prisma.team.update({
    where: {
      id: args.teamId,
    },
    data: {
      members: {
        update: {
          where: {
            id: args.memberId,
          },
          data: {
            isOwner: args.isOwner,
          },
        },
      },
    },
  });

  if (!team) return error.NotFound("Can't found a member to change role ");
  return team;
};
