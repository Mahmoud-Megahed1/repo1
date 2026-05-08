import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Testimonial, TestimonialDocument, TestimonialStatus } from './testimonial.schema';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<TestimonialDocument>,
  ) { }

  // Public: Get only visible AND approved testimonials, sorted by order
  async findAllPublic(): Promise<Testimonial[]> {
    return this.testimonialModel
      .find({ isVisible: true, status: TestimonialStatus.APPROVED })
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  // Admin: Get all testimonials with pagination and search
  async findAllAdmin(page: number = 1, limit: number = 10, query: string = ''): Promise<{ testimonials: Testimonial[]; totalPages: number; totalDocs: number }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ];
    }

    const [testimonials, totalDocs] = await Promise.all([
      this.testimonialModel
        .find(filter)
        .populate({ path: 'userId', select: 'firstName lastName email' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.testimonialModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return { testimonials, totalPages, totalDocs };
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialModel.findById(id).lean().exec();
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  }

  async create(createTestimonialDto: any): Promise<Testimonial> {
    const createdTestimonial = new this.testimonialModel(createTestimonialDto);
    return createdTestimonial.save();
  }

  /**
   * Student submits a testimonial (status = pending, needs admin approval)
   */
  async submitTestimonial(userId: string, userName: string, data: { content: string; rating: number }): Promise<Testimonial> {
    if (!data.content || !data.rating) {
      throw new BadRequestException('Content and rating are required');
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if student already has a pending testimonial
    const existing = await this.testimonialModel.findOne({
      userId: new Types.ObjectId(userId),
      status: TestimonialStatus.PENDING,
    });
    if (existing) {
      throw new BadRequestException('You already have a pending testimonial');
    }

    const testimonial = new this.testimonialModel({
      name: userName,
      content: data.content,
      rating: data.rating,
      role: 'Student',
      userId: new Types.ObjectId(userId),
      status: TestimonialStatus.PENDING,
      isVisible: false,
    });

    return testimonial.save();
  }

  /**
   * Admin approves or rejects a testimonial
   */
  async updateStatus(id: string, status: TestimonialStatus): Promise<Testimonial> {
    const update: any = { status };
    if (status === TestimonialStatus.APPROVED) {
      update.isVisible = true;
    } else if (status === TestimonialStatus.REJECTED) {
      update.isVisible = false;
    }

    const testimonial = await this.testimonialModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  }

  async update(id: string, updateTestimonialDto: any): Promise<Testimonial> {
    const updatedTestimonial = await this.testimonialModel
      .findByIdAndUpdate(id, updateTestimonialDto, { new: true })
      .exec();

    if (!updatedTestimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return updatedTestimonial;
  }

  async remove(id: string): Promise<void> {
    const result = await this.testimonialModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
  }

  async count(): Promise<number> {
    return this.testimonialModel.countDocuments().exec();
  }
}
