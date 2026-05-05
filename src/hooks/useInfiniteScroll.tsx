"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type FetchPageFunction<T> = (page: number, pageSize: number) => Promise<T[]>;

interface useInfiniteScrollOptions<T> {
  pageSize?: number;
  initialPage?: number;
  visualDelay?: number;
  fetchData?: FetchPageFunction<T>;
  keyExtractor?: (item: T) => string | number;
}

/**
 * useInfiniteScroll
 * 
 * Um hook senior para lidar com paginação. Suporta tanto paginação local (slicing)
 * para listas que já foram carregadas, quanto paginação dinâmica (fetchData) para chamadas API via Intersection Observer.
 * 
 * @param allItemsOrInitialData Array completo de itens (legacy) ou dados iniciais
 * @param options Configurações de tamanho de página, delay visual e função de busca
 */
export function useInfiniteScroll<T>(
  allItemsOrInitialData: T[],
  {
    pageSize = 10,
    initialPage = 1,
    visualDelay = 400,
    fetchData,
    keyExtractor
  }: useInfiniteScrollOptions<T> = {}
) {
  const [visibleData, setVisibleData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Store callbacks in refs so they never trigger the reset effect
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  const keyExtractorRef = useRef(keyExtractor);
  keyExtractorRef.current = keyExtractor;

  // Guard ref to prevent concurrent loadMore calls (belt-and-suspenders)
  const isLoadingRef = useRef(false);

  // Reset only when actual data / pageSize change — NOT when fetchData reference changes
  useEffect(() => {
    if (fetchDataRef.current) {
      // Dynamic true pagination: show the initial data as-is
      setVisibleData(allItemsOrInitialData);
      setPage(initialPage + 1);
      setHasMore(allItemsOrInitialData.length >= pageSize);
    } else {
      // Legacy slicing
      setVisibleData(allItemsOrInitialData.slice(0, pageSize));
      setPage(2);
      setHasMore(allItemsOrInitialData.length > pageSize);
    }

    // Reset the loading guard on data change
    isLoadingRef.current = false;
  }, [allItemsOrInitialData, pageSize, initialPage]);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || isLoadingMore || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoadingMore(true);

    try {
      if (visualDelay) {
        await new Promise(res => setTimeout(res, visualDelay));
      }

      const currentFetchData = fetchDataRef.current;
      const currentKeyExtractor = keyExtractorRef.current;

      if (currentFetchData) {
        // True pagination
        const nextBatch = await currentFetchData(page, pageSize);

        if (nextBatch.length > 0) {
          setVisibleData(prev => {
            if (!currentKeyExtractor) return [...prev, ...nextBatch];
            const seen = new Set(prev.map(currentKeyExtractor));
            const unique = nextBatch.filter(item => !seen.has(currentKeyExtractor(item)));
            return [...prev, ...unique];
          });
          setPage(prev => prev + 1);
        }
        setHasMore(nextBatch.length === pageSize);
      } else {
        // Legacy slicing
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const nextBatch = allItemsOrInitialData.slice(start, end);

        if (nextBatch.length > 0) {
          setVisibleData(prev => [...prev, ...nextBatch]);
          setPage(prev => prev + 1);
        }
        setHasMore(end < allItemsOrInitialData.length);
      }
    } catch (error) {
      console.error('Error fetching more items:', error);
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [page, isLoadingMore, hasMore, allItemsOrInitialData, pageSize, visualDelay]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback((node: HTMLElement | null) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore, loadMore]);

  return {
    visibleData,
    isLoadingMore,
    hasMore,
    lastItemRef,
    // Caso seja necessário forçar um reset manualmente
    reset: () => {
      if (!fetchDataRef.current) {
        setVisibleData(allItemsOrInitialData.slice(0, pageSize));
        setPage(2);
        setHasMore(allItemsOrInitialData.length > pageSize);
      }
    }
  };
}
