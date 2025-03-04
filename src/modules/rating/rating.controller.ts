import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role, User } from '@prisma/client';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { ActiveUser } from '../auth/decorators/session.decorator';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RESPONSE_FORBIDDEN_403,
  RESPONSE_UNAUTHORIZED_401,
} from '../common/docs/responses';
import {
  RESPONSE_CONFLICT_DELETE_RATING_409,
  RESPONSE_CONFLICT_RATING_409,
  RESPONSE_CREATE_RATING_201,
  RESPONSE_DELETE_RATING,
  RESPONSE_FIND_ALL_RATINGS_BY_PARKING,
  RESPONSE_FIND_ONE_RATING,
  RESPONSE_NOT_FOUND_RATING,
} from './docs/responses';

@ApiTags('Calificaciones')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
@ApiResponse({
  status: 401,
  description: 'No autorizado',
  example: RESPONSE_UNAUTHORIZED_401,
})
@ApiResponse({
  status: 403,
  description: 'Prohibido',
  example: RESPONSE_FORBIDDEN_403,
})
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('rating')
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  @ApiOperation({ summary: 'Registrar calificación' })
  @ApiBody({ type: CreateRatingDto })
  @ApiResponse({ status: 201, example: RESPONSE_CREATE_RATING_201 })
  @ApiResponse({ status: 409, example: RESPONSE_CONFLICT_RATING_409 })
  @ResponseMessage('Calificación creada con exito')
  createOrUpdate(
    @Body() createRatingDto: CreateRatingDto,
    @ActiveUser() user: User,
  ) {
    return this.ratingService.createOrUpdateRating(createRatingDto, user);
  }

  @Get('rating/parkingLot/:parkingLotId')
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  @ApiOperation({ summary: 'Obtener calificaciones por parqueadero' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ALL_RATINGS_BY_PARKING })
  @ResponseMessage('Calificaciones obtenidas con exito')
  findAllByParkingId(
    @Param('parkingLotId') parkingLotId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.ratingService.findAllByParkingId(
      parkingLotId,
      Number(page),
      Number(limit),
    );
  }

  @Get('rating/:ratingId')
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  @ApiOperation({ summary: 'Obtener calificacion por id' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ONE_RATING })
  @ApiResponse({ status: 404, example: RESPONSE_NOT_FOUND_RATING })
  @ResponseMessage('Calificacion obtenida con exito')
  findOne(@Param('ratingId') ratingId: string) {
    return this.ratingService.findOne(ratingId);
  }

  @Delete('user/:userId/rating/:ratingId')
  @Auth([Role.ADMIN, Role.OWNER, Role.USER])
  @ApiResponse({ status: 200, example: RESPONSE_DELETE_RATING })
  @ApiResponse({ status: 409, example: RESPONSE_CONFLICT_DELETE_RATING_409 })
  @ApiResponse({ status: 404, example: RESPONSE_NOT_FOUND_RATING })
  @ResponseMessage('Calificacion eliminada')
  remove(
    @Param('userId') userId: string,
    @Param('ratingId') ratingId: string,
    @ActiveUser() user: User,
  ) {
    return this.ratingService.remove(userId, ratingId, user);
  }
}
