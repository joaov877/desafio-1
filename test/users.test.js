const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/index');

async function withServer(run) {
  const server = app.listen(0);
  try {
    const address = server.address();
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  }
}

 test('GET /api/users retorna 200 e uma lista', async () => {
  await withServer(async baseUrl => {
    const response = await fetch(`${baseUrl}/api/users`);
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(await response.json()));
  });
});

test('POST /api/users rejeita dados obrigatórios ausentes', async () => {
  await withServer(async baseUrl => {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'João' })
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { message: 'Nome e email são obrigatórios' });
  });
});

test('POST /api/users cria usuário válido', async () => {
  await withServer(async baseUrl => {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'João', email: 'joao@example.com' })
    });
    const user = await response.json();
    assert.equal(response.status, 201);
    assert.equal(user.name, 'João');
    assert.equal(user.email, 'joao@example.com');
    assert.ok(user.id);
  });
});
