import { User } from '@/@types/JSONPlaceholder';

type UserMapperParams = {
  usersList: User[];
  id: number;
  currentUser: User;
};

export function userMapper({ usersList, id, currentUser }: UserMapperParams) {
  const user = usersList.find((user) => user.id === id);

  if (!user) {
    return currentUser;
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email[0].toLowerCase().concat(user.email.substring(1)),
  };
}
