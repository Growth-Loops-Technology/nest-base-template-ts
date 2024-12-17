import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserType } from 'src/common/enum/user.enum';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ select: false })
  password: string | null;

  @Prop({
    type: String,
    enum: UserType,
    default: UserType.USER,
  })
  userType: UserType;

  @Prop({
    type: String,
    default: 'user', // Default value for provider
  })
  provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
