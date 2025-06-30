import { useState, useEffect } from 'react';

export function useUrlParams() {
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams(urlParams);

    const handleLocationChange = () => {
      const newParams = new URLSearchParams(window.location.search);
      setParams(newParams);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const getParam = (key: string): string | null => {
    return params.get(key);
  };

  const hasParam = (key: string): boolean => {
    return params.has(key);
  };

  return { getParam, hasParam };
}