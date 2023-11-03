import { BadGatewayException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  
    getStaticProductImage( imageName: string ) {
        // console.log('start getStaticProductImage');
        const path = join( __dirname, '../../static/products', imageName);
        // console.log(`path value: ${path}`)
        if ( !existsSync(path) ) throw new BadGatewayException(`No product found with image ${ imageName }`) ;

        return path

    }

}
