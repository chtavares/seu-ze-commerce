import { TestingModule } from '@nestjs/testing';
import { getTestingModule, returnIds } from '../../test/utils';
import * as faker from 'faker';
import { expect } from 'chai';
import { RabbitMQService } from './rabbitmq.service';
import { ProductRepository } from '../product/entities/product.repository';

describe('RabbitMqService', () => {
  let module: TestingModule;
  let productRepository: ProductRepository;
  let rabbitMqService: RabbitMQService;

  beforeEach(async () => {
    const testModule = await getTestingModule();
    module = testModule.module;

    productRepository = module.get(ProductRepository);
    rabbitMqService = module.get(RabbitMQService);
  });

  afterEach(async () => {
    const product = await productRepository.find();
    if (product.length !== 0) {
      await productRepository.delete(returnIds(product));
    }
  });

  describe('Test incrementedHandler function', () => {
    it('should increment product quantity', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const returned = await rabbitMqService.incrementedHandler(productName);

      expect(returned).to.be.true;

      const updatedProduct = await productRepository.findOneOrFail({
        name: productName,
      });

      expect(updatedProduct).to.not.be.undefined;
      expect(updatedProduct.name).to.be.equal(productName);
      expect(updatedProduct.price).to.be.equal(5.65);
      expect(updatedProduct.quantity).to.be.equal(7);
    });

    it('should not increment product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const returned = await rabbitMqService.incrementedHandler(
        faker.commerce.product(),
      );

      expect(returned).to.be.false;
    });

    it('should not increment product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: -1,
      });

      const returned = await rabbitMqService.incrementedHandler(productName);

      expect(returned).to.be.false;
    });
  });

  describe('Test decrementedHandler function', () => {
    it('should decrement product quantity', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const returned = await rabbitMqService.decrementedHandler(productName);

      expect(returned).to.be.true;

      const updatedProduct = await productRepository.findOneOrFail({
        name: productName,
      });

      expect(updatedProduct).to.not.be.undefined;
      expect(updatedProduct.name).to.be.equal(productName);
      expect(updatedProduct.price).to.be.equal(5.65);
      expect(updatedProduct.quantity).to.be.equal(5);
    });

    it('should not decrement product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 0,
      });

      const returned = await rabbitMqService.decrementedHandler(productName);

      expect(returned).to.be.false;
    });

    it('should not decrement product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: -1,
      });

      const returned = await rabbitMqService.decrementedHandler(
        faker.commerce.product(),
      );

      expect(returned).to.be.false;
    });
  });
});
