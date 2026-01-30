import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './testimonial.schema';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<TestimonialDocument>,
  ) { }

  // Public: Get only visible testimonials, sorted by order
  async findAllPublic(): Promise<Testimonial[]> {
    return this.testimonialModel
      .find({ isVisible: true })
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
        .sort({ order: 1, createdAt: -1 })
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
