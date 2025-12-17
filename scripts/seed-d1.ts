import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { execSync } from 'child_process';

const BATCH_SIZE = 100; // D1 HTTP API limit is cautious, 100-500 is safe
const DB_NAME = "bin-db"; // Your D1 Database Name from wrangler.toml
const CSV_PATH = path.join(process.cwd(), 'src/data/bin-list-data.csv');

async function seed() {
  console.log("🚀 Starting D1 Seed Process...");

  const parser = fs
    .createReadStream(CSV_PATH)
    .pipe(parse({
      columns: true, // Auto-discover headers
      skip_empty_lines: true,
      trim: true
    }));

  let batch: any[] = [];
  let totalInserted = 0;

  for await (const row of parser) {
    // Map CSV columns to generic clean names
    const cleanRow = {
      bin: row['BIN'],
      brand: row['Brand'],
      type: row['Type'],
      category: row['Category'],
      issuer: row['Issuer'],
      issuer_phone: row['IssuerPhone'],
      issuer_url: row['IssuerUrl'],
      iso_code_2: row['isoCode2'],
      iso_code_3: row['isoCode3'],
      country_name: row['CountryName']
    };

    batch.push(cleanRow);

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(batch);
      totalInserted += batch.length;
      process.stdout.write(`\r✅ Inserted ${totalInserted} rows...`);
      batch = [];
    }
  }

  // Insert remaining
  if (batch.length > 0) {
    await insertBatch(batch);
    totalInserted += batch.length;
  }

  console.log(`\n🎉 proper finish! Total rows: ${totalInserted}`);
}

async function insertBatch(rows: any[]) {
  // Construct SQL INSERT statement
  // We use JSON serialization to handle escaping quotes safely for the CLI
  const values = rows.map(r => 
    `('${r.bin}', '${escapeSql(r.brand)}', '${escapeSql(r.type)}', '${escapeSql(r.category)}', '${escapeSql(r.issuer)}', '${escapeSql(r.issuer_phone)}', '${escapeSql(r.issuer_url)}', '${escapeSql(r.iso_code_2)}', '${escapeSql(r.iso_code_3)}', '${escapeSql(r.country_name)}')`
  ).join(",\n");

  const sql = `INSERT OR IGNORE INTO bins (bin, brand, type, category, issuer, issuer_phone, issuer_url, iso_code_2, iso_code_3, country_name) VALUES ${values};`;

  try {
    // Execute via Wrangler CLI
    // Note: In a production CI/CD, you might use the HTTP API directly, 
    // but for "when I deploy" scripts, execSync is the easiest path.
    execSync(`npx wrangler d1 execute ${DB_NAME} --command "${sql.replace(/"/g, '\\"')}" --remote`, { stdio: 'pipe' });
  } catch (error) {
    console.error("❌ Batch failed. Continuing...");
    // console.error(error); // Uncomment for verbose logging
  }
}

function escapeSql(str: string) {
  if (!str) return "";
  return str.replace(/'/g, "''"); // SQL escape for single quote
}

seed().catch(console.error);
