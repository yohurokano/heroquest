import React, { useState, useEffect } from 'react';
import { shopItems } from '../data/shopItems';
import { getInventory, buyItem } from '../utils/shopManager';
import { getXP } from '../utils/xpManager';
import { playSound } from '../utils/soundManager';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaCheck, FaGem } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';

const HeroShopPage: React.FC = () => {
  const [xp, setXp] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setXp(getXP());
    setInventory(getInventory());
  }, []);

  const handleBuy = (itemId: string, cost: number) => {
    playSound('click');
    const success = buyItem(itemId, cost);
    if (success) {
      playSound('success');
      setXp(getXP());
      setInventory(getInventory());
    } else {
      playSound('error');
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="navbar bg-base-200 shadow-lg px-4 py-2 fixed top-0 left-0 right-0 z-50">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={() => {
            playSound('click');
            navigate('/');
          }}
        >
          <IoMdArrowRoundBack className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-2 ml-2">
          <FaStore className="text-primary w-6 h-6" />
          <h1 className="text-xl font-bold">Hero Shop</h1>
        </div>
        <div className="badge badge-neutral gap-2">
          <FaGem className="w-4 h-4" />
          {xp}
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map(item => {
            const owned = inventory.includes(item.id);
            const canAfford = xp >= item.cost;

            return (
              <div 
                key={item.id} 
                className={`card bg-base-200 shadow-lg ${owned ? 'border-2 border-success' : ''}`}
              >
                <figure className="px-4 pt-4">
                  <img 
                    src={`public/assets/shop/${item.id}.png`} 
                    alt={item.name} 
                    className="rounded-xl aspect-square object-cover w-full"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{item.name}</h2>
                  <p className="opacity-75">{item.description}</p>
                  <div className="card-actions justify-end mt-4">
                    {owned ? (
                      <div className="badge badge-success gap-2">
                        <FaCheck className="w-4 h-4" />
                        Owned
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <div className="badge badge-neutral gap-2">
                          <FaGem className="w-4 h-4" />
                          {item.cost}
                        </div>
                        <button
                          disabled={!canAfford}
                          className={`btn btn-primary ${!canAfford ? 'btn-disabled' : ''}`}
                          onClick={() => handleBuy(item.id, item.cost)}
                        >
                          {canAfford ? 'Purchase' : 'Need More XP'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default HeroShopPage;