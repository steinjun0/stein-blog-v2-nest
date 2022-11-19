import { DataSource } from "typeorm"
import * as dotenv from 'dotenv'

dotenv.config({path: '.development.env'})

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.host,
    port: parseInt(process.env.port),
    username: process.env.username,
    password: process.env.password,
    database: process.env.database,
    migrations: ["dist/migrations/*{.ts,.js}"],
    migrationsTableName: "custom_migration_table",
    entities: ['src/**/*.entity.{js,ts}']
  })

//   cli: {
//     migrationsDir: "src/migrations" 
// },

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource