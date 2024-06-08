import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PRODUCT_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto).pipe(
      catchError( err => { throw new RpcException(err) })
    )
  }

  @Get()
  findAllProductos(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, paginationDto).pipe(
      catchError( err => { throw new RpcException(err) })
    )
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError( err => { throw new RpcException(err) })
    );
    // try {      
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id })
    //   );
    //   return product;

    // } catch (error) {
    //   throw new RpcException(error);      
    // }
  }

  @Delete(':id')
  deleteProducto(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError( err => { throw new RpcException(err) })
    )
  }

  @Patch(':id')  
  patchProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {    
    return this.productsClient.send({ cmd: 'update_product' }, { id,...updateProductDto }).pipe(
      catchError( err => { throw new RpcException(err) })
    );
  }

  

}
