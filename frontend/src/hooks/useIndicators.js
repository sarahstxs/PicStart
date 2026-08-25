import { useEffect, useState } from "react";
import { getIndicators } from "../services/employeeService.js";

export default function useIndicators() {
  const [indicators, setIndicators] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadIndicators() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getIndicators();

        if (isMounted) {
          setIndicators(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.message || "Não foi possível carregar os indicadores.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadIndicators();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  function reload() {
    setReloadKey((currentKey) => currentKey + 1);
  }

  return { indicators, isLoading, error, reload };
}
