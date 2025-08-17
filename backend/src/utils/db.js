import mongoose from 'mongoose'
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('Database connected Successfully✅')
  } catch (error) {
    console.error('Failed Database connection✖️', error.message)
    process.exit(1)
  }
}
export default dbConnect
