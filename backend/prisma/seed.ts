const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log('Usuário admin já existe');
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: email,
      passwordHash: passwordHash,
    },
  });

  console.log('Usuário admin criado:');
  console.log('Email:', user.email);
  console.log('Senha: admin123');
  console.log('ID:', user.id);
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

