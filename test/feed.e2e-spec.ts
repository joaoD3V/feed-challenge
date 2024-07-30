import { expect, test } from '@playwright/test';

test('show posts on feed successfully', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  // First user post
  await expect(page.getByText('quia et suscipit suscipit')).toBeVisible();
  await expect(
    page
      .locator('section')
      .filter({
        hasText:
          'Leanne Graham (Bret)sincere@april.bizquia et suscipit suscipit recusandae',
      })
      .getByRole('link')
  ).toBeVisible();
  await expect(
    page.getByText(
      'Eliseoeliseo@gardner.bizlaudantium enim quasi est quidem magnam voluptate ipsam'
    )
  ).toBeVisible();

  //Second user post
  await expect(page.getByText('delectus reiciendis molestiae')).toBeVisible();
  await expect(
    page
      .locator('section')
      .filter({
        hasText:
          'Ervin Howell (Antonette)shanna@melissa.tvdelectus reiciendis molestiae',
      })
      .getByRole('link')
  ).toBeVisible();
  await expect(
    page.getByText(
      'Laurielaurie@lincoln.usperferendis omnis esse voluptate sit mollitia sed'
    )
  ).toBeVisible();
});

test('add, edit and delete comment successfully on post feed', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  // Add comment
  await page
    .locator('section')
    .filter({
      hasText:
        'Leanne Graham (Bret)sincere@april.bizquia et suscipit suscipit recusandae',
    })
    .getByPlaceholder('Escreva um comentário...')
    .fill('Test comment');
  await page.getByRole('button', { name: 'Publicar' }).click();
  const toast = page.getByText('Comentário adicionado com sucesso! 😀');
  await expect(toast).toBeVisible();

  // Edit comment
  await page.getByRole('button').nth(2).click();
  await page
    .getByPlaceholder('Edite seu comentário...')
    .fill('Editing test comment');
  await page.getByRole('button', { name: 'Atualizar' }).click();
  const editingToast = page.getByText('Comentário atualizado com sucesso! 😀');
  await expect(editingToast).toBeVisible();

  // Delete comment
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Sim, remover' }).click();
  const deletingToast = page.getByText('Comentário excluído com sucesso! 😀');
  await expect(deletingToast).toBeVisible();
});

test('go to user posts page successfully when click on user', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await page
    .locator('section')
    .filter({
      hasText:
        'Leanne Graham (Bret)sincere@april.bizquia et suscipit suscipit recusandae',
    })
    .getByRole('link')
    .click();

  await expect(
    page.getByRole('heading', { name: 'Perfil do Autor:' })
  ).toBeVisible();
  await expect(page.getByText('quia et suscipit suscipit')).toBeVisible();
  await expect(
    page
      .locator('section')
      .filter({
        hasText:
          'Leanne Graham (Bret)sincere@april.bizquia et suscipit suscipit recusandae',
      })
      .getByRole('link')
  ).toBeVisible();
  await expect(
    page.getByText(
      'Eliseoeliseo@gardner.bizlaudantium enim quasi est quidem magnam voluptate ipsam'
    )
  ).toBeVisible();
});

test('add, edit and delete post successfully on post feed', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  // Add post
  await page.getByRole('button', { name: 'Criar novo post' }).click();
  await page.getByPlaceholder('Escreva o que quiser...').fill('New post');
  await page.getByRole('button', { name: 'Publicar' }).click();
  const toast = page.getByText('Post adicionado com sucesso! 😀');
  await expect(toast).toBeVisible();
  await expect(page.getByText('John (Doe)john@example.comNew')).toBeVisible();

  // Edit post
  await page.getByRole('button').nth(2).click();
  await page.getByPlaceholder('Edite seu post...').fill('Editing post content');
  await page.getByRole('button', { name: 'Atualizar' }).click();
  const editingToast = page.getByText('Post atualizado com sucesso! 😀');
  await expect(editingToast).toBeVisible();

  // Delete post
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Sim, remover' }).click();
  const deletingToast = page.getByText('Post excluído com sucesso! 😀');
  await expect(deletingToast).toBeVisible();
});

test('go to user profile page successfully when click on edit profile', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await page.getByRole('button', { name: 'Editar perfil' }).click();

  await expect(page.getByText('Meu Perfil')).toBeVisible();
});
