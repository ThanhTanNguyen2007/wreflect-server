import { default as Board } from './Board/boardTypeDef';
import { default as Column } from './Column/columnTypeDefs';
import { default as Member } from './memberTypeDefs';
import { default as Mutations } from './mutations';
import { default as Subscription } from './subscription';
import { default as Opinion } from './opinionTypeDefs';
import { default as Profile } from './profileTypeDefs';
import { default as Queries } from './queries';
import { default as Remark } from './remarkTypeDefs';
import { default as Team } from './teamTypeDefs';
import { default as User } from './userTypeDefs';
import { default as HealthCheck } from './HealthCheck/healthCheckTypeDefs';
import { default as MemberAnswer } from './memberAnswersTypeDefs';
import { default as MemberComment } from './memberCommentsTypeDefs';
import { default as Answer } from './Answer/answerTypeDef';
import { default as Assessment } from './Assessment/assessmentTypeDef';
import { default as Evaluation } from './Evaluation/evaluationTypeDef';
import { default as Criteria } from './Criteria/criteriaTypeDefs';
import { default as Result } from './resultTypeDefs';
import { default as AnswerOnCriteria } from './answerOnCriteriaTypeDefs';
import { default as Notification } from './notificationTypeDefs';
import { default as RemiderNotification } from './remiderNotificationTypeDefs';
import { default as UserOnCriteria } from './userOnCriteriaTypeDefs';

export default [
  Answer,
  Queries,
  Mutations,
  Subscription,
  Board,
  Column,
  Member,
  Opinion,
  Profile,
  Remark,
  Team,
  User,
  HealthCheck,
  MemberAnswer,
  MemberComment,
  Assessment,
  Evaluation,
  Criteria,
  Result,
  AnswerOnCriteria,
  Notification,
  RemiderNotification,
  UserOnCriteria,
];
