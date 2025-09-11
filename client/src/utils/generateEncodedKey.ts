export const generateEncodedKey = (role: string): string => {
    const data = {
      r: role,
      t: Date.now(),
      rand: Math.random().toString(36).substring(2, 10)
    };
    return btoa(JSON.stringify(data)); 
  };
  