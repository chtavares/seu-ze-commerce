import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { AppModule } from '../src/app.module';

let testingModule: TestingModule;
let app: INestApplication;

export async function getTestingModule() {
  if (!testingModule) {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    useContainer(testingModule, { fallback: true, fallbackOnErrors: true });

    app = testingModule.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        validationError: {
          value: false,
          target: false,
        },
      }),
    );

    await app.init();
  }
  return { module: testingModule, app };
}

export function returnIds(entities: any[]): string[] {
  return entities.map(({ id }) => id);
}
