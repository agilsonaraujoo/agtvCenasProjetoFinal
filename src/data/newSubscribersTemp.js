// Função para gerar nomes únicos por plano
const generateUniqueName = (gender, plan) => {
  // Mapeamento de nomes por plano para evitar duplicatas
  const namesByPlan = {
    'Mensal': {
      male: ['João', 'Carlos', 'Pedro', 'Lucas', 'Rafael'],
      female: ['Maria', 'Ana', 'Isabela', 'Juliana', 'Larissa']
    },
    'Trimestral': {
      male: ['Bernardo', 'Gustavo', 'Henrique', 'Mateus', 'Thiago'],
      female: ['Camila', 'Carolina', 'Fernanda', 'Gabriela', 'Helena']
    },
    'Semestral': {
      male: ['Bruno', 'Daniel', 'Diego', 'Eduardo', 'Felipe'],
      female: ['Beatriz', 'Bruna', 'Daniela', 'Ester', 'Fabiana']
    },
    'Anual': {
      male: ['Guilherme', 'Hugo', 'Igor', 'João', 'Leonardo'],
      female: ['Isabela', 'Juliana', 'Larissa', 'Lívia', 'Mariana']
    }
  };

  const lastNames = {
    male: ['Silva', 'Oliveira', 'Pereira', 'Lima', 'Rocha'],
    female: ['Santos', 'Ferreira', 'Souza', 'Costa', 'Ribeiro']
  };

  // Garante que o nome seja único para cada plano
  const planNames = namesByPlan[plan];
  if (!planNames) {
    return generateUniqueName(gender, 'Mensal'); // Fallback para plano padrão
  }

  const firstName = planNames[gender][Math.floor(Math.random() * planNames[gender].length)];
  const lastName = lastNames[gender][Math.floor(Math.random() * lastNames[gender].length)];
  
  return `${firstName} ${lastName}`;
};

// Função auxiliar para garantir nomes únicos por plano
const getUniqueNameForPlan = (plan) => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  return generateUniqueName(gender, plan);
};

export const subscriptionMessages = [
  {
    id: 1,
    name: getUniqueNameForPlan('Mensal'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 2,
    name: getUniqueNameForPlan('Trimestral'),
    plan: "Trimestral",
    message: "acabou de assinar o plano Trimestral por R$99,90"
  },
  {
    id: 3,
    name: getUniqueNameForPlan('Semestral'),
    plan: "Semestral",
    message: "acabou de assinar o plano Semestral por R$179,90"
  },
  {
    id: 4,
    name: getUniqueNameForPlan('Anual'),
    plan: "Anual",
    message: "acabou de assinar o plano Anual por R$259,90"
  },
  {
    id: 5,
    name: getUniqueNameForPlan('Mensal'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 6,
    name: getUniqueNameForPlan('Trimestral'),
    plan: "Trimestral",
    message: "acabou de assinar o plano Trimestral por R$99,90"
  },
  {
    id: 7,
    name: getUniqueNameForPlan('Mensal'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 8,
    name: getUniqueNameForPlan('Anual'),
    plan: "Anual",
    message: "acabou de assinar o plano Anual por R$259,90"
  },
  {
    id: 9,
    name: getUniqueNameForPlan('Trimestral'),
    plan: "Trimestral",
    message: "acabou de assinar o plano Trimestral por R$99,90"
  },
  {
    id: 10,
    name: getUniqueNameForPlan('Semestral'),
    plan: "Semestral",
    message: "acabou de assinar o plano Semestral por R$179,90"
  },
  {
    id: 11,
    name: getUniqueNameForPlan('Mensal'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 12,
    name: getUniqueNameForPlan('Anual'),
    plan: "Anual",
    message: "acabou de assinar o plano Anual por R$259,90"
  },
  {
    id: 13,
    name: getUniqueNameForPlan('Mensal'),
    plan: "Mensal",
    message: "acabou de assinar o plano Mensal por R$34,90"
  },
  {
    id: 14,
    name: getUniqueNameForPlan('Trimestral'),
    plan: "Trimestral",
    message: "acabou de assinar o plano Trimestral por R$99,90"
  },
  {
    id: 15,
    name: getUniqueNameForPlan('Semestral'),
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
