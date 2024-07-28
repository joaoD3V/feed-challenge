import { faker } from '@faker-js/faker';

import { User } from '@/@types/JSONPlaceholder';

type Params = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export const userMock = makeUser({
  id: 1000, // Não altere
  name: 'John Doe',
  username: 'john_doe',
  email: 'john.doe@example.com',
});

export function makeUser({ id, name, username, email }: Params) {
  const user: User = {
    id,
    name,
    username,
    email,
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      geo: {
        lat: faker.location.latitude().toString(),
        lng: faker.location.longitude().toString(),
      },
      suite: faker.location.secondaryAddress(),
      zipcode: faker.location.zipCode(),
    },
    company: {
      name: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      bs: faker.company.buzzPhrase(),
    },
    phone: faker.phone.number(),
    website: faker.internet.domainName(),
  };

  return user;
}
