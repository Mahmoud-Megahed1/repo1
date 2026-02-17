// src/modules/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role, UserStatus } from '../../common/shared';
import { AbstractUser } from '../../common/models/abstract-user.model';
import { Strategy } from 'src/common/shared/enums';

@Schema({ timestamps: true, versionKey: false })
export class User extends AbstractUser {
  @Prop({ enum: Strategy, default: Strategy.LOCAL, required: true })
  strategy: Strategy;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ default: false })
  hasSeenChatWelcome: boolean;

  @Prop({ default: false })
  isSubscribed: boolean;

  @Prop({ enum: Role, default: Role.USER })
  role: Role;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ type: Date })
  suspendedAt?: Date;

  @Prop({ type: String })
  suspensionReason?: string;

  @Prop({ type: String })
  activeSessionId?: string;

  // --- Inactivity & Voluntary Pause System ---
  @Prop({ type: Boolean, default: false })
  hasUsedInactivityGrace: boolean; // One-time 15-day automatic pause preservation

  @Prop({ type: Boolean, default: false })
  isVoluntaryPaused: boolean;

  @Prop({ type: Date })
  pauseStartedAt?: Date;

  @Prop({ type: Date })
  pauseScheduledEndDate?: Date;

  @Prop({ type: Number, default: 0 })
  voluntaryPauseAttempts: number; // Max 2

  @Prop({ type: Number, default: 0 })
  totalPausedDays: number; // Max 20 total

  @Prop({
    type: [
      {
        start: { type: Date },
        end: { type: Date },
        reason: { type: String },
        isVoluntary: { type: Boolean },
      },
    ],
    default: [],
  })
  pauseHistory: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);
