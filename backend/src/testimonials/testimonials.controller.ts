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
import { UserJwtGuard } from '../user-auth/guards/user-jwt.guard';
import { CurrentUser } from '../user-auth/decorator/get-curr-user.decorator';
import { User } from '../user/models/user.schema';
import { TestimonialStatus } from './testimonial.schema';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) { }

  // Public Endpoint - no auth required
  @Get('public')
  findAllPublic() {
    return this.testimonialsService.findAllPublic();
  }

  // Student Endpoint - submit a testimonial
  @Post('submit')
  @UseGuards(UserJwtGuard)
  submitTestimonial(
    @CurrentUser() user: User,
    @Body() body: { content: string; rating: number },
  ) {
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student';
    return this.testimonialsService.submitTestimonial(
      user._id.toString(),
      userName,
      body,
    );
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

  // Admin: approve or reject a testimonial
  @Patch('admin/:id/status')
  @UseGuards(AdminJwtGuard, AdminRoleGuard)
  @AdminRoles(AdminRole.SUPER, AdminRole.MANAGER)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: TestimonialStatus,
  ) {
    return this.testimonialsService.updateStatus(id, status);
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
