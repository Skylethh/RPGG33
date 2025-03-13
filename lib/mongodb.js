
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Lütfen MONGODB_URI ortam değişkenini ayarlayın');
}

if (process.env.NODE_ENV === 'development') {
  // Geliştirme modunda global değişkeni kullan
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Üretim modunda yeni bir bağlantı oluştur
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;