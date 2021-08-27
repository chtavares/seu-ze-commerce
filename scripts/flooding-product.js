const mysql2 = require('mysql2');
const fs = require('fs');
const util = require('util');
const papa = require('papaparse');

const configs = {
  development: {
    db: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'seuzecommerce',
    },
  },
  production: {},
};

const isProduction = process.env.NODE_ENV === 'development';
const config = isProduction ? configs.production : configs.development;

const conn = mysql2.createConnection({
  host: config.db.host,
  user: config.db.user,
  port: config.db.port,
  password: config.db.password,
  database: config.db.database,
  debug:
    process.env.SQL_DEBUG === 'true'
      ? ['ComQueryPacket', 'RowDataPacket']
      : undefined,
});
conn.connect();

const beginTransaction = util.promisify(conn.beginTransaction).bind(conn);
const query = util.promisify(conn.query).bind(conn);
const commit = util.promisify(conn.commit).bind(conn);
const rollback = util.promisify(conn.rollback).bind(conn);

const floodingProductTable = async () => {
  const products = await query(`SELECT * FROM product;`);
  if (products.length > 0) {
    return;
  }

  const productCsv = fs.readFileSync('scripts/products.csv');

  const { data } = papa.parse(productCsv.toString(), { header: true });

  const valuesToInsert = data.map(
    ({ name, price, quantity }) =>
      `(UUID(),'${name}',${Number(price)},${Number(quantity)})`,
  );

  console.log(valuesToInsert.join(','));

  await query(
    `INSERT INTO product (id,name,price,quantity) VALUES ${valuesToInsert.join(
      ',',
    )};`,
  );
};

const main = async () => {
  await floodingProductTable();
};

(async () => {
  try {
    await beginTransaction();
    await main();
    await commit();
    conn.end();
  } catch (err) {
    console.log('Failed to run: ', err);
    await rollback();
  }
})();
