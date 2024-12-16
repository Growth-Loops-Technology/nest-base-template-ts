import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { User } from './user.schema';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  private googleClient: OAuth2Client;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    // Initialize OAuth2Client dynamically using the Google client ID from the environment variables
    const googleClientId = process.env.GOOGLE_CLIENT_ID; // Make sure you have this in your .env file
    if (!googleClientId) {
      throw new Error('Google Client ID is missing from environment variables');
    }
    this.googleClient = new OAuth2Client(googleClientId);
  }

  // Find a user by ID
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  // Find a user by email and include password (if necessary for login)
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  // Register a new user and ensure email uniqueness
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = new this.userModel({
      ...createUserDto,
    });
    return newUser.save();
  }

  // Retrieve all users from the database
  async getAllUsers(): Promise<User[]> {
    const users = this.userModel.find();
    return users;
  }

  // Verify the Google ID token and return the user's payload
  async verifyGoogleIdToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Use environment variable for client ID
      });
      return ticket.getPayload();
    } catch (error) {
      console.error('Error verifying Google ID token:', error);
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }

  // Find or create a user using Google authentication data
  async findOrCreateUser(userData: any): Promise<User> {
    const { email, name } = userData;

    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = await this.userModel.create({
        email,
        name: name,
        // lastName: family_name,
        // picture,
        provider: 'Google',
        isEmailVerified: true,
      });
    }

    return user;
  }
}
