import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { OrderRepository } from './entities/order.repository';
import { OrderProductRepository } from './entities/order-products.repository';
import { ProductRepository } from '../product/entities/product.repository';
import { expect } from 'chai';
import { getTestingModule, returnIds } from '../../test/utils';
import * as faker from 'faker';

describe('OrderController', () => {
  let module: TestingModule;
  let app: INestApplication;
  let orderRepository: OrderRepository;
  let orderProductRepository: OrderProductRepository;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const testModule = await getTestingModule();
    module = testModule.module;
    app = testModule.app;

    orderRepository = module.get(OrderRepository);
    orderProductRepository = module.get(OrderProductRepository);
    productRepository = module.get(ProductRepository);
  });

  afterEach(async () => {
    const [orderProducts, order, product] = await Promise.all([
      orderProductRepository.find(),
      orderRepository.find(),
      productRepository.find(),
    ]);

    if (orderProducts.length != 0) {
      await orderProductRepository.delete(returnIds(orderProducts));
    }
    if (order.length !== 0) {
      await orderRepository.delete(returnIds(order));
    }
    if (product.length !== 0) {
      await productRepository.delete(returnIds(product));
    }
  });

  describe('GET /orders/:id', () => {
    it('should return order', async () => {
      const productName = faker.commerce.product();
      const product = await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const order = await orderRepository.save({ total: 0 });
      await orderProductRepository.save({ order, product, quantity: 1 });
      await orderRepository.update(order.id, { total: 5.65 });

      const response = await request(app.getHttpServer())
        .get(`/orders/${order.id}`)
        .expect(200);

      expect(response.body.total).to.be.equal(5.65);
      expect(response.body.products.length).to.be.equal(1);
      expect(response.body.products[0].name).to.be.equal(productName);
      expect(response.body.products[0].quantity).to.be.equal(1);
      expect(response.body.products[0].price).to.be.equal(5.65);
    });

    it('should return 404', async () => {
      const productName = faker.commerce.product();
      const product = await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const order = await orderRepository.save({ total: 0 });
      await orderProductRepository.save({ order, product, quantity: 1 });
      await orderRepository.update(order.id, { total: 5.65 });

      const fakerId = faker.random.uuid();
      const response = await request(app.getHttpServer())
        .get(`/orders/${fakerId}`)
        .expect(404);

      expect(response.body.message).to.be.equal(
        `Order id: ${fakerId} not found!`,
      );
    });
  });

  describe('GET /orders', () => {
    it('should return two orders', async () => {
      const productName = faker.commerce.product();
      const product1 = await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const order1 = await orderRepository.save({ total: 0 });
      await orderProductRepository.save({
        order: order1,
        product: product1,
        quantity: 1,
      });
      await orderRepository.update(order1.id, { total: 5.65 });
      const order2 = await orderRepository.save({ total: 0 });
      await orderProductRepository.save({
        order: order2,
        product: product1,
        quantity: 3,
      });
      await orderRepository.update(order2.id, { total: 16.95 });

      const response = await request(app.getHttpServer())
        .get(`/orders/`)
        .expect(200);

      expect(response.body.length).to.be.equal(2);

      const [body0, body1] = response.body;

      expect(body0.total).to.be.equal(16.95);
      expect(body0.products.length).to.be.equal(1);
      expect(body0.products[0].name).to.be.equal(productName);
      expect(body0.products[0].quantity).to.be.equal(3);
      expect(body0.products[0].price).to.be.equal(5.65);
      expect(body1.total).to.be.equal(5.65);
      expect(body1.products.length).to.be.equal(1);
      expect(body1.products[0].name).to.be.equal(productName);
      expect(body1.products[0].quantity).to.be.equal(1);
      expect(body1.products[0].price).to.be.equal(5.65);
    });

    it('should return nothing', async () => {
      const response = await request(app.getHttpServer())
        .get(`/orders`)
        .expect(200);

      expect(response.body.length).to.be.equal(0);
    });
  });

  describe('POST /orders', () => {
    it('should return order', async () => {
      const productName = faker.commerce.product();
      const product = await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 6,
      });

      const createdOrder = {
        products: [{ name: productName, quantity: 2 }],
      };

      const response = await request(app.getHttpServer())
        .post(`/orders/`)
        .send(createdOrder)
        .expect(201);

      expect(response.body).to.not.be.undefined;
      expect(response.body.products.length).to.equal(1);
      expect(response.body.products[0].name).to.equal(productName);
      expect(response.body.products[0].price).to.equal(product.price);
      expect(response.body.products[0].quantity).to.equal(2);
      expect(response.body.total).to.equal(product.price * 2);
    });

    it('should return 400', async () => {
      const productName = faker.commerce.product();
      await productRepository.save({
        price: 5.65,
        name: productName,
        quantity: 1,
      });

      const createdOrder = {
        products: [{ name: productName, quantity: 2 }],
      };

      const response = await request(app.getHttpServer())
        .post(`/orders/`)
        .send(createdOrder)
        .expect(400);

      expect(response.body).to.not.be.undefined;
      expect(response.body.message).to.equal(
        `There is not sufficient product ${productName} quantity`,
      );
    });
  });
});
