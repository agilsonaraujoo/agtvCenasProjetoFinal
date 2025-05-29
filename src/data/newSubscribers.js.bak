// Função para gerar nomes únicos
const generateUniqueName = (gender) => {
  const names = {
    male: ['João', 'Carlos', 'Pedro', 'Lucas', 'Rafael'],
    female: ['Maria', 'Ana', 'Isabela', 'Juliana', 'Larissa']
  };
  
  const lastNames = {
    male: ['Silva', 'Oliveira', 'Pereira', 'Lima', 'Rocha'],
    female: ['Santos', 'Ferreira', 'Souza', 'Costa', 'Ribeiro']
  };

  const firstName = names[gender][Math.floor(Math.random() * names[gender].length)];
  const lastName = lastNames[gender][Math.floor(Math.random() * lastNames[gender].length)];
  
  return `${firstName} ${lastName}`;
};

export const subscriptionMessages = [
  {
    id: 1,
    name: generateUniqueName('female'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 2,
    name: generateUniqueName('male'),
    plan: "Trimestral",
    message: "acabou de assinar o plano Trimestral por R$99,90"
  },
  {
    id: 3,
    name: generateUniqueName('female'),
    plan: "Semestral",
    message: "acabou de assinar o plano Semestral por R$179,90"
  },
  {
    id: 4,
    name: generateUniqueName('male'),
    plan: "Anual",
    message: "acabou de assinar o plano Anual por R$259,90"
  },
  {
    id: 5,
    name: generateUniqueName('female'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 6,
    name: generateUniqueName('male'),
    plan: "Trimestral",
    message: "acabou de assinar o plano Trimestral por R$99,90"
  },
  {
    id: 7,
    name: generateUniqueName('female'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 8,
    name: generateUniqueName('male'),
    plan: "Anual",
    message: "acabou de assinar o plano Anual por R$259,90"
  },
  {
    id: 9,
    name: generateUniqueName('female'),
    plan: "Trimestral",
    message: "acabou de assinar o plano Trimestral por R$99,90"
  },
  {
    id: 10,
    name: generateUniqueName('male'),
    plan: "Semestral",
    message: "acabou de assinar o plano Semestral por R$179,90"
  },
  {
    id: 11,
    name: generateUniqueName('female'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 12,
    name: generateUniqueName('male'),
    plan: "Anual",
    message: "acabou de assinar o plano Anual por R$259,90"
  },
  {
    id: 13,
    name: generateUniqueName('female'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 14,
    name: generateUniqueName('male'),
    plan: "Trimestral",
    message: "acabou de assinar o plano Trimestral por R$99,90"
  },
  {
    id: 15,
    name: generateUniqueName('female'),
    plan: "Semestral",
    message: "acabou de assinar o plano Semestral por R$179,90"
  }
];

export const getNewSubscription = () => {
  const randomMessage = subscriptionMessages[Math.floor(Math.random() * subscriptionMessages.length)];
  return {
    name: randomMessage.name,
    plan: randomMessage.plan,
    message: randomMessage.message
  };
};
