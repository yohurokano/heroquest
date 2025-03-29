export function getInventory(): string[] {
    const data = localStorage.getItem('hero-inventory');
    return data ? JSON.parse(data) : [];
  }
  
  export function buyItem(itemId: string, cost: number): boolean {
    const currentXP = parseInt(localStorage.getItem('xp') || '0');
    if (currentXP < cost) return false;
  
    const inventory = getInventory();
    if (inventory.includes(itemId)) return false;
  
    const newXP = currentXP - cost;
    localStorage.setItem('xp', newXP.toString());
    localStorage.setItem('hero-inventory', JSON.stringify([...inventory, itemId]));
    return true;
  }
  