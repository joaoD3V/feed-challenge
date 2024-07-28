import { User } from '@/@types/JSONPlaceholder';

type UserMapperParams = {
  usersList: User[];
  id: number;
};

export function userMapper({ usersList, id }: UserMapperParams) {
  const user = usersList.find((user) => user.id === id);

  if (!user) {
    return {
      id: usersList.length + 1,
      name: 'John Doe',
      username: 'john_doe',
      email: 'johndoe@example.com',
    };
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email[0].toLowerCase().concat(user.email.substring(1)),
  };
}
