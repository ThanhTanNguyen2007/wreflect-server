import { Result } from '@prisma/client';

export type createAssessmentType = {
  teamId: string;
  nameAssessment: string;
  startDate: string;
  endDate: string;
  criteriaList: string[];
  memberIds: string[];
  assessmentId?: string;
};

export enum sortAssessmentsByEnum {
  NAME,
  DATE,
  STATUS,
}

export enum orderWithEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export type getAssessmentsArg = {
  teamId: string;
  isGettingAll?: boolean;
  search?: string;
  sortBy?: sortAssessmentsByEnum;
  orderWith?: orderWithEnum;
  page?: number;
  size?: number;
};

export type getAssessmentArgs = {
  teamId: string;
  assessmentId: string;
};

export type submitDoPersonalReflection = {
  teamId: string;
  assessmentId: string;
  assessorId: string;
  results: {
    id: string;
    concerningMemberId: string;
    answerOnCriteriaList: {
      id: string;
      criteriaId: string;
      point: number;
      comment: string;
    }[];
  }[];
};
