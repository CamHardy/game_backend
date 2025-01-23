# For The Quest backend 

This project uses an Express server as an API for the PostGresQL database.

## TODO: 
- [ ] turso dropped support for sequelize, either migrate to a new ORM or find a new DBaaS
- [ ] change POST update requests to their correct PUT & PATCH equivalents

## Running Locally

Make sure to have your database running, then copy .env.example to .env and update the values appropriately.

```bash
npm install
```

### Production

```bash
npm run start
```

### Development

```bash
npm run dev
```

## API Reference

A Restfox reference for the API has been included in the root directory.
