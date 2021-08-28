import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ProductRepository } from '../product/entities/product.repository';
import { expect } from 'chai';
import { getTestingModule, returnIds } from '../../test/utils';
import * as faker from 'faker';

describe('ProductController', () => {
  let module: TestingModule;
  let app: INestApplication;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const testModule = await getTestingModule();
    module = testModule.module;
    app = testModule.app;

    productRepository = module.get(ProductRepository);
  });

  afterEach(async () => {
    const product = await productRepository.find();
    if (product.length !== 0) {
      await productRepository.delete(returnIds(product));
    }
  });

  describe('GET /products/:name', () => {
    it('should return product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const response = await request(app.getHttpServer())
        .get(`/products/${productName}`)
        .expect(200);

      expect(response.body.name).to.be.equal(productName);
      expect(response.body.quantity).to.be.equal(6);
      expect(response.body.price).to.be.equal(5.65);
    });

    it('should return 404', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const fakeName = faker.commerce.product();
      const response = await request(app.getHttpServer())
        .get(`/products/${fakeName}`)
        .expect(404);

      expect(response.body.message).to.be.equal(
        `Product ${fakeName} not found!`,
      );
    });
  });
});
