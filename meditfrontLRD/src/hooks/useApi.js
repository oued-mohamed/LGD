import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Hook for making API calls with loading and error states
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    immediate = true,
    onSuccess,
    onError,
    dependencies = [],
  } = options;

  const execute = useCallback(async (requestData = null) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await apiService.get(url, requestData);
          break;
        case 'POST':
          response = await apiService.post(url, requestData);
          break;
        case 'PUT':
          response = await apiService.put(url, requestData);
          break;
        case 'PATCH':
          response = await apiService.patch(url, requestData);
          break;
        case 'DELETE':
          response = await apiService.delete(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      setData(response.data || response);
      onSuccess?.(response.data || response);
      return response.data || response;
    } catch (err) {
      setError(err);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, onSuccess, onError]);

  useEffect(() => {
    if (immediate && method.toUpperCase() === 'GET') {
      execute();
    }
  }, [immediate, execute, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

// Hook for form submissions
export const useFormSubmit = (submitFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { onSuccess, onError, resetOnSubmit = true } = options;

  const submit = useCallback(async (formData) => {
    try {
      if (resetOnSubmit) {
        setError(null);
        setSuccess(false);
      }
      setLoading(true);

      const result = await submitFunction(formData);
      setSuccess(true);
      onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      setSuccess(false);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submitFunction, onSuccess, onError, resetOnSubmit]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submit,
    loading,
    error,
    success,
    reset,
  };
};

// Hook for paginated data
export const usePagination = (url, options = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(options.pageSize || 10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { data, loading, error, execute } = useApi(url, {
    method: 'GET',
    immediate: false,
    onSuccess: (response) => {
      setTotalItems(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / pageSize));
    },
  });

  const loadPage = useCallback((page) => {
    setCurrentPage(page);
    execute({
      page,
      limit: pageSize,
      ...options.filters,
    });
  }, [execute, pageSize, options.filters]);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      loadPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      loadPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadPage(page);
    }
  };

  return {
    data: data?.items || data || [],
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage,
    prevPage,
    goToPage,
    refetch: () => loadPage(currentPage),
  };
};

// Hook for search functionality
export const useSearch = (url, options = {}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(options.initialFilters || {});
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const { data, loading, error, execute } = useApi(url, {
    method: 'GET',
    immediate: false,
  });

  const search = useCallback((searchQuery, searchFilters = {}) => {
    execute({
      q: searchQuery,
      ...filters,
      ...searchFilters,
    });
  }, [execute, filters]);

  const debouncedSearch = useCallback((searchQuery, delay = 300) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      search(searchQuery);
    }, delay);

    setDebounceTimeout(timeout);
  }, [search, debounceTimeout]);

  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  const updateQuery = (newQuery) => {
    setQuery(newQuery);
    if (options.autoSearch !== false) {
      debouncedSearch(newQuery);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    if (options.autoSearch !== false) {
      search(query, newFilters);
    }
  };

  const reset = () => {
    setQuery('');
    setFilters(options.initialFilters || {});
  };

  return {
    query,
    filters,
    data: data || [],
    loading,
    error,
    search,
    debouncedSearch,
    updateQuery,
    updateFilters,
    reset,
  };
};

export default useApi;