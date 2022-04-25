import { checkIsMemberOfTeam } from './essential';
import prisma from './../prisma';
import error from '../errorsManagement';
import { Criteria, Member } from '@prisma/client';

type cachedValue = {
  criteria: Criteria;
  sum: number;
  count: number;
  avg: number;
};

export const analysisAssessment = async (
  meId: string,
  args: { teamId: string; assessmentId: string; memberId: string },
) => {
  const memberOfTeam = await checkIsMemberOfTeam(args?.teamId, meId);

  if (!(memberOfTeam?.isSuperOwner || memberOfTeam?.isOwner)) {
    if (memberOfTeam?.id !== args?.memberId) return error?.Forbidden();
  }

  const assessment = await prisma?.assessment?.findUnique({
    where: {
      id: args?.assessmentId,
    },
    include: {
      creator: true,
      evaluations: {
        where: {
          isSubmit: true,
          results: {
            some: {
              concerningMemberId: args?.memberId,
            },
          },
        },
        include: {
          assessor: {
            include: {
              user: true,
            },
          },
          results: {
            where: {
              concerningMemberId: args?.memberId,
            },
            include: {
              concerningMember: {
                include: {
                  user: true,
                },
              },
              answerOnCriteriaList: {
                include: {
                  criteria: true,
                },
                orderBy: {
                  criteriaId: 'asc',
                },
              },
            },
            orderBy: {
              concerningMemberId: 'asc',
            },
          },
        },
      },
    },
    rejectOnNotFound: true,
  });

  const areaRadarChartData: { isSubmit: boolean; criteria: Criteria; assessor: Member; point: number }[] = [];
  const cachedData = new Map<string, cachedValue>();

  for (let index = 0; index < assessment?.evaluations?.length; index++) {
    const evaluation = assessment?.evaluations[index];
    for (let z = 0; z < evaluation?.results[0]?.answerOnCriteriaList?.length; z++) {
      const answer = evaluation?.results[0]?.answerOnCriteriaList[z];
      const data: cachedValue | undefined = cachedData.get(answer.criteriaId);
      if (!data) {
        cachedData.set(`${answer?.criteriaId}`, {
          criteria: answer.criteria,
          sum: answer.point || 0,
          count: 1,
          avg: (answer.point || 0) / 1,
        });
      } else {
        const sum = data?.sum + (answer?.point || 0);
        const count = data?.count ? data.count + 1 : 1;
        cachedData.set(`${answer?.criteriaId}`, {
          criteria: answer?.criteria,
          sum,
          count,
          avg: parseFloat((parseFloat(sum.toString()) / parseFloat(count.toString())).toFixed(2)),
        });
      }

      areaRadarChartData.push({
        isSubmit: evaluation.isSubmit,
        criteria: answer.criteria,
        assessor: evaluation?.assessor,
        point: answer?.point || 0,
      });
    }
  }

  const rosePlotChartData: cachedValue[] = [];
  for (const x of cachedData?.values()) {
    rosePlotChartData.push({ ...x });
  }

  return {
    areaRadarChartData,
    rosePlotChartData,
  };
};
