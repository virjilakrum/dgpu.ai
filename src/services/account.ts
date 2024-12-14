import { UserProfile } from '../types/user';
import { generateAvatarUrl } from '../utils/avatar';

const ACCOUNTS_KEY = 'dgpu_accounts';

export interface AccountStats {
  totalRentals: number;
  totalSpent: number;
  totalEarned: number;
  successRate: number;
  reputation: number;
}

export const accountService = {
  // Yeni hesap oluştur veya var olanı getir
  initializeAccount: async (address: string): Promise<UserProfile> => {
    const accounts = await accountService.getAllAccounts();
    const existingAccount = accounts.find(a => a.address === address);

    if (existingAccount) {
      return existingAccount;
    }

    const newAccount: UserProfile = {
      address,
      avatarUrl: generateAvatarUrl(address),
      joinedAt: new Date().toISOString(),
      reputation: {
        score: 0,
        level: 'Newcomer',
        totalRentals: 0,
        totalGPUsListed: 0,
        reviews: 0,
        successRate: 100
      },
      badges: [],
      stats: {
        totalSpent: 0,
        totalEarned: 0,
        averageRating: 0
      },
      activity: []
    };

    await accountService.saveAccount(newAccount);
    return newAccount;
  },

  // Hesabı güncelle
  updateAccount: async (address: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    const accounts = await accountService.getAllAccounts();
    const index = accounts.findIndex(a => a.address === address);
    
    if (index === -1) {
      throw new Error('Account not found');
    }

    const updatedAccount = { ...accounts[index], ...updates };
    accounts[index] = updatedAccount;
    
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return updatedAccount;
  },

  // Hesap ara
  searchAccounts: async (query: string): Promise<UserProfile[]> => {
    const accounts = await accountService.getAllAccounts();
    const lowerQuery = query.toLowerCase();

    return accounts.filter(account => 
      account.address.toLowerCase().includes(lowerQuery) ||
      account.username?.toLowerCase().includes(lowerQuery)
    );
  },

  // Tüm hesapları getir
  getAllAccounts: async (): Promise<UserProfile[]> => {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Hesabı kaydet
  saveAccount: async (account: UserProfile): Promise<void> => {
    const accounts = await accountService.getAllAccounts();
    const index = accounts.findIndex(a => a.address === account.address);

    if (index !== -1) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  // Hesap istatistiklerini getir
  getAccountStats: async (address: string): Promise<AccountStats> => {
    const account = (await accountService.getAllAccounts())
      .find(a => a.address === address);

    if (!account) {
      throw new Error('Account not found');
    }

    return {
      totalRentals: account.reputation.totalRentals,
      totalSpent: account.stats.totalSpent,
      totalEarned: account.stats.totalEarned,
      successRate: account.reputation.successRate,
      reputation: account.reputation.score
    };
  }
};