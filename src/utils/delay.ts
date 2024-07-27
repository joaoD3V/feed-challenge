export async function delay() {
  return await new Promise((resolve) =>
    setTimeout(resolve, Math.round(Math.random() * 3000))
  );
}
