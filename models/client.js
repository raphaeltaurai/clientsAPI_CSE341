const EmployeeSchema = require('./employee');
const { type } = require("os");

module.exports = (mongoose) => {

  const Client = mongoose.model(
    'client',
    mongoose.Schema(
      {
        client_id: Number,
        name: String,
        companyCode: String,
        address: String,
        additionalInfo: Boolean,
        employees: [EmployeeSchema]
      },
      { timestamps: true }
    )
  );

  return Client;
};