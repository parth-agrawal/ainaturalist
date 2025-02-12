import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface GetMessagesParams {
  phone: string;
}

export async function getMessages({ phone }: GetMessagesParams) {
  const messages = await prisma.message.findMany({
    where: { phone },
    orderBy: { createdAt: 'asc' },
    select: {
      role: true,
      content: true
    }
  })
  return messages
}

interface AddMessageParams {
  phone: string;
  role: 'user' | 'assistant';
  content: string;
}

export async function addMessage({ phone, role, content }: AddMessageParams) {
  await prisma.message.create({
    data: {
      phone,
      role,
      content
    }
  })
}
