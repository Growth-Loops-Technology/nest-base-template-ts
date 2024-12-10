import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionType } from 'src/session/session.schema';
import { Class } from 'src/class/class.schema';
import { Location } from 'src/location/location.schema';
import { Staff } from 'src/staff/staff.schema';
import { Client } from 'src/client/client.schema';
import { Membership } from 'src/membership/membership.schema';
import { Program } from 'src/program/program.schema';
import { Purchase } from 'src/purchase/purchase.schema';

@Injectable()
export class FetchDataService {
  private readonly api = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.API_KEY,
      SiteId: process.env.SITE_ID,
      Authorization: process.env.AUTHORIZATION,
    },
  });

  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<Class>,
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
    @InjectModel(Staff.name) private readonly staffModel: Model<Staff>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
    @InjectModel(Membership.name)
    private readonly membershipModel: Model<Membership>,
    @InjectModel(Program.name) private readonly programModel: Model<Program>,
    @InjectModel(Purchase.name) private readonly purchaseModel: Model<Purchase>,
    @InjectModel(SessionType.name)
    private readonly sessionTypeModel: Model<SessionType>,
  ) {}
  async fetchAndStoreAllData(): Promise<void> {
    try {
      console.log('Starting to fetch and store data...');
      const endpoints = [
        { name: 'Classes', url: '/class/classes?limit=100&offset=0' },
        { name: 'Locations', url: '/site/locations?limit=100&offset=0' },
        { name: 'Staff', url: '/staff/staff' },
        { name: 'Clients', url: '/client/clients' },
        { name: 'Memberships', url: '/membership/memberships' },
        { name: 'Programs', url: '/program/programs' },
        { name: 'Purchases', url: '/purchase/purchases' },
        { name: 'SessionTypes', url: '/session/types' },
      ];
      const responses = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            console.log(`Fetching ${endpoint.name} from ${endpoint.url}...`);
            const response = await this.api.get(endpoint.url);
            console.log(
              `${endpoint.name} fetched successfully! Status: ${response.status}`,
            );
            return response.data;
          } catch (error) {
            console.error(`Error fetching ${endpoint.name}:`, error.message);
            throw error; // Re-throw the error to handle it globally
          }
        }),
      );
      console.log(
        'All API calls completed successfully, starting to store data...',
      );
      const allData = {
        classes: responses[0].data.Items,
        locations: responses[1].data.Items,
        staff: responses[2].data,
        clients: responses[3].data,
        memberships: responses[4].data,
        programs: responses[5].data,
        purchases: responses[6].data,
        sessionTypes: responses[7].data,
      };

      const tasks = [
        this.storeClasses(allData.classes),
        this.storeLocations(allData.locations),
        this.storeStaff(allData.staff),
        this.storeClients(allData.clients),
        this.storeMemberships(allData.memberships),
        this.storePrograms(allData.programs),
        this.storePurchases(allData.purchases),
        this.storeSessionTypes(allData.sessionTypes),
      ];

      await Promise.all(tasks);
      console.log('All data fetched and stored successfully!');
    } catch (error) {
      console.error('Error while fetching all data:', error.message);
    }
  }

  private async storeClasses(classes: any[]): Promise<void> {
    try {
      console.log('Storing Classes...');
      for (const cls of classes) {
        const mappedClass = {
          classId: cls.ClassScheduleId,
          description: cls.Description,
          staffId: cls.Staff?.Id,
          sessionTypeId: cls.SessionType?.Id,
          locationId: cls.Location?.Id,
        };
        console.log(`Storing class: ${JSON.stringify(mappedClass)}`);
        await this.classModel.updateOne(
          { _id: mappedClass.classId },
          mappedClass,
          { upsert: true },
        );
      }
      console.log('Classes stored successfully!');
    } catch (error) {
      console.error('Error storing Classes:', error.message);
    }
  }

  private async storeLocations(locations: any[]): Promise<void> {
    for (const loc of locations) {
      const mappedLocation = {
        locationId: loc.Id,
        name: loc.Name,
        address: loc.Address,
        phone: loc.Phone,
      };
      await this.locationModel.updateOne(
        { _id: mappedLocation.locationId },
        mappedLocation,
        { upsert: true },
      );
    }
    console.log('Locations stored successfully!');
  }

  private async storeStaff(staff: any): Promise<void> {
    const mappedStaff = {
      staffId: staff.Id,
      firstName: staff.FirstName,
      lastName: staff.LastName,
      displayName: staff.DisplayName,
      bio: staff.Bio,
      imageUrl: staff.ImageUrl,
      empId: staff.EmpId,
    };
    await this.staffModel.updateOne({ _id: mappedStaff.staffId }, mappedStaff, {
      upsert: true,
    });
    console.log('Staff stored successfully!');
  }

  private async storeClients(clients: any): Promise<void> {
    const mappedClient = {
      clientId: clients.Id,
      firstName: clients.FirstName,
      lastName: clients.LastName,
      email: clients.Email,
    };
    await this.clientModel.updateOne(
      { _id: mappedClient.clientId },
      mappedClient,
      { upsert: true },
    );
    console.log('Clients stored successfully!');
  }

  private async storeMemberships(memberships: any): Promise<void> {
    for (const membership of memberships) {
      const mappedMembership = {
        membershipId: membership.Id,
        startDate: membership.StartDate,
        endDate: membership.EndDate,
        clientId: membership.Client?.Id,
        locationId: membership.Location?.Id,
      };
      await this.membershipModel.updateOne(
        { _id: mappedMembership.membershipId },
        mappedMembership,
        { upsert: true },
      );
    }
    console.log('Memberships stored successfully!');
  }

  private async storePrograms(programs: any): Promise<void> {
    for (const program of programs) {
      const mappedProgram = {
        programId: program.Id,
        name: program.Name,
      };
      await this.programModel.updateOne(
        { _id: mappedProgram.programId },
        mappedProgram,
        { upsert: true },
      );
    }
    console.log('Programs stored successfully!');
  }

  private async storePurchases(purchases: any): Promise<void> {
    for (const purchase of purchases) {
      const mappedPurchase = {
        purchaseId: purchase.Id,
        amount: purchase.Amount,
        date: purchase.Date,
        details: purchase.Details,
        clientId: purchase.Client?.Id,
      };
      await this.purchaseModel.updateOne(
        { _id: mappedPurchase.purchaseId },
        mappedPurchase,
        { upsert: true },
      );
    }
    console.log('Purchases stored successfully!');
  }

  private async storeSessionTypes(sessionTypes: any): Promise<void> {
    for (const sessionType of sessionTypes) {
      const mappedSessionType = {
        sessionTypeId: sessionType.Id,
        name: sessionType.Name,
        duration: sessionType.Duration,
        locationId: sessionType.Location?.Id,
        staffId: sessionType.Staff?.Id,
      };
      await this.sessionTypeModel.updateOne(
        { _id: mappedSessionType.sessionTypeId },
        mappedSessionType,
        { upsert: true },
      );
    }
    console.log('Session types stored successfully!');
  }

  private async fetchAndStoreData<T>(
    endpoint: string,
    model: Model<T>,
    mapResponse: (item: any) => Partial<T>,
  ): Promise<void> {
    try {
      const { data } = await this.api.get(endpoint);
      const items = data.Items || data; // Handle different response structures

      for (const item of items) {
        const mappedItem = mapResponse(item);
        await model.updateOne({ _id: mappedItem['id'] }, mappedItem, {
          upsert: true,
        });
      }
      console.log(`${model.modelName} stored successfully!`);
    } catch (error) {
      if (error.response) {
        console.error(
          `Error fetching ${model.modelName}:`,
          error.response.status,
          error.response.data,
        );
      } else if (error.request) {
        console.error(
          `Error fetching ${model.modelName}: No response received`,
          error.request,
        );
      } else {
        console.error(`Error fetching ${model.modelName}:`, error.message);
      }
    }
  }
}
