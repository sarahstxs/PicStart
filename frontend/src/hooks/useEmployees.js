import { useEffect, useState } from "react";
import { getEmployees, searchEmployees } from "../services/employeeService.js";

export default function useEmployees(filters = {}) {
  const name = filters.name?.trim() ?? "";
  const post = filters.post?.trim() ?? "";
  const status = filters.status ?? "";
  const hasFilters = Boolean(name || post || status);
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
        const data = hasFilters
          ? await searchEmployees({ name, post, status })
          : await getEmployees();

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

    const timeoutId = window.setTimeout(loadEmployees, hasFilters ? 250 : 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [reloadKey, name, post, status, hasFilters]);

  function reload() {
    setReloadKey((currentKey) => currentKey + 1);
  }

  return { employees, isLoading, error, reload };
}
