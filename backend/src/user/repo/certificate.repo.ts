import { Injectable } from '@nestjs/common';
import { AbstractRepo } from '../../common/database/repo/abstract.repo';
import { Certification } from '../models/certification.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CertificateRepo extends AbstractRepo<Certification> {
  constructor(
    @InjectModel(Certification.name)
    private readonly certificateModel: Model<Certification>,
  ) {
    super(certificateModel);
  }

  // OVERRIDE METHODS TO DISABLE THEM TO ACCESS THROW CERTIFICATE REPO

  async findOneAndUpdate(): Promise<Certification | null> {
    throw new Error('Method not allowed on CertificateRepo');
  }

  async findOneAndDelete(): Promise<Certification | null> {
    throw new Error('Method not allowed on CertificateRepo');
  }

  async deleteCertificatesForLevel(
    userId: string | Types.ObjectId,
    levelName: string,
    session?: ClientSession,
  ) {
    // Convert userId to ObjectId if string
    const userIdObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    return await this.certificateModel.deleteMany(
      { userId: userIdObjectId, level_name: levelName },
      { session: session || null },
    );
  }
}
