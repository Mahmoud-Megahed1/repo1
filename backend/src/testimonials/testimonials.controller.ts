import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRoleGuard } from '../admin-auth/guards/admin-roles.guard';
import { AdminRoles } from '../admin-auth/decorators/admin-roles.decorator';
import { AdminRole } from '../common/shared/enums/role.enum';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) { }

  // Public Endpoint - no auth required
  @Get('public')
  findAllPublic() {
    return this.testimonialsService.findAllPublic();
  }

  // Admin Endpoints - requires SUPER or MANAGER role
  @Get('admin')
  @UseGuards(AdminJwtGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
  findAllAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('query') query: string = '',
  ) {
    return this.testimonialsService.findAllAdmin(page, limit, query);
  }

  @Get('admin/:id')
  @UseGuards(AdminJwtGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Post('admin')
  @UseGuards(AdminJwtGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
  create(@Body() createTestimonialDto: any) {
    return this.testimonialsService.create(createTestimonialDto);
  }

  @Patch('admin/:id')
  @UseGuards(AdminJwtGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
  update(@Param('id') id: string, @Body() updateTestimonialDto: any) {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @Delete('admin/:id')
  @UseGuards(AdminJwtGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
