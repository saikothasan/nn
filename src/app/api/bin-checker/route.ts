import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Force Node.js runtime to allow file system access (fs)
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const binInput = searchParams.get('bin');

    if (!binInput) {
      return NextResponse.json(
        { error: 'Please provide a "bin" query parameter.' },
        { status: 400 }
      );
    }

    // Sanitize input: remove non-digits and take the first 6 characters
    const bin = binInput.replace(/\D/g, '').substring(0, 6);

    if (bin.length < 6) {
      return NextResponse.json(
        { error: 'BIN must contain at least 6 digits.' },
        { status: 400 }
      );
    }

    // Construct path to the CSV file
    // Note: process.cwd() typically points to the project root
    const csvPath = path.join(process.cwd(), 'src/data/bin-list-data.csv');

    // Check if the file exists before attempting to read
    if (!fs.existsSync(csvPath)) {
      console.error(`BIN data file not found at: ${csvPath}`);
      return NextResponse.json(
        { error: 'Database source not found.' },
        { status: 500 }
      );
    }

    // Read the CSV file
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse the CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Find the record matching the BIN
    const match = records.find((record: any) => record.BIN === bin);

    if (match) {
      return NextResponse.json({
        success: true,
        data: {
          bin: match.BIN,
          brand: match.Brand,
          type: match.Type,
          category: match.Category,
          issuer: match.Issuer,
          issuer_phone: match.IssuerPhone,
          issuer_url: match.IssuerUrl,
          country: {
            name: match.CountryName,
            iso2: match.isoCode2,
            iso3: match.isoCode3,
          },
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'BIN not found in database.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in bin-checker API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
