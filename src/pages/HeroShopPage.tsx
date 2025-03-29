import React, { useState, useEffect } from 'react';
import { shopItems } from '../data/shopItems';
import { getInventory, buyItem } from '../utils/shopManager';
import { getXP } from '../utils/xpManager';
import { playSound } from '../utils/soundManager';
import { useNavigate } from 'react-router-dom';
import styles from './HeroShopPage.module.css';
import { FaStore, FaCheck, FaGem } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import BottomNav from '../components/BottomNav';

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
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => {
            playSound('click');
            navigate('/');
          }}
        >
          <IoMdArrowRoundBack className={styles.backIcon} />
        </button>
        <h1 className={styles.title}>
          <FaStore className={styles.titleIcon} />
          Hero Shop
        </h1>
        <div className={styles.xpDisplay}>
          <FaGem className={styles.gemIcon} />
          <span>{xp}</span>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.shopGrid}>
          {shopItems.map(item => {
            const owned = inventory.includes(item.id);
            const canAfford = xp >= item.cost;

            return (
              <div 
                key={item.id} 
                className={`${styles.shopItem} ${owned ? styles.ownedItem : ''}`}
              >
                <div className={styles.itemImage}>
                  <img src={`/assets/shop/${item.id}.png`} alt={item.name} />
                </div>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <div className={styles.itemFooter}>
                    {owned ? (
                      <div className={styles.ownedBadge}>
                        <FaCheck className={styles.checkIcon} />
                        <span>Owned</span>
                      </div>
                    ) : (
                      <>
                        <div className={styles.itemPrice}>
                          <FaGem className={styles.smallGem} />
                          <span>{item.cost}</span>
                        </div>
                        <button
                          disabled={!canAfford}
                          className={`${styles.buyButton} ${!canAfford ? styles.disabled : ''}`}
                          onClick={() => handleBuy(item.id, item.cost)}
                        >
                          {canAfford ? 'Purchase' : 'Need More XP'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default HeroShopPage;