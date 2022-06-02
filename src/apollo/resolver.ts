import { getUsersArgs, banUserArgs, updateUserArgs } from './TypeDefs/userTypeDefs';
import { getCriteriaListArgs, updateCriteriaArgs, createCriteriaArgs } from './TypeDefs/Criteria/criteriaTypeDefs';
import _ from 'lodash';
import {
  createAssessmentType,
  getAssessmentArgs,
  getAssessmentsArg,
  submitDoPersonalReflection,
} from './TypeDefs/Assessment/assessmentTypes';
import { createRemarkType, removeRemarkType } from './TypeDefs/remarkTypeDefs';
import { addMemberToTeamType, RequestWithUserInfo, updateTeamArgs } from './../types';
import {
  member,
  team,
  user,
  board,
  column,
  opinion,
  remark,
  criteria,
  assessment,
  analysis,
  notification,
  healthCheck,
  healthCheckTemplate,
} from '../services';
import { withFilter } from 'graphql-subscriptions';

import {
  createOpinionType,
  removeOpinionType,
  orderOpinionType,
  combineOpinionType,
  updateOpinionType,
  convertToActionType,
  updateActionTrackerType,
} from './TypeDefs/opinionTypeDefs';
import { pubsub } from '../pubSub';
import {
  updateBoardArgs,
  createBoardArgs,
  deleteBoardArgs,
  updatingMeetingNoteArgs,
} from './TypeDefs/Board/boardTypes';
import {
  createTemplateHealthCheckArgs,
  updateTemplateHealthCheckArgs,
  getTemplatesArgs,
  getTemplatesOfTeam,
  createCustomTemplateArgs,
  updateCustomTemplateArgs,
  deleteCustomTemplateForTeamArgs,
} from './TypeDefs/templateTypeDefs';
import { string } from 'zod';
import {
  createHealthCheckArgs,
  reopenHealthCheckArgs,
  submitHealthCheckAnswerArgs,
} from './TypeDefs/HealthCheck/healthCheckTypeDefs';

const resolvers = {
  Query: {
    getTeams: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId, isAdmin } = req?.user;
      const { status, isGettingAll, search, page, size } = args;
      const result = await team.getTeams(isAdmin, isGettingAll, page, size, search, status);
      return result;
    },
    getTeamsOfUser: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const { isGettingAll, search, page, size } = args;
      const ownedTeams = await team.getTeamsOfUser(meId, !!isGettingAll, page, size, search);
      return ownedTeams;
    },
    team: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id, isAdmin } = req?.user;
      const myTeam = await team.getTeam(id, isAdmin, args.teamId);
      return myTeam;
    },
    account: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const userData = await user.getUser(meId);
      return userData;
    },

    board: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const myBoard = await board.getBoard(args.boardId, meId);
      return myBoard;
    },

    getHealthCheck: async (_, args: { teamId: string; boardId: string }, { req }: { req: RequestWithUserInfo }) => {
      // const result = await healthCheck.getHealthCheck(args?.teamId, args?.boardId);
      const { teamId, boardId } = args;
      const gettingHealthCheck = await healthCheck.getHealthCheck(teamId, boardId);
      return gettingHealthCheck;
    },

    getEssential: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const isGettingAll = true;
      const criteriaList = await criteria.getCriteriaList(isGettingAll);
      return {
        criteriaList: criteriaList?.data,
      };
    },
    getAssessments: async (_, args: getAssessmentsArg, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const { teamId, isGettingAll, search, sortBy, orderWith, page, size } = args;
      const assessmentList = await assessment.getAssessments(
        meId,
        teamId,
        isGettingAll,
        search,
        sortBy,
        orderWith,
        page,
        size,
      );
      return assessmentList;
    },
    getAssessment: async (_, args: getAssessmentArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const assessmentData = await assessment.getAssessment(meId, args);
      return assessmentData;
    },

    getAnalysisAssessment: async (
      _,
      args: { teamId: string; assessmentId: string; memberId: string },
      { req }: { req: RequestWithUserInfo },
    ) => {
      const { id: meId } = req?.user || {};
      const assessment = await analysis?.analysisAssessment(meId, args);
      return assessment;
    },

    getNotifications: async (_, args: { page?: number; size?: number }, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const { page, size } = args;
      const notificationsList = await notification?.getListNotifications(meId, page, size);
      return notificationsList;
    },

    getNumOfUnSeenNoti: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const numOfUnSeenNoti = await notification?.getNumOfUnSeenNoti(meId);
      return numOfUnSeenNoti;
    },

    // getSkillsAnlytic: async (_, args, { req }: { req: RequestWithUserInfo }) => {
    //   const { id: meId } = req?.user || {};
    //   const getSkillData = await user?.getSkillsAnalytic(meId);
    //   return getSkillData;
    // },

    getTemplates: async (_, args: getTemplatesArgs, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin } = req?.user || {};
      const { isGettingAll, search, page, size } = args;
      const templates = await healthCheckTemplate.getTemplates(isGettingAll, search, page, size);
      return templates;
    },
    getCriteriaList: async (_, args: getCriteriaListArgs, { req }: { req: RequestWithUserInfo }) => {
      const { isGettingAll, search, page, size } = args;
      const criteriaList = await criteria?.getCriteriaList(isGettingAll, search, page, size);
      return criteriaList;
    },
    getUser: async (_, args: { userId?: string }, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const getUser = await user?.getUser(meId, args?.userId);
      return getUser;
    },
    getUsers: async (_, args: getUsersArgs, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin } = req?.user || {};
      const { isGettingAll, search, page, size } = args;
      const getUsers = await user?.getUsers(isAdmin, isGettingAll, search, page, size);
      return getUsers;
    },
    getTemplatesOfTeam: async (_, args: getTemplatesOfTeam, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin, id: meId } = req?.user || {};
      const getTemplatesOfTeam = await healthCheckTemplate?.getTemplatesOfTeam(args?.teamId, meId);
      return getTemplatesOfTeam;
    },
  },
  Mutation: {
    createHealthCheckTemplate: async (
      _,
      args: createTemplateHealthCheckArgs,
      { req }: { req: RequestWithUserInfo },
    ) => {
      const { isAdmin } = req?.user || {};
      const creatingTemplate = await healthCheckTemplate?.createTemplate(isAdmin, args);
      return creatingTemplate;
    },
    updateHealthCheckTemplate: async (
      _,
      args: updateTemplateHealthCheckArgs,
      { req }: { req: RequestWithUserInfo },
    ) => {
      const { isAdmin } = req?.user || {};
      const updatingTemplate = await healthCheckTemplate?.updateTemplate(isAdmin, args);
      return updatingTemplate;
    },
    deleteHealthCheckTemplate: async (_, args: { templateId: string }, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin } = req?.user || {};
      const deletingTemplate = await healthCheckTemplate?.deleteTemplate(isAdmin, args?.templateId);
      return deletingTemplate;
    },

    createCriteria: async (_, args: createCriteriaArgs, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin } = req?.user || {};
      const creatingCriteria = await criteria.createCriteria(isAdmin, args);
      return creatingCriteria;
    },
    updateCriteria: async (_, args: updateCriteriaArgs, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin } = req?.user || {};
      const updatingCriteria = await criteria.updateCriteria(isAdmin, args);
      return updatingCriteria;
    },
    deleteCriteria: async (_, args: { criteriaId: string }, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin } = req?.user || {};
      const deletingCriteria = await criteria?.deleteCriteria(isAdmin, args?.criteriaId);
      return deletingCriteria;
    },

    updateMeetingNote: async (_, args: updatingMeetingNoteArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const updatingBoard = await board.updateMeetingNote(meId, args.teamId, args.boardId, args.meetingNote);
      pubsub.publish('UPDATE_MEETINGNOTE', {
        subOnUpdateMeetingNote: updatingBoard,
        teamId: args?.teamId,
        boardId: args?.boardId,
      });
      return updatingBoard;
    },
    createTeam: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const myTeam = await team.createTeam(req, args);
      return myTeam;
    },
    updateTeam: async (_, args: updateTeamArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      return await team.updateTeam(meId, args);
    },
    deleteTeam: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      return await team.deleteTeam(meId, args?.teamId);
    },

    createHealthCheck: async (_, args: createHealthCheckArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const creatingHealthCheck = await healthCheck.createHealthCheck(meId, args);
      pubsub.publish('START_SURVEY', {
        subOnUpdateHealthCheck: creatingHealthCheck,
        teamId: args.teamId,
      });
      return creatingHealthCheck;
    },
    submitHealthCheckAnswer: async (_, args: submitHealthCheckAnswerArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const submitingHealthCheckAnswer = await healthCheck?.submitHealthCheckAnswer(meId, args);
      pubsub.publish('ANSWER_HEALTH', {
        subOnUpdateHealthCheck: submitingHealthCheckAnswer,
        teamId: args.teamId,
      });
      return submitingHealthCheckAnswer;
    },

    reopenHealthCheck: async (_, args: reopenHealthCheckArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const deletingHealthCheck = await healthCheck.reopenHealthCheck(meId, args);
      pubsub.publish('REOPEN_HEALTH', {
        subOnUpdateHealthCheck: deletingHealthCheck,
        teamId: args.teamId,
      });
      return deletingHealthCheck;
    },

    changeTeamAccess: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const { teamId, isPublic } = args;
      return await team.changeTeamAccess(meId, teamId, isPublic);
    },
    // usingCurrentBoard: async (_, args, {req}: {req: RequestWithUserInfo}) => {
    //   return await team.changeCurrentBoard
    // },
    createBoard: async (_, args: createBoardArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const team = await board.createBoard(meId, args);
      pubsub.publish('CREATE_BOARD', {
        subOnUpdateTeam: team,
        teamId: args.teamId,
      });
      return team;
    },
    updateBoard: async (_, args: updateBoardArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const myBoard = await board.updateBoard(meId, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: myBoard,
        teamId: args.teamId,
      });
      return myBoard;
    },
    deleteBoard: async (_, args: deleteBoardArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req.user || {};
      const team = await board.deleteBoard(meId, args);
      pubsub.publish('DELETE_BOARD', {
        subOnUpdateTeam: team,
        teamId: args.teamId,
      });
      return team;
    },
    convertOpinionsInColumn: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const convertingColumn = await column.convert(
        args.teamId,
        args.boardId,
        args.columnId,
        meId,
        args.action == 'ACTIONS' ? true : false,
      );
      pubsub.publish('CONVERT_COLUMN', {
        subOnUpdateColumn: convertingColumn,
        teamId: args.teamId,
      });
      return convertingColumn;
    },
    emptyColumn: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const emptingColumn = await column.emptyColumn(args.teamId, args.boardId, args.columnId, meId);

      pubsub.publish('EMPTY_COLUMN', {
        subOnUpdateColumn: emptingColumn,
        teamId: args.teamId,
      });

      return emptingColumn;
    },

    joinTeamWithLink: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const joiningTeam = await team?.joinTeamWithLink(meId, args?.teamId);
      return joiningTeam;
    },

    addMembers: async (_, args: addMemberToTeamType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const { team: teamWithNewMembers, success, errors, warnings } = await member.addMembersToTeam(meId, args);

      pubsub.publish('ADD_MEMBER', {
        subOnUpdateTeams: teamWithNewMembers,
        emailList: args.emailUsers,
        teamId: args?.teamId,
        userId: '',
      });

      return {
        team: teamWithNewMembers,
        success,
        errors,
        warnings,
      };
    },
    removeMember: async (_, args: { memberId: string; teamId: string }, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const teamWithNewMembers = await member.removeMember(meId, args);
      pubsub.publish('REMOVE_MEMBER', {
        subOnUpdateTeams: teamWithNewMembers,
        memberId: args?.memberId,
        teamId: args?.teamId,
        emailList: [],
      });
      return teamWithNewMembers;
    },
    changeRoleMember: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const teamWithMembers = await member.changeRoleMember(meId, args);
      pubsub.publish('CHANGE_MEMBER_ROLE', {
        subOnUpdateTeam: teamWithMembers,
        teamId: args.teamId,
      });
      return teamWithMembers;
    },

    createOpinion: async (_, args: createOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;

      const columnContaintCreatingOpinion = await opinion.createOpinion(meId, args);

      pubsub.publish('CREATE_OPINION', {
        subOnUpdateColumn: columnContaintCreatingOpinion,
        teamId: args.teamId,
      });
      return columnContaintCreatingOpinion;
    },

    convertOpinion: async (_, args: convertToActionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const action = await opinion.convertToAction(meId, args);
      pubsub.publish('CONVERT_TO_ACTION', {
        updateOpinion: action,
        teamId: args.teamId,
      });
      return action;
    },

    updateOpinion: async (_, args: updateOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user;
      const myOpinion = await opinion.updateOpinion(args.teamId, meId, args);
      pubsub.publish('UPDATE_OPINION', {
        updateOpinion: { ...myOpinion },
        teamId: args.teamId,
      });
      return myOpinion;
    },
    removeOpinion: async (_, args: removeOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const column = await opinion.removeOpinion(meId, args);
      pubsub.publish('REMOVE_OPINION', {
        subOnUpdateColumn: column,
        teamId: args.teamId,
      });

      return board;
    },
    orderOpinion: async (_, args: orderOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const board = await opinion.orderOpinion(req, args);
      pubsub.publish('ORDER_OPINION', {
        updateBoard: board,
        teamId: args.teamId,
      });
      return board;
    },
    combineOpinion: async (_, args: combineOpinionType, { req }: { req: RequestWithUserInfo }) => {
      const board = await opinion.combineOpinion(req, args);
      pubsub.publish('UPDATE_BOARD', {
        updateBoard: board,
        teamId: args.teamId,
      });
      return board;
    },

    createRemark: async (_, args: createRemarkType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req.user;
      const opinionWithCreatingRemark = await remark.createRemark(meId, args);
      pubsub.publish('CREATE_REMARK', {
        updateOpinion: { ...opinionWithCreatingRemark },
        teamId: args.teamId,
      });
      return opinionWithCreatingRemark;
    },
    removeRemark: async (_, args: removeRemarkType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const opinionWithRemovingRemark = await remark.removeRemark(meId, args);
      pubsub.publish('REMOVE_REMARK', {
        updateOpinion: { ...opinionWithRemovingRemark },
        teamId: args.teamId,
      });
      return opinionWithRemovingRemark;
    },

    updateActionTracker: async (_, args: updateActionTrackerType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const teamUpdated = await team.updateActionTracker(meId, args);
      pubsub.publish('UPDATE_ACTION_TRACKER', {
        subOnUpdateTeam: teamUpdated,
        teamId: args.teamId,
      });
      return teamUpdated;
    },

    createAssessment: async (_, args: createAssessmentType, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const assessmentData = await assessment.createAssessment(meId, args);
      // pubsub.publish('CREATE_ASSESSMENT', {
      //   subOnUpdateTeam: team,
      //   teamId: args.teamId,
      // });
      return assessmentData;
    },

    doPersonalReflection: async (_, args: submitDoPersonalReflection, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const assessmentData = await assessment?.submitDoPersonal(meId, args);
      return assessmentData;
    },

    updateAssessment: async (
      _,
      args: { teamId: string; assessmentId: string; assessmentName: string },
      { req }: { req: RequestWithUserInfo },
    ) => {
      const { id: meId } = req?.user || {};
      const updatingAssessment = await assessment?.updatingAssessment(meId, args);
      return updatingAssessment;
    },

    deleteAssessment: async (
      _,
      args: { teamId: string; assessmentId: string },
      { req }: { req: RequestWithUserInfo },
    ) => {
      const { id: meId } = req?.user || {};
      const deletingAssessment = await assessment?.deleteAssessment(meId, args);
      return deletingAssessment;
    },

    seenNotification: async (_, args: { notificationId: string }, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const updatedNotification = await notification?.seenNotification(meId, args);
      return updatedNotification;
    },

    removeNotification: async (_, args: { notificationId: string }, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const removingNotification = await notification?.removeNotification(meId, args);
      return removingNotification;
    },

    updateUser: async (_, args: updateUserArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const updatingUser = await user?.updateUser(meId, args);
      return updatingUser;
    },

    banUser: async (_, args: banUserArgs, { req }: { req: RequestWithUserInfo }) => {
      const { isAdmin } = req?.user || {};
      const banningUser = await user?.banUser(isAdmin, args);
      return banningUser;
    },

    createCustomTemplate: async (_, args: createCustomTemplateArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const creatingCustomTemplateForTeam = await healthCheckTemplate?.createCustomTemplate(meId, args);
      return creatingCustomTemplateForTeam;
    },
    updateCustomTemplate: async (_, args: updateCustomTemplateArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const updatingCustomTemplate = await healthCheckTemplate?.updateCustomTemplate(meId, args);
      return updatingCustomTemplate;
    },
    deleteCustomTemplate: async (_, args: deleteCustomTemplateForTeamArgs, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId } = req?.user || {};
      const deletingCustomTemplateForTeam = await healthCheckTemplate?.deleteCustomTemplate(meId, args);
      return deletingCustomTemplateForTeam;
    },
  },
  Subscription: {
    // supOnUpdateMember: {
    //   subscribe: withFilter(
    //     () => pubsub.asyncIterator(['UPDATE_MEMBER']),
    //     (_, args) => {
    //       return true;
    //     },
    //   ),
    // },
    subOnUpdateMeetingNote: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['UPDATE_MEETINGNOTE']),
        (_, args) => {
          return _?.teamId === args?.teamId && _?.boardId === args?.boardId;
        },
      ),
    },

    subOnUpdateTeams: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['UPDATE_LIST_TEAMS', 'ADD_MEMBER', 'REMOVE_MEMBER']),
        (_, args) => {
          return true;
        },
      ),
    },
    subOnUpdateTeam: {
      subscribe: withFilter(
        () =>
          pubsub.asyncIterator([
            'UPDATE_ACTION_TRACKER',
            'UPDATE_TEAM',
            'CHANGE_MEMBER_ROLE',
            'CREATE_BOARD',
            'DELETE_BOARD',
          ]),
        (_, args) => {
          return _?.teamId === args?.teamId;
        },
      ),
    },
    updateBoard: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['CREATE_BOARD', 'UPDATE_BOARD', 'ORDER_OPINION']),
        (_, args, a) => {
          return _.teamId === args?.teamId;
        },
      ),
    },
    // deleteBoard: {
    //   subscribe: withFilter(
    //     () => pubsub.asyncIterator(['DELETE_BOARD']),
    //     (_, args) => {
    //       return true;
    //     },
    //   ),
    // },

    subOnUpdateHealthCheck: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['START_SURVEY', 'ANSWER_HEALTH', 'REOPEN_HEALTH']),
        (_, args) => {
          return _?.teamId === args?.teamId;
        },
      ),
    },

    subOnUpdateColumn: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['CREATE_OPINION', 'REMOVE_OPINION', 'CONVERT_COLUMN', 'EMPTY_COLUMN']),
        (_, args) => {
          return _?.teamId === args?.teamId;
        },
      ),
    },

    updateOpinion: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['UPDATE_OPINION', 'CONVERT_TO_ACTION', 'CREATE_REMARK', 'REMOVE_REMARK']),
        (_, args) => {
          return _?.teamId === args?.teamId;
        },
      ),
    },
  },

  User: {
    members: async (_) => {
      const members = await member.getListMembers(_.id);
      return members;
    },
  },
  // Team: {
  // boards: async (_, args, { req }: { req: RequestWithUserInfo }) => {
  //   const boards = await board.getBoards(_.id);
  //   return boards;
  // },
  // members: async (_) => {
  //   const members = await member.getListMembers(_.id);
  //   return members;
  // },
  // assessments: async (currentValue, args: getAssessmentListType, test) => {
  //   const assessments = await assessment.getListAssessment(currentValue.id, _.isEmpty(args) ? undefined : args);
  //   return assessments;
  // },
  // },
  // Assessment: {
  //   assessmentOnCriteriaList:  async (_) => {
  //     const assessmentOnCriteriaList = await assessment.
  //   }
  // },
  // Assessment: {
  //   assessmentOnCriteriaList: async (_, args, { req }: { req: RequestWithUserInfo }) => {
  //     const assessmentOnCriteriaList = await assessment.getListAssessmentOnCriteriaList(_.id);
  //     return assessmentOnCriteriaList;
  //   },
  // },
  Board: {
    // team: async (_, args, { req }: { req: RequestWithUserInfo }) => {
    //   const { id: meId, isAdmin } = req?.user || {};
    //   const myTeam = await team.getTeam(_.teamId, req ? (isAdmin ? undefined : meId) : args.meId);
    //   return myTeam;
    // },
    columns: async (_) => {
      const columns = await column.getListColumns(_.id);
      return columns;
    },
  },
  Column: {
    board: async (_, args, { req }: { req: RequestWithUserInfo }) => {
      const { id: meId, isAdmin } = req?.user || {};
      const myBoard = await board.getBoard(_?.boardId, req ? (isAdmin ? undefined : meId) : args.meId);
      return myBoard;
    },
    opinions: async (_) => {
      const opinions = await opinion.getListOpinions(_.id);
      return opinions;
    },
  },
  Opinion: {
    column: async (_) => {
      const myColumn = await column.getColumn(_?.columnId);
      return myColumn;
    },
    remarks: async (_) => {
      const remarks = await remark.getListRemarks(_?.id);
      return remarks;
    },
    author: async (_) => {
      return await member.getMember(_.authorId);
    },
  },
  Remark: {
    opinion: async (_) => {
      const myOpinion = await opinion.getOpinion(_?.opinionId);
      return myOpinion;
    },
    author: async (_, args) => {
      return await member.getMember(_.authorId);
    },
  },
  Member: {
    user: async (_) => {
      return await user.getUser(_.userId);
    },
    // team: async (_, args, { req }: { req: RequestWithUserInfo }) => {
    //   const { id, isAdmin } = req?.user;
    //   return await team.getTeam(_.teamId, isAdmin ? undefined : id);
    // },
  },
};

export default resolvers;
