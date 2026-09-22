/**
 * Conteúdo editável do site. Troque placeholders, links e caminhos de imagem aqui.
 * `dateTimeIso` alimenta a contagem regressiva (horário local, sem fuso).
 * Fotos: `public/images/fotos/capa` e `public/images/fotos/dress-code`.
 * Elementos gráficos: `public/images/elementos`.
 * No site, o caminho público começa em `/images/...` (ex.: `/images/fotos/capa/capa.jpg`).
 */

export type ImageAsset = {
  src: string;
  alt: string;
};

export type PaletteColor = {
  name: string;
  hex: string;
};

export type NavItem = {
  id: string;
  href: string;
  label: string;
};

export type WeddingPlace = {
  id: string;
  label: string;
  icon: 'church' | 'cheers' | 'pin';
  when: string;
  name: string;
  address: string;
};

export type WeddingContent = {
  monogram: string;
  groom: string;
  bride: string;
  phrase: string;
  heroImage: string;
  heroImageAlt: string;
  dateLabel: string;
  dateTimeIso: string;
  places: readonly WeddingPlace[];
  navigation: readonly NavItem[];
  hero: {
    eyebrow: string;
    continueLabel: string;
    countdownFinished: string;
  };
  wedding: {
    quote: string;
    quoteAuthor: string;
    eyebrow: string;
    title: string;
    lede: string;
    mapsLabel: string;
  };
  dressCode: {
    eyebrow: string;
    title: string;
    name: string;
    description: string;
    paletteLabel: string;
    referencesTitle: string;
    colors: readonly PaletteColor[];
    references: readonly ImageAsset[];
  };
  gifts: {
    eyebrow: string;
    title: string;
    text: string;
    button: string;
    url: string;
  };
  rsvp: {
    eyebrow: string;
    title: string;
    lede: string;
    nameLabel: string;
    namePlaceholder: string;
    presenceLabel: string;
    presenceYes: string;
    presenceNo: string;
    companionsLabel: string;
    companionsHint: string;
    notesLabel: string;
    notesPlaceholder: string;
    submit: string;
    submitting: string;
    edit: string;
    successYes: string;
    successNo: string;
    errors: {
      name: string;
      presence: string;
      companions: string;
      submit: string;
    };
  };
  album: {
    eyebrow: string;
    title: string;
    text: string;
    share: string;
    empty: string;
    remove: string;
    lightbox: string;
    previous: string;
    next: string;
    close: string;
    unreadable: string;
  };
  closing: {
    line1: string;
    line2: string;
  };
};

export const wedding: WeddingContent = {
  monogram: 'G & J',
  groom: 'João Gabriel',
  bride: 'Geísa Vitória',
  phrase: 'Um dia inteiro para dizer sim ao que escolhemos juntos.',
  heroImage: '',
  heroImageAlt: 'Foto principal do casal',
  dateLabel: '20 de maio de 2028',
  dateTimeIso: '2028-05-20T16:00:00',
  places: [
    {
      id: 'cerimonia',
      label: 'Cerimônia',
      icon: 'church',
      when: 'às 16h',
      name: 'Igreja Matriz Nossa Senhora da Conceição',
      address: 'Centro, Itaberá - SP, 18440-000',
    },
    {
      id: 'recepcao',
      label: 'Recepção',
      icon: 'cheers',
      when: 'Logo após a cerimônia',
      name: 'Salão de Festas Rancho das Pedras',
      address: 'Itaberá - SP, Rodovia Eduardo Saigh, SP-249, KM 114',
    },
  ],
  navigation: [
    { id: 'inicio', href: '#inicio', label: 'Início' },
    { id: 'casamento', href: '#casamento', label: 'O Casamento' },
    { id: 'dress-code', href: '#dress-code', label: 'Dress Code' },
    { id: 'presentes', href: '#presentes', label: 'Presentes' },
    { id: 'rsvp', href: '#rsvp', label: 'RSVP' },
    { id: 'album', href: '#album', label: 'Álbum' },
  ],
  hero: {
    eyebrow: 'Nosso casamento',
    continueLabel: 'Role para saber mais',
    countdownFinished: 'O grande dia chegou.',
  },
  wedding: {
    quote: 'Entre todas as coisas deste mundo, o amor fez de nós um só coração.',
    quoteAuthor: 'Santo Agostinho',
    eyebrow: 'Celebração',
    title: 'O casamento',
    lede: 'Tudo o que você precisa para chegar com calma e celebrar conosco.',
    mapsLabel: 'Como chegar',
  },
  dressCode: {
    eyebrow: 'Traje',
    title: 'Dress Code',
    name: '[NOME DO TRAJE]',
    description:
      'Pedimos um visual elegante e confortável, em harmonia com a paleta desta celebração.',
    paletteLabel: 'Paleta de cores',
    referencesTitle: 'Referências',
    colors: [
      { name: 'Marfim', hex: '#F3EEE6' },
      { name: 'Areia', hex: '#E4D5C3' },
      { name: 'Sálvia', hex: '#C5D0C8' },
      { name: 'Blush', hex: '#E6D2CC' },
      { name: 'Azul-noite', hex: '#02345B' },
    ],
    references: [],
  },
  gifts: {
    eyebrow: 'Carinho',
    title: 'Lista de presentes',
    text: 'Sua presença já enche este dia de significado. Se quiser nos presentear, deixamos uma lista preparada com carinho.',
    button: 'Ver lista de presentes',
    url: '',
  },
  rsvp: {
    eyebrow: 'Presença',
    title: 'Confirme sua presença',
    lede: 'Sua resposta nos ajuda a cuidar de cada detalhe deste dia.',
    nameLabel: 'Nome completo',
    namePlaceholder: 'Seu nome e sobrenome',
    presenceLabel: 'Confirmação de presença',
    presenceYes: 'Sim, confirmo',
    presenceNo: 'Não poderei ir',
    companionsLabel: 'Número de acompanhantes',
    companionsHint: 'Não inclua você nesta contagem.',
    notesLabel: 'Observações',
    notesPlaceholder: 'Algo que devamos saber?',
    submit: 'Confirmar presença',
    submitting: 'Enviando…',
    edit: 'Editar resposta',
    successYes: 'Obrigado por confirmar. Será um dia ainda mais especial com você.',
    successNo: 'Obrigado por avisar. Você continua fazendo parte da nossa história.',
    errors: {
      name: 'Informe o nome completo.',
      presence: 'Confirme se poderá comparecer.',
      companions: 'Informe de 0 a 10 acompanhantes.',
      submit: 'Não foi possível enviar agora. Tente de novo em instantes.',
    },
  },
  album: {
    eyebrow: 'Memórias',
    title: 'Álbum do nosso dia',
    text: 'Compartilhe suas fotos e faça parte das memórias desse dia tão especial.',
    share: 'Compartilhar uma foto',
    empty: 'Quando as primeiras fotos forem compartilhadas, elas aparecem aqui.',
    remove: 'Remover foto',
    lightbox: 'Foto ampliada',
    previous: 'Foto anterior',
    next: 'Próxima foto',
    close: 'Fechar foto',
    unreadable: 'Não foi possível exibir esta foto.',
  },
  closing: {
    line1: 'O melhor presente é ter vocês conosco nesse dia.',
    line2: 'Estamos muito felizes em compartilhar esse momento com as pessoas que fazem parte da nossa história.',
  },
};

export const sectionIds = wedding.navigation.map((item) => item.id);
