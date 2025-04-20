export const decodeKey = (encodedKey: string): string | null => {
    try {
        // atop use to decode btoa
      const decoded = atob(encodedKey);
      const data = JSON.parse(decoded);
      return data.r;
    } catch (error) {
      console.error("Invalid key");
      return null;
    }
  };
  