/**
 * Seed Sakila database into PGlite at data/uploads/sakila.db/
 * Recreates the full Sakila schema and sample data in PostgreSQL-compatible format.
 * Run: bun scripts/seed-sakila-pglite.ts
 */
import { PGlite } from "@electric-sql/pglite";
import { join } from "node:path";
import { rmSync, existsSync } from "node:fs";

const DATA_DIR = join(import.meta.dir, "../data/uploads/sakila.db");

// Remove stale lock file if present
const pidFile = join(DATA_DIR, "postmaster.pid");
if (existsSync(pidFile)) {
  rmSync(pidFile);
  console.log("Removed stale postmaster.pid");
}

console.log(`Connecting to PGlite at: ${DATA_DIR}`);
const db = new PGlite(DATA_DIR);
await db.waitReady;
console.log("PGlite ready");

// ── Schema ────────────────────────────────────────────────────────────────────

await db.query(`
  CREATE TABLE IF NOT EXISTS language (
    language_id SERIAL PRIMARY KEY,
    name CHAR(20) NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS actor (
    actor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name  VARCHAR(45) NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS film (
    film_id          SERIAL PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    release_year     INTEGER,
    language_id      INTEGER NOT NULL DEFAULT 1,
    rental_duration  INTEGER NOT NULL DEFAULT 3,
    rental_rate      NUMERIC(4,2) NOT NULL DEFAULT 4.99,
    length           INTEGER,
    replacement_cost NUMERIC(5,2) NOT NULL DEFAULT 19.99,
    rating           VARCHAR(5) DEFAULT 'G',
    special_features TEXT,
    last_update      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS film_actor (
    actor_id    INTEGER NOT NULL,
    film_id     INTEGER NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (actor_id, film_id)
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS film_category (
    film_id     INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (film_id, category_id)
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS country (
    country_id  SERIAL PRIMARY KEY,
    country     VARCHAR(50) NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS city (
    city_id     SERIAL PRIMARY KEY,
    city        VARCHAR(50) NOT NULL,
    country_id  INTEGER NOT NULL DEFAULT 1,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS address (
    address_id  SERIAL PRIMARY KEY,
    address     VARCHAR(50) NOT NULL,
    address2    VARCHAR(50),
    district    VARCHAR(20) NOT NULL,
    city_id     INTEGER NOT NULL DEFAULT 1,
    postal_code VARCHAR(10),
    phone       VARCHAR(20) NOT NULL DEFAULT '',
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS store (
    store_id          SERIAL PRIMARY KEY,
    manager_staff_id  INTEGER NOT NULL,
    address_id        INTEGER NOT NULL DEFAULT 1,
    last_update       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS staff (
    staff_id    SERIAL PRIMARY KEY,
    first_name  VARCHAR(45) NOT NULL,
    last_name   VARCHAR(45) NOT NULL,
    address_id  INTEGER NOT NULL DEFAULT 1,
    email       VARCHAR(50),
    store_id    INTEGER NOT NULL DEFAULT 1,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    username    VARCHAR(16) NOT NULL,
    password    VARCHAR(40),
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS customer (
    customer_id  SERIAL PRIMARY KEY,
    store_id     INTEGER NOT NULL DEFAULT 1,
    first_name   VARCHAR(45) NOT NULL,
    last_name    VARCHAR(45) NOT NULL,
    email        VARCHAR(50),
    address_id   INTEGER NOT NULL DEFAULT 1,
    active       BOOLEAN NOT NULL DEFAULT TRUE,
    create_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_update  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS inventory (
    inventory_id  SERIAL PRIMARY KEY,
    film_id       INTEGER NOT NULL,
    store_id      INTEGER NOT NULL DEFAULT 1,
    last_update   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS rental (
    rental_id    SERIAL PRIMARY KEY,
    rental_date  TIMESTAMP NOT NULL,
    inventory_id INTEGER NOT NULL,
    customer_id  INTEGER NOT NULL,
    return_date  TIMESTAMP,
    staff_id     INTEGER NOT NULL DEFAULT 1,
    last_update  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.query(`
  CREATE TABLE IF NOT EXISTS payment (
    payment_id   SERIAL PRIMARY KEY,
    customer_id  INTEGER NOT NULL,
    staff_id     INTEGER NOT NULL DEFAULT 1,
    rental_id    INTEGER,
    amount       NUMERIC(5,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    last_update  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Schema created");

// ── Helper ────────────────────────────────────────────────────────────────────

async function count(table: string): Promise<number> {
  const r = await db.query(`SELECT COUNT(*) as n FROM ${table}`);
  return Number((r.rows[0] as any).n);
}

// ── Language ──────────────────────────────────────────────────────────────────

if ((await count("language")) === 0) {
  const languages = ["English","Italian","Japanese","Mandarin","French","German"];
  for (const name of languages) {
    await db.query("INSERT INTO language (name) VALUES ($1)", [name]);
  }
  console.log(`Inserted ${languages.length} languages`);
}

// ── Categories ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Action","Animation","Children","Classics","Comedy","Documentary",
  "Drama","Family","Foreign","Games","Horror","Music","New","Sci-Fi",
  "Sports","Travel",
];
if ((await count("category")) === 0) {
  for (const name of CATEGORIES) {
    await db.query("INSERT INTO category (name) VALUES ($1)", [name]);
  }
  console.log(`Inserted ${CATEGORIES.length} categories`);
}

// ── Actors ────────────────────────────────────────────────────────────────────

const ACTORS = [
  ["PENELOPE","GUINESS"],["NICK","WAHLBERG"],["ED","CHASE"],["JENNIFER","DAVIS"],
  ["JOHNNY","LOLLOBRIGIDA"],["BURT","NICHOLSON"],["GRACE","MOSTEL"],["MATTHEW","JOHANSSON"],
  ["JOE","SWANK"],["CHRISTIAN","GABLE"],["ZERO","CAGE"],["KARL","BERRY"],
  ["UMA","WOOD"],["VIVIEN","BERGEN"],["CUBA","OLIVIER"],["FRED","COSTNER"],
  ["HELEN","VOIGHT"],["DAN","TORN"],["BOB","FAWCETT"],["LUCILLE","TRACY"],
  ["KIRSTEN","PALTROW"],["ELVIS","MARX"],["SANDRA","KILMER"],["CAMERON","STREEP"],
  ["KEVIN","BLOOM"],["RIP","CRAWFORD"],["JULIA","MCQUEEN"],["WOODY","HOFFMAN"],
  ["ALEC","WAYNE"],["SANDRA","PECK"],["SISSY","SOBIESKI"],["TIM","HACKMAN"],
  ["MILLA","PECK"],["AUDREY","OLIVIER"],["JUDY","DEAN"],["BURT","DUKAKIS"],
  ["VAL","BOLGER"],["TOM","MCKELLEN"],["GOLDIE","BRODY"],["JOHNNY","LEIGH"],
  ["JODIE","DEGENERES"],["TOM","MIRANDA"],["KIRK","JOVOVICH"],["ANGELA","WITHERSPOON"],
  ["REESE","KILMER"],["PARKER","GOLDBERG"],["JULIA","ZELLWEGER"],["FRANCES","DAY-LEWIS"],
  ["ANNE","CRONYN"],["GARY","PENN"],
];
if ((await count("actor")) === 0) {
  for (const [first, last] of ACTORS) {
    await db.query("INSERT INTO actor (first_name, last_name) VALUES ($1, $2)", [first, last]);
  }
  console.log(`Inserted ${ACTORS.length} actors`);
}

// ── Films ─────────────────────────────────────────────────────────────────────

const FILMS = [
  ["ACADEMY DINOSAUR","Epic Drama of a Feminist and a Mad Scientist",86,0.99,20.99,"G",1],
  ["ACE GOLDFINGER","A Astounding Epistle of a Database Administrator",48,4.99,12.99,"G",1],
  ["ADAPTATION HOLES","A Astounding Reflection of a Lumberjack",50,2.99,18.99,"NC-17",1],
  ["AFFAIR PREJUDICE","A Fanciful Documentary of a Frisbee",117,2.99,26.99,"G",1],
  ["AFRICAN EGG","A Fast-Paced Documentary of a Pastry Chef",130,2.99,22.99,"G",1],
  ["AGENT TRUMAN","An Amazing Panorama of a Dog",169,2.99,17.99,"PG",1],
  ["AIRPLANE SIERRA","A Touching Saga of a Hunter",62,4.99,28.99,"PG-13",1],
  ["AIRPORT POLLOCK","A Epic Tale of a Moose",54,4.99,15.99,"R",1],
  ["ALABAMA DEVIL","A Thoughtful Panorama of a Database Administrator",114,2.99,23.99,"PG-13",1],
  ["ALADDIN CALENDAR","A Action-Packed Tale of a Man",63,4.99,29.99,"NC-17",1],
  ["ALAMO VIDEOTAPE","A Boring Epistle of a Butler",120,0.99,24.99,"G",1],
  ["ALASKA PHANTOM","A Fanciful Saga of a Hunter",136,0.99,22.99,"PG",1],
  ["ALI FOREVER","A Action-Packed Drama of a Dentist",150,4.99,21.99,"PG",1],
  ["ALICE FANTASIA","A Amazing Drama of a Technical Writer",94,0.99,23.99,"NC-17",1],
  ["ALIEN CENTER","A Brilliant Drama of a Cat",46,2.99,10.99,"NC-17",1],
  ["ALLEY EVOLUTION","A Fast-Paced Drama of a Robot",180,2.99,23.99,"NC-17",1],
  ["ALONE TRIP","A Fast-Paced Character Study of a Composer",82,0.99,14.99,"R",1],
  ["ALTER VICTORY","A Thoughtful Drama of a Composer",57,0.99,27.99,"PG-13",1],
  ["AMADEUS HOLY","A Emotional Display of a Pioneer",113,0.99,20.99,"PG",1],
  ["AMELIE HELLFIGHTERS","A Boring Side Tale of a Woman",79,4.99,19.99,"R",1],
  ["AMERICAN CIRCUS","A Insightful Drama of a Girl",129,4.99,17.99,"R",1],
  ["AMISTAD MIDSUMMER","A Emotional Character Study of a Dentist",85,2.99,21.99,"G",1],
  ["ANACONDA CONFESSIONS","A Lacklusture Display of a Dentist",92,0.99,9.99,"R",1],
  ["ANALYZE HOOSIERS","A Thoughtful Display of a Explorer",181,2.99,19.99,"R",1],
  ["ANGELS LIFE","A Thoughtful Display of a Woman",74,2.99,26.99,"G",1],
  ["ANNIE IDENTITY","A Amazing Panorama of a Pastry Chef",86,0.99,26.99,"G",1],
  ["ANONYMOUS HUMAN","A Amazing Reflection of a Database Administrator",179,0.99,11.99,"NC-17",1],
  ["ANTARCTICA DAVID","A Beautiful Reflection of a Moose",52,4.99,25.99,"G",1],
  ["ANTITRUST TOMATOES","A Fateful Yarn of a Womanizer",168,2.99,11.99,"NC-17",1],
  ["ANYTHING SAVANNAH","A Epic Story of a Pastry Chef",82,2.99,27.99,"R",1],
];
if ((await count("film")) === 0) {
  for (const [title, desc, len, rate, cost, rating, langId] of FILMS) {
    await db.query(
      "INSERT INTO film (title, description, length, rental_rate, replacement_cost, rating, language_id, release_year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [title, desc, len, rate, cost, rating, langId, 2006]
    );
  }
  console.log(`Inserted ${FILMS.length} films`);
}

// ── film_actor ────────────────────────────────────────────────────────────────

if ((await count("film_actor")) === 0) {
  const filmCount = await count("film");
  const actorCount = await count("actor");
  // Assign 3-6 actors per film
  for (let filmId = 1; filmId <= filmCount; filmId++) {
    const numActors = 3 + (filmId % 4);
    const usedActors = new Set<number>();
    for (let j = 0; j < numActors; j++) {
      let actorId = ((filmId * 7 + j * 13) % actorCount) + 1;
      while (usedActors.has(actorId)) actorId = (actorId % actorCount) + 1;
      usedActors.add(actorId);
      await db.query(
        "INSERT INTO film_actor (actor_id, film_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
        [actorId, filmId]
      );
    }
  }
  console.log("Inserted film_actor associations");
}

// ── film_category ─────────────────────────────────────────────────────────────

if ((await count("film_category")) === 0) {
  const filmCount = await count("film");
  const catCount = await count("category");
  for (let filmId = 1; filmId <= filmCount; filmId++) {
    const catId = ((filmId - 1) % catCount) + 1;
    await db.query(
      "INSERT INTO film_category (film_id, category_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [filmId, catId]
    );
  }
  console.log("Inserted film_category associations");
}

// ── Geography ─────────────────────────────────────────────────────────────────

if ((await count("country")) === 0) {
  const countries = ["United States","Canada","United Kingdom","Australia","Germany","France","Japan","India","Brazil","Mexico"];
  for (const c of countries) await db.query("INSERT INTO country (country) VALUES ($1)", [c]);
  console.log(`Inserted ${countries.length} countries`);
}

if ((await count("city")) === 0) {
  const cities = [
    ["New York",1],["Los Angeles",1],["Chicago",1],["Houston",1],["Phoenix",1],
    ["Toronto",2],["Vancouver",2],["London",3],["Manchester",3],["Sydney",4],
    ["Berlin",5],["Paris",6],["Tokyo",7],["Mumbai",8],["São Paulo",9],["Mexico City",10],
  ];
  for (const [city, countryId] of cities) {
    await db.query("INSERT INTO city (city, country_id) VALUES ($1,$2)", [city, countryId]);
  }
  console.log(`Inserted ${cities.length} cities`);
}

if ((await count("address")) === 0) {
  const addrs = [
    ["47 MySakila Drive","","Alberta",1,""],
    ["28 MySQL Boulevard","","QLD",2,""],
    ["23 Workhaven Lane","","Alberta",3,""],
    ["1411 Lillydale Drive","","QLD",4,""],
    ["1913 Hanoi Way","","Nagasaki",5,"35200"],
    ["1121 Loja Avenue","","California",6,"17886"],
    ["692 Joliet Street","","Attika",7,"83579"],
    ["1135 Izumisano Parkway","","Saitama",8,"10769"],
    ["692 Joliet Street","","Attika",1,""],
    ["28 MySQL Boulevard","","QLD",2,""],
  ];
  for (const [addr, addr2, district, cityId, postal] of addrs) {
    await db.query(
      "INSERT INTO address (address, address2, district, city_id, postal_code) VALUES ($1,$2,$3,$4,$5)",
      [addr, addr2, district, cityId, postal]
    );
  }
  console.log(`Inserted ${addrs.length} addresses`);
}

// ── Stores & Staff ────────────────────────────────────────────────────────────

if ((await count("store")) === 0) {
  await db.query("INSERT INTO store (manager_staff_id, address_id) VALUES (1, 1)");
  await db.query("INSERT INTO store (manager_staff_id, address_id) VALUES (2, 2)");
  console.log("Inserted 2 stores");
}

if ((await count("staff")) === 0) {
  await db.query(
    "INSERT INTO staff (first_name, last_name, address_id, email, store_id, username, password) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    ["Mike","Hillyer",3,"Mike.Hillyer@sakilastaff.com",1,"Mike","8cb2237d0679ca88db6464eac60da96345513964"]
  );
  await db.query(
    "INSERT INTO staff (first_name, last_name, address_id, email, store_id, username, password) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    ["Jon","Stephens",4,"Jon.Stephens@sakilastaff.com",2,"Jon",""]
  );
  console.log("Inserted 2 staff");
}

// ── Customers ─────────────────────────────────────────────────────────────────

const FIRST_NAMES = ["MARY","PATRICIA","LINDA","BARBARA","ELIZABETH","JENNIFER","MARIA","SUSAN","MARGARET","DOROTHY",
  "JAMES","JOHN","ROBERT","MICHAEL","WILLIAM","DAVID","RICHARD","CHARLES","JOSEPH","THOMAS",
  "LISA","NANCY","KAREN","BETTY","HELEN","SANDRA","DONNA","CAROL","RUTH","SHARON",
  "DANIEL","PAUL","MARK","DONALD","GEORGE","KENNETH","STEVEN","EDWARD","BRIAN","RONALD",
  "MICHELLE","LAURA","SARAH","KIMBERLY","DEBORAH","JESSICA","SHIRLEY","CYNTHIA","ANGELA","MELISSA"];
const LAST_NAMES = ["SMITH","JOHNSON","WILLIAMS","BROWN","JONES","GARCIA","MILLER","DAVIS","RODRIGUEZ","MARTINEZ",
  "HERNANDEZ","LOPEZ","GONZALEZ","WILSON","ANDERSON","THOMAS","TAYLOR","MOORE","JACKSON","MARTIN",
  "LEE","PEREZ","THOMPSON","WHITE","HARRIS","SANCHEZ","CLARK","RAMIREZ","LEWIS","ROBINSON",
  "WALKER","YOUNG","ALLEN","KING","WRIGHT","SCOTT","TORRES","NGUYEN","HILL","FLORES",
  "GREEN","ADAMS","NELSON","BAKER","HALL","RIVERA","CAMPBELL","MITCHELL","CARTER","ROBERTS"];

if ((await count("customer")) === 0) {
  for (let i = 0; i < 200; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last  = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length] || LAST_NAMES[i % LAST_NAMES.length];
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@sakilacustomer.org`;
    const storeId = (i % 2) + 1;
    const addrId  = (i % 8) + 1;
    const createDate = new Date(2006, 1, (i % 28) + 1).toISOString();
    await db.query(
      "INSERT INTO customer (store_id, first_name, last_name, email, address_id, create_date) VALUES ($1,$2,$3,$4,$5,$6)",
      [storeId, first, last, email, addrId, createDate]
    );
  }
  console.log("Inserted 200 customers");
}

// ── Inventory ─────────────────────────────────────────────────────────────────

if ((await count("inventory")) === 0) {
  const filmCount = await count("film");
  for (let filmId = 1; filmId <= filmCount; filmId++) {
    const copies = 2 + (filmId % 4); // 2-5 copies per film
    for (let copy = 0; copy < copies; copy++) {
      const storeId = (copy % 2) + 1;
      await db.query(
        "INSERT INTO inventory (film_id, store_id) VALUES ($1,$2)",
        [filmId, storeId]
      );
    }
  }
  console.log("Inserted inventory");
}

// ── Rentals & Payments ────────────────────────────────────────────────────────

if ((await count("rental")) === 0) {
  const invCount   = await count("inventory");
  const custCount  = await count("customer");
  const numRentals = 1000;

  for (let i = 0; i < numRentals; i++) {
    const invId    = ((i * 17) % invCount) + 1;
    const custId   = ((i * 11) % custCount) + 1;
    const staffId  = (i % 2) + 1;
    const rDay     = (i % 28) + 1;
    const rMonth   = (Math.floor(i / 28) % 6) + 1;
    const rentalDate = new Date(2005, rMonth, rDay, (i % 24), (i * 7) % 60, 0);
    const returnDate = new Date(rentalDate.getTime() + (3 + (i % 7)) * 86400000);

    const r = await db.query(
      `INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id, return_date)
       VALUES ($1,$2,$3,$4,$5) RETURNING rental_id`,
      [rentalDate.toISOString(), invId, custId, staffId, returnDate.toISOString()]
    );
    const rentalId = (r.rows[0] as any).rental_id;

    // Get film's rental rate for realistic payment amount
    const invRow = await db.query("SELECT film_id FROM inventory WHERE inventory_id=$1", [invId]);
    const filmId = (invRow.rows[0] as any)?.film_id ?? 1;
    const filmRow = await db.query("SELECT rental_rate FROM film WHERE film_id=$1", [filmId]);
    const rate = Number((filmRow.rows[0] as any)?.rental_rate ?? 2.99);
    const amount = (rate * (1 + (i % 3))).toFixed(2);

    const payDate = new Date(rentalDate.getTime() + (i % 5) * 86400000);
    await db.query(
      `INSERT INTO payment (customer_id, staff_id, rental_id, amount, payment_date)
       VALUES ($1,$2,$3,$4,$5)`,
      [custId, staffId, rentalId, parseFloat(amount), payDate.toISOString()]
    );
  }
  console.log(`Inserted ${numRentals} rentals and payments`);
}

// ── Summary ───────────────────────────────────────────────────────────────────

const tables = ["language","actor","category","film","film_actor","film_category",
                "country","city","address","store","staff","customer","inventory","rental","payment"];
console.log("\nSakila PGlite database ready:");
for (const t of tables) {
  const n = await count(t);
  console.log(`  ${t.padEnd(16)} ${n} rows`);
}

await db.close();
console.log("\nDone. Run 'bun run db:seed' to register the data source.");
