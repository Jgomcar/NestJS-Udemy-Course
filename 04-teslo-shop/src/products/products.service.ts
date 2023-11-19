import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ){}

  async create(createProductDto: CreateProductDto, user: User) {
    
    try {

      // if( !createProductDto.slug ){
      //   createProductDto.slug = createProductDto.title
      //   .toLowerCase()
      //   .replaceAll(' ', '_')
      //   .replaceAll("'", "'");
      // } else  {
      //   createProductDto.slug = createProductDto.slug
      //   .toLowerCase()
      //   .replaceAll(' ', '_')
      //   .replaceAll("'", "'");
      // }
      
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image }) ), // aqui se hace la relacion entre tablas automaticamente.
        user: user
      });

      await this.productRepository.save( product );
      
      return {...product, images};

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return products.map( product => ({
      ...product,
      images: product.images.map( img => img.url)
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      // product = await this.productRepository.findOneBy({ slug: term })

      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

    }
    
    //const product = await this.productRepository.findOneBy({ id });
    
    if( !product ) throw new NotFoundException(`Product with id '${term}' not found.`);

    return product;
  }

  async findOneClean( term: string ) {
    const {images = [] , ...rest } = await this.findOne( term );
    return {
      ...rest, 
      images: images.map( image => image.url )
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    
    const { images, ...toUpdate } = updateProductDto;


    const product = await this.productRepository.preload({ id, ...toUpdate });

    if ( !product ) throw new NotFoundException(`Product with id "${id}" not found`);
    
    // Create query runner: pq tenemos que borrar las imagenes si vienen nuevas.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if( images ) {
        // Con esto borramos las imagenes anteriores
        await queryRunner.manager.delete( ProductImage, { product: { id } }); // criterio por id
        product.images = images.map( 
          image => this.productImageRepository.create({ url: image }) )
      }

      product.user = user;

      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();    //commit de la transaccion
      await queryRunner.release();              // deshacerse del queryrunner

      // await this.productRepository.save( product );
      return this.findOneClean( id );

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne( id );

    await this.productRepository.remove( product );
  }

  private handleDBExceptions( error: any ){
    if( error.code === '23505' )
        throw new BadRequestException(error.detail);

      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
      .delete()
      .where({})
      .execute();
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

}
