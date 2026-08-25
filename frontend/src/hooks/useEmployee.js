import { useEffect, useState } from "react";
import { getEmployeeById } from "../services/employeeService.js";

export default function useEmployee(id) {
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      return () => {
        isMounted = false;
      };
    }

    async function loadEmployee() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getEmployeeById(id);

        if (isMounted) {
          setEmployee(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.message || "Não foi possível carregar o funcionário.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEmployee();

    return () => {
      isMounted = false;
    };
  }, [id, reloadKey]);

  function reload() {
    setReloadKey((currentKey) => currentKey + 1);
  }

  function replaceEmployee(nextEmployee) {
    setEmployee(nextEmployee);
    setError(null);
  }

  return { employee, isLoading, error, reload, replaceEmployee };
}
