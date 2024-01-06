import { hash, genSalt } from 'bcrypt';

(async () => {
  try {
    const salt = await genSalt(10);
    const hashedPassword = await hash('password', salt);
    console.log(hashedPassword);
  } catch (error) {
    console.log(error);
  }
})();
