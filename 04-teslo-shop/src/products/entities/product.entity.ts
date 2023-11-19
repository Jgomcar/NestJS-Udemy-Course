// representación de nuestro objeto en la base de datos
import { User } from "../../auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({ 
        example: '229cd311-f521-4357-877f-85feec12bba5',
        description: 'Product id',
        uniqueItems: true
     })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ 
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
     })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({ 
        example: 0,
        description: 'Product Price',
     })
    @Column('float',{
        default: 0,
    })
    price: number;

    @ApiProperty({ 
        example: 'Description',
        description: 'Product Description',
     })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({ 
        example: 'T-Shirt Teslo',
        description: 'Product SLUG - for SEO routes',
        uniqueItems: true
     })
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty({ 
        example: 10,
        description: 'Product stock',
        default: 0
     })
    @Column('int',{
        default: 0,
    })
    stock: number;

    @ApiProperty({ 
        example: ['M', 'XL', 'XXL'],
        description: 'Product size'
     })
    @Column('text', {
        array: true,
    })
    sizes: string[]

    @ApiProperty({ 
        example: 'man',
        description: 'Product gender'
     })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]
    
    
    // images
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        ( productImage ) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){
        
        if ( !this.slug ){
            this.slug = this.title
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", "");
        }
        
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", "");
    }   

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", "");
    }
}
