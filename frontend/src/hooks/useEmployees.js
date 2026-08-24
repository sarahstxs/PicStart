import { useEffect, useState } from "react";
import { getEmployees } from "../services/employeeService.js";

export default function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadEmployees() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getEmployees();

        if (isMounted) {
          setEmployees(data);
        }
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar os funcionários.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  function reload() {
    setReloadKey((currentKey) => currentKey + 1);
  }

  return { employees, isLoading, error, reload };
}
