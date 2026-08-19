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
  // Compute initial state synchronously to prevent empty 1-frame flashes
  const computeInitialVisible = (data: T[]): T[] => {
    if (!data) return [];
    return fetchData ? data : data.slice(0, pageSize);
  };

  const computeInitialPage = (data: T[]): number => {
    if (!data) return initialPage;
    return fetchData
      ? Math.max(initialPage + 1, Math.floor(data.length / pageSize) + 1)
      : 2;
  };

  const computeInitialHasMore = (data: T[]): boolean => {
    if (!data) return false;
    return fetchData ? data.length >= pageSize : data.length > pageSize;
  };

  const [visibleData, setVisibleData] = useState<T[]>(() => computeInitialVisible(allItemsOrInitialData));
  const [page, setPage] = useState<number>(() => computeInitialPage(allItemsOrInitialData));
  const [hasMore, setHasMore] = useState<boolean>(() => computeInitialHasMore(allItemsOrInitialData));
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Store callbacks in refs so they never trigger unnecessary resets
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  const keyExtractorRef = useRef(keyExtractor);
  keyExtractorRef.current = keyExtractor;

  // Guard ref to prevent concurrent loadMore calls
  const isLoadingRef = useRef(false);

  // Sync state when allItemsOrInitialData or pageSize changes
  const prevDataRef = useRef(allItemsOrInitialData);
  const prevPageSizeRef = useRef(pageSize);

  if (prevDataRef.current !== allItemsOrInitialData || prevPageSizeRef.current !== pageSize) {
    prevDataRef.current = allItemsOrInitialData;
    prevPageSizeRef.current = pageSize;
    setVisibleData(computeInitialVisible(allItemsOrInitialData));
    setPage(computeInitialPage(allItemsOrInitialData));
    setHasMore(computeInitialHasMore(allItemsOrInitialData));
    isLoadingRef.current = false;
  }

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
          let unique = nextBatch;
          if (currentKeyExtractor) {
            const seen = new Set(visibleData.map(currentKeyExtractor));
            unique = nextBatch.filter(item => !seen.has(currentKeyExtractor(item)));
          }

          if (unique.length > 0) {
            setVisibleData(prev => [...prev, ...unique]);
            setPage(prev => prev + 1);
          }

          setHasMore(nextBatch.length === pageSize && unique.length > 0);
        } else {
          setHasMore(false);
        }
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
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [page, isLoadingMore, hasMore, allItemsOrInitialData, pageSize, visualDelay, visibleData]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback((node: HTMLElement | null) => {
    if (isLoadingMore || isLoadingRef.current) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
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
