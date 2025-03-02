import { PrismaClient, GlobalStatus } from '@prisma/client';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });

    this.$use(async (params, next) => {
      if (!params.args) {
        return next(params);
      }

      if (params.model) {
        if (params.action === 'delete') {
          params.action = 'update';
          params.args.data = { globalStatus: GlobalStatus.DELETED };
        }
        if (params.action === 'deleteMany') {
          params.action = 'updateMany';
          params.args.data = {
            ...(params.args.data || {}),
            globalStatus: GlobalStatus.DELETED,
          };
        }
      }

      if (params.action === 'findUnique') {
        params.action = 'findFirst';
      }

      if (['findUnique', 'findFirst', 'findMany'].includes(params.action)) {
        if (!params.args.where) {
          params.args.where = {};
        }

        if (params.args.where.globalStatus === undefined) {
          params.args.where = {
            AND: [
              params.args.where,
              {
                globalStatus: {
                  notIn: [GlobalStatus.DELETED, GlobalStatus.ARCHIVED],
                },
              },
            ],
          };
        }
      }

      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
