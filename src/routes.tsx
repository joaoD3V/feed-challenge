import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from './pages/_layouts/App';
import { NotFound } from './pages/404';
import { Feed } from './pages/app/feed/Feed';
import { Error } from './pages/Error';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Feed />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
