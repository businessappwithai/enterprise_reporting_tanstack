import { PGlite } from "@electric-sql/pglite";
import { join } from "node:path";

const dbPath = join(import.meta.dir, "../data/uploads");

console.log("🚀 Seeding Sakila database...");

const db = new PGlite(dbPath);
await db.waitReady;

try {
  // Create actor table
  await db.query(`
    CREATE TABLE IF NOT EXISTS actor (
      actor_id SERIAL PRIMARY KEY,
      first_name VARCHAR(45) NOT NULL,
      last_name VARCHAR(45) NOT NULL,
      last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create film table
  await db.query(`
    CREATE TABLE IF NOT EXISTS film (
      film_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      release_year INTEGER,
      rental_duration INTEGER,
      rental_rate DECIMAL(4,2),
      length INTEGER,
      replacement_cost DECIMAL(5,2),
      rating VARCHAR(5),
      last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create rental table
  await db.query(`
    CREATE TABLE IF NOT EXISTS rental (
      rental_id SERIAL PRIMARY KEY,
      rental_date TIMESTAMP NOT NULL,
      inventory_id INTEGER,
      customer_id INTEGER,
      return_date TIMESTAMP,
      staff_id INTEGER,
      last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create payment table
  await db.query(`
    CREATE TABLE IF NOT EXISTS payment (
      payment_id SERIAL PRIMARY KEY,
      customer_id INTEGER,
      staff_id INTEGER,
      rental_id INTEGER,
      amount DECIMAL(5,2),
      payment_date TIMESTAMP,
      last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create store table
  await db.query(`
    CREATE TABLE IF NOT EXISTS store (
      store_id SERIAL PRIMARY KEY,
      manager_staff_id INTEGER,
      last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create staff table
  await db.query(`
    CREATE TABLE IF NOT EXISTS staff (
      staff_id SERIAL PRIMARY KEY,
      first_name VARCHAR(45),
      last_name VARCHAR(45),
      store_id INTEGER,
      last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample actors
  console.log("📝 Inserting sample actors...");
  const actors = [
    { first_name: "PENELOPE", last_name: "GUINESS" },
    { first_name: "NICK", last_name: "WAHLBERG" },
    { first_name: "ED", last_name: "CHASE" },
    { first_name: "JENNIFER", last_name: "DAVIS" },
    { first_name: "JOHNNY", last_name: "LOLLOBRIGIDA" },
    { first_name: "BURT", last_name: "POSEY" },
    { first_name: "GRACE", last_name: "MOSTEL" },
    { first_name: "MATTHEW", last_name: "JOHANSSON" },
    { first_name: "JOE", last_name: "SWANK" },
    { first_name: "CHRISTIAN", last_name: "GABLE" },
  ];

  for (const actor of actors) {
    await db.query("INSERT INTO actor (first_name, last_name) VALUES ($1, $2)", [
      actor.first_name,
      actor.last_name,
    ]);
  }

  // Insert sample films
  console.log("🎬 Inserting sample films...");
  const films = [
    { title: "ACADEMY DINOSAUR", rental_rate: 0.99, replacement_cost: 20.99 },
    { title: "ACE GOLDFINGER", rental_rate: 4.99, replacement_cost: 12.99 },
    { title: "ADAPTATION HOLES", rental_rate: 2.99, replacement_cost: 18.99 },
    { title: "AFFAIR PREJUDICE", rental_rate: 2.99, replacement_cost: 17.99 },
    { title: "AFRICAN EGG", rental_rate: 2.99, replacement_cost: 22.99 },
  ];

  for (const film of films) {
    await db.query(
      "INSERT INTO film (title, rental_rate, replacement_cost, release_year) VALUES ($1, $2, $3, $4)",
      [film.title, film.rental_rate, film.replacement_cost, 2006]
    );
  }

  // Insert sample stores
  console.log("🏪 Inserting stores...");
  await db.query("INSERT INTO store (manager_staff_id) VALUES (1)");
  await db.query("INSERT INTO store (manager_staff_id) VALUES (2)");

  // Insert sample staff
  console.log("👤 Inserting staff...");
  const staffMembers = [
    { first_name: "MIKE", last_name: "HILLYER", store_id: 1 },
    { first_name: "JON", last_name: "STEPHENS", store_id: 2 },
  ];

  for (const staff of staffMembers) {
    await db.query("INSERT INTO staff (first_name, last_name, store_id) VALUES ($1, $2, $3)", [
      staff.first_name,
      staff.last_name,
      staff.store_id,
    ]);
  }

  // Insert sample rentals and payments
  console.log("💳 Inserting rentals and payments...");
  for (let i = 1; i <= 50; i++) {
    const rentalDate = new Date(2006, 1, i % 28, Math.floor(Math.random() * 24), 0, 0);
    const result = await db.query(
      "INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id) VALUES ($1, $2, $3, $4) RETURNING rental_id",
      [rentalDate.toISOString(), Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 599) + 1, Math.floor(Math.random() * 2) + 1]
    );

    const rentalId = (result.rows[0] as any).rental_id;

    // Insert payment for this rental
    const paymentDate = new Date(rentalDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000);
    const amount = (Math.random() * 10 + 0.99).toFixed(2);

    await db.query(
      "INSERT INTO payment (customer_id, staff_id, rental_id, amount, payment_date) VALUES ($1, $2, $3, $4, $5)",
      [
        Math.floor(Math.random() * 599) + 1,
        Math.floor(Math.random() * 2) + 1,
        rentalId,
        parseFloat(amount),
        paymentDate.toISOString(),
      ]
    );
  }

  console.log("✅ Sakila database seeded successfully!");
  console.log("📊 Sample data created:");
  console.log(`   - ${actors.length} actors`);
  console.log(`   - ${films.length} films`);
  console.log(`   - 50 rental transactions`);
} catch (error) {
  console.error("❌ Seed failed:", error);
  process.exit(1);
} finally {
  await db.close();
}
