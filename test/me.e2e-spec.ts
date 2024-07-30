import { expect, test } from '@playwright/test';

test('edit user email on profile page successfully', async ({ page }) => {
  await page.goto('/me', { waitUntil: 'networkidle' });

  const saveButton = page.getByRole('button', { name: 'Salvar' });
  await expect(saveButton).toBeDisabled();
  await page.locator('input[name="email"]').fill('johndoe@example.com');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();
  const toast = page.getByText('Usuário atualizado com sucesso! 😀');
  await expect(toast).toBeVisible();
});
