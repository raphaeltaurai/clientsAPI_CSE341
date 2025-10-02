const db = require('./models');
const Client = db.client;
const Employee = db.employee;

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Client.deleteMany({});
    await Employee.deleteMany({});

    // Create sample clients
    console.log('Creating sample clients...');
    const clients = await Client.create([
      {
        client_id: 1,
        name: "Acme Corporation",
        companyCode: "ACME",
        address: "123 Business Street, New York, NY 10001",
        additionalInfo: true,
        employees: [
          { id: 1, employeeName: "John Doe", age: 30 },
          { id: 2, employeeName: "Jane Smith", age: 28 },
          { id: 3, employeeName: "Mike Johnson", age: 35 }
        ]
      },
      {
        client_id: 2,
        name: "Tech Solutions Inc",
        companyCode: "TECH",
        address: "456 Innovation Avenue, San Francisco, CA 94105",
        additionalInfo: false,
        employees: [
          { id: 4, employeeName: "Sarah Wilson", age: 32 },
          { id: 5, employeeName: "David Brown", age: 29 }
        ]
      },
      {
        client_id: 3,
        name: "Global Enterprises",
        companyCode: "GLOBAL",
        address: "789 Corporate Plaza, Chicago, IL 60601",
        additionalInfo: true,
        employees: [
          { id: 6, employeeName: "Lisa Davis", age: 31 },
          { id: 7, employeeName: "Tom Anderson", age: 27 },
          { id: 8, employeeName: "Emma Taylor", age: 33 }
        ]
      }
    ]);

    // Create standalone employees
    console.log('Creating standalone employees...');
    const employees = await Employee.create([
      { id: 10, employeeName: "Alice Brown", age: 32 },
      { id: 11, employeeName: "Charlie Wilson", age: 29 },
      { id: 12, employeeName: "Diana Prince", age: 34 },
      { id: 13, employeeName: "Frank Miller", age: 26 }
    ]);

    console.log('\n✅ Database seeded successfully!');
    console.log(`📊 Clients created: ${clients.length}`);
    console.log(`👥 Standalone employees created: ${employees.length}`);
    console.log(`📈 Total employees (including client employees): ${clients.reduce((sum, client) => sum + client.employees.length, 0) + employees.length}`);
    
    console.log('\n📋 Sample data created:');
    console.log('- 3 clients with various employee counts');
    console.log('- 4 standalone employees');
    console.log('- Mixed additionalInfo values (true/false)');
    console.log('- Realistic company names and addresses');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

// Connect to database and run seeding
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('🔗 Connected to the database!');
    return seedDatabase();
  })
  .catch((err) => {
    console.log('❌ Cannot connect to the database!', err);
    process.exit();
  });
