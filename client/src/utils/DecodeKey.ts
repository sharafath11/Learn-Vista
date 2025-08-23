export const decodeKey = (encodedKey: string): string | null => {
    try {
      const decoded = atob(encodedKey);
      const data = JSON.parse(decoded);
      return data.r;
    } catch (error) {
      console.error("Invalid key",error);
      return null;
    }
  };
  