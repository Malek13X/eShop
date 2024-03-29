import mongoose from 'mongoose';
import addressValidator from 'address-validator';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  line1: {
    type: String,
    required: true
  },
  line2: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return addressValidator.validatePostalCode(v, 'any');
      },
      message: props => `${props.value} is not a valid postal code!`
    }
  },
  
});
const Address = mongoose.model('Address', addressSchema);
export default Address 
