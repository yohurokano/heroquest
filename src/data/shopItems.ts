export type ShopItem = {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: 'costume' | 'effect' | 'sticker';
  };
  
  export const shopItems: ShopItem[] = [
    {
      id: 'costume-ninja',
      name: 'Ninja Costume',
      description: 'A stealthy look for your hero!',
      cost: 100,
      type: 'costume',
    },
    {
      id: 'costume-angel',
      name: 'Angel Costume',
      description: 'Heavenly and heroic!',
      cost: 150,
      type: 'costume',
    },
    {
      id: 'effect-glow',
      name: 'Glow Effect',
      description: 'Makes your hero glow in battles!',
      cost: 80,
      type: 'effect',
    },
    {
      id: 'sticker',
      name: 'Star Sticker',
      description: 'Decorate with Star power!',
      cost: 60,
      type: 'sticker',
    }
  ];

  