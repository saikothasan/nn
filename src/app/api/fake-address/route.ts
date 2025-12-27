import { NextRequest, NextResponse } from 'next/server';
import { allFakers, type Faker } from '@faker-js/faker';

// Define the comprehensive response shape
export interface FakeIdentity {
  identity: {
    firstName: string;
    lastName: string;
    fullName: string;
    gender: string;
    birthday: Date;
    avatar: string;
  };
  location: {
    street: string;
    buildingNumber: string;
    city: string;
    zipCode: string;
    country: string;
    countryCode: string;
    state: string;
    latitude: number;
    longitude: number;
    fullAddress: string;
    timeZone: string;
  };
  internet: {
    email: string;
    username: string;
    ip: string;
    mac: string;
    userAgent: string;
    domainName: string;
    url: string;
  };
  finance: {
    accountName: string;
    accountNumber: string;
    iban: string;
    bic: string;
    creditCardNumber: string;
    creditCardCVV: string;
    currencyName: string;
    currencyCode: string;
  };
  job: {
    title: string;
    company: string;
    department: string;
  };
  contact: {
    phone: string;
    imei: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { locale = 'en' } = body as { locale: string };

    // 1. Select the correct Locale Instance
    // fallback to 'en' if the requested locale isn't found
    const fakerInstance = (allFakers[locale as keyof typeof allFakers] || allFakers.en) as Faker;

    // 2. Generate Data using Common APIs
    const data: FakeIdentity = {
      identity: {
        firstName: fakerInstance.person.firstName(),
        lastName: fakerInstance.person.lastName(),
        fullName: fakerInstance.person.fullName(),
        gender: fakerInstance.person.sexType(),
        birthday: fakerInstance.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        avatar: fakerInstance.image.avatar(),
      },
      location: {
        street: fakerInstance.location.streetAddress(),
        buildingNumber: fakerInstance.location.buildingNumber(),
        city: fakerInstance.location.city(),
        zipCode: fakerInstance.location.zipCode(),
        country: fakerInstance.location.country(),
        countryCode: fakerInstance.location.countryCode(),
        state: fakerInstance.location.state(),
        latitude: fakerInstance.location.latitude(),
        longitude: fakerInstance.location.longitude(),
        fullAddress: fakerInstance.location.streetAddress({ useFullAddress: true }),
        timeZone: fakerInstance.location.timeZone(),
      },
      internet: {
        email: fakerInstance.internet.email(),
        username: fakerInstance.internet.username(),
        ip: fakerInstance.internet.ipv4(),
        mac: fakerInstance.internet.mac(),
        userAgent: fakerInstance.internet.userAgent(),
        domainName: fakerInstance.internet.domainName(),
        url: fakerInstance.internet.url(),
      },
      finance: {
        accountName: fakerInstance.finance.accountName(),
        accountNumber: fakerInstance.finance.accountNumber(),
        iban: fakerInstance.finance.iban(),
        bic: fakerInstance.finance.bic(),
        creditCardNumber: fakerInstance.finance.creditCardNumber(),
        creditCardCVV: fakerInstance.finance.creditCardCVV(),
        currencyName: fakerInstance.finance.currencyName(),
        currencyCode: fakerInstance.finance.currencyCode(),
      },
      job: {
        title: fakerInstance.person.jobTitle(),
        company: fakerInstance.company.name(),
        department: fakerInstance.commerce.department(),
      },
      contact: {
        phone: fakerInstance.phone.number(),
        imei: fakerInstance.phone.imei(),
      }
    };

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Faker Generation Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to generate identity', details: errorMessage }, 
      { status: 500 }
    );
  }
}
