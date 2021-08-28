import { TestingModule } from '@nestjs/testing';
import { getTestingModule, returnIds } from '../../test/utils';
import { ProductRepository } from './entities/product.repository';
import { ProductService } from './product.service';
import * as faker from 'faker';
import { expect } from 'chai';
import { ERabbitmqRouteKey } from '../rabbitMQ/etc/types';

describe('ProductService', () => {
  let module: TestingModule;
  let productRepository: ProductRepository;
  let productService: ProductService;

  beforeEach(async () => {
    const testModule = await getTestingModule();
    module = testModule.module;

    productRepository = module.get(ProductRepository);
    productService = module.get(ProductService);
  });

  afterEach(async () => {
    const product = await productRepository.find();
    if (product.length !== 0) {
      await productRepository.delete(returnIds(product));
    }
  });

  describe('Test findOneByNameAndThereIsQuantity function', () => {
    it('should return product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const product = await productService.findOneByNameAndThereIsQuantity(
        productName,
        6,
      );

      expect(product).to.not.be.undefined;
      expect(product.name).to.be.equal(productName);
      expect(product.price).to.be.equal(5.65);
      expect(product.quantity).to.be.equal(6);
    });

    it('should not return product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const product = await productService.findOneByNameAndThereIsQuantity(
        productName,
        7,
      );

      expect(product).to.be.undefined;
    });
  });

  describe('Test update function', () => {
    it('should update product', async () => {
      const productName = faker.commerce.product();
      const product = await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      await productService.update(product.id, { quantity: 1 });

      const updatedProduct = await productRepository.findOneOrFail({
        id: product.id,
      });

      expect(updatedProduct).to.not.be.undefined;
      expect(updatedProduct.name).to.be.equal(productName);
      expect(updatedProduct.price).to.be.equal(5.65);
      expect(updatedProduct.quantity).to.be.equal(1);
    });

    it('should not update product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      expect(await productService.update(faker.random.uuid(), { quantity: 1 }))
        .to.be.throw;
    });
  });

  describe('Test handleStockProduct function', () => {
    it('should increment product quantity', async () => {
      const productName = faker.commerce.product();
      const product = await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const returned = await productService.handleStockProduct(
        productName,
        ERabbitmqRouteKey.INCREMENTED,
      );

      expect(returned).to.be.true;

      const updatedProduct = await productRepository.findOneOrFail({
        id: product.id,
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

      const returned = await productService.handleStockProduct(
        faker.commerce.product(),
        ERabbitmqRouteKey.INCREMENTED,
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

      const returned = await productService.handleStockProduct(
        productName,
        ERabbitmqRouteKey.INCREMENTED,
      );

      expect(returned).to.be.false;
    });

    it('should decrement product quantity', async () => {
      const productName = faker.commerce.product();
      const product = await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const returned = await productService.handleStockProduct(
        productName,
        ERabbitmqRouteKey.DECREMENTED,
      );

      expect(returned).to.be.true;

      const updatedProduct = await productRepository.findOneOrFail({
        id: product.id,
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

      const returned = await productService.handleStockProduct(
        productName,
        ERabbitmqRouteKey.DECREMENTED,
      );

      expect(returned).to.be.false;
    });

    it('should not decrement product', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: -1,
      });

      const returned = await productService.handleStockProduct(
        faker.commerce.product(),
        ERabbitmqRouteKey.DECREMENTED,
      );

      expect(returned).to.be.false;
    });
  });
});
