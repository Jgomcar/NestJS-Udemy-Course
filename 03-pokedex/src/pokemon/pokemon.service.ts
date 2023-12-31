import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(

    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,

  ){
    //console.log(process.env.DEFAULT_LIMIT);
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();


    try {

      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {

      this.handleExceptions(error)
      
    }
  }

  findAll( paginationDto: PaginationDto ) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    // Número
    if( !isNaN(+id) ) pokemon = await this.pokemonModel.findOne( { no: id } );

    // MongoId
    else if( isValidObjectId( id ) ) pokemon = await this.pokemonModel.findById( id );
    
    // Name
    else if ( !pokemon ) pokemon = await this.pokemonModel.findOne( { name: id.toLowerCase().trim() } );

    // Pokemon Not Found 
    if ( !pokemon ) {
      throw new NotFoundException(`Pokemon with id, name or term ${id} not found.`);}

    return pokemon;
  } 

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon: Pokemon = await this.findOne( id );
    if( updatePokemonDto.name ) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
        
      await pokemon.updateOne( updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete( id );

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if( deletedCount === 0 ){
      throw new BadRequestException(`Pokemon with id "${ id }" not found`)
    }

    return;

  }

  private handleExceptions( error: any ) {
    if( error.code === 11000 ){
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs.`);
  }
}
