import { useCallback, useEffect, useState } from "react";

interface ApiDataState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => Promise<void>;
}

export const useApiData = <T,>(
  loader: () => Promise<T>,
  errorMessage = "No pudimos cargar esta informacion por ahora."
): ApiDataState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loader();

      setData(result);
    } catch {
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [errorMessage, loader]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await loader();

        if (active) {
          setData(result);
        }
      } catch {
        if (active) {
          setError(errorMessage);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [errorMessage, loader]);

  return { data, error, loading, reload };
};
