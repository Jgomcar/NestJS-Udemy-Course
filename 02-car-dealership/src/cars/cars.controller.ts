import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {

    constructor(
        private readonly CarsService: CarsService
    ) {}

    @Get()
    getAllCars() {
        return this.CarsService.findAll();
    }

    @Get(':id')
    getCarById( @Param('id', new ParseUUIDPipe({ version: '4' }) ) id: string ) {
        return this.CarsService.findOneByIdd( id );
    }

    @Post()
    createCar( @Body() body: any ) {
        return body;
    }

    @Patch(':id')
    updateCar( 
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: any ) 
        {
        return body;
    }

    @Delete(':id')
    deleteCar( @Param('id', ParseUUIDPipe ) id: string ) {
        return {
            method: 'delete',
            id: 'id'
        }
    }
}