import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema,
    }), // Aquí se define el uso de variables de entorno, archivo .env en la raíz del proyecto, no subido a github

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public'),
    }),

    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'pokemondb'
    }),

    PokemonModule,

    CommonModule,

    SeedModule
  ],
})
export class AppModule {
  constructor(){
    //console.log(process.env)
  }
}
