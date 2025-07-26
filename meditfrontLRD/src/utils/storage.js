import { STORAGE_KEYS } from './constants';

class StorageService {
  // Get storage type based on remember me preference
  getStorage() {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }

  // Set remember me preference
  setRememberMe(remember) {
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }
  }

  // Store tokens
  setTokens(accessToken, refreshToken, rememberMe = false) {
    this.setRememberMe(rememberMe);
    const storage = this.getStorage();
    
    if (accessToken) {
      storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }
    if (refreshToken) {
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  // Get access token
  getAccessToken() {
    return this.getStorage().getItem(STORAGE_KEYS.ACCESS_TOKEN) || 
           sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
           localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Get refresh token
  getRefreshToken() {
    return this.getStorage().getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
           sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
           localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Store user data
  setUserData(userData) {
    const storage = this.getStorage();
    storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }

  // Get user data
  getUserData() {
    try {
      const storage = this.getStorage();
      const userData = storage.getItem(STORAGE_KEYS.USER_DATA) ||
                      sessionStorage.getItem(STORAGE_KEYS.USER_DATA) ||
                      localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Clear all auth data
  clearAuthData() {
    // Clear from both storage types
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      storage.removeItem(STORAGE_KEYS.USER_DATA);
    });
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAccessToken();
  }
}

export default new StorageService();