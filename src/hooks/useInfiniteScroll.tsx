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

  // Maintain latest values in refs to keep callbacks and observers stable
  const visibleDataRef = useRef(visibleData);
  visibleDataRef.current = visibleData;

  const pageRef = useRef(page);
  pageRef.current = page;

  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  const isLoadingRef = useRef(false);

  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  const keyExtractorRef = useRef(keyExtractor);
  keyExtractorRef.current = keyExtractor;

  const allItemsRef = useRef(allItemsOrInitialData);
  allItemsRef.current = allItemsOrInitialData;

  const pageSizeRef = useRef(pageSize);
  pageSizeRef.current = pageSize;

  // Sync state when allItemsOrInitialData changes
  const prevDataRef = useRef(allItemsOrInitialData);

  useEffect(() => {
    if (prevDataRef.current !== allItemsOrInitialData) {
      prevDataRef.current = allItemsOrInitialData;
      const newVisible = computeInitialVisible(allItemsOrInitialData);
      const newPage = computeInitialPage(allItemsOrInitialData);
      const newHasMore = computeInitialHasMore(allItemsOrInitialData);

      setVisibleData(newVisible);
      setPage(newPage);
      setHasMore(newHasMore);
      pageRef.current = newPage;
      hasMoreRef.current = newHasMore;
      visibleDataRef.current = newVisible;
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [allItemsOrInitialData, pageSize]);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    setIsLoadingMore(true);

    try {
      if (visualDelay) {
        await new Promise(res => setTimeout(res, visualDelay));
      }

      const currentFetchData = fetchDataRef.current;
      const currentKeyExtractor = keyExtractorRef.current;
      const currentPage = pageRef.current;
      const currentPageSize = pageSizeRef.current;

      if (currentFetchData) {
        // True pagination
        const nextBatch = await currentFetchData(currentPage, currentPageSize);

        if (nextBatch && nextBatch.length > 0) {
          let unique = nextBatch;
          if (currentKeyExtractor) {
            const seen = new Set(visibleDataRef.current.map(currentKeyExtractor));
            unique = nextBatch.filter(item => !seen.has(currentKeyExtractor(item)));
          }

          if (unique.length > 0) {
            setVisibleData(prev => [...prev, ...unique]);
            setPage(prev => {
              const nextPage = prev + 1;
              pageRef.current = nextPage;
              return nextPage;
            });
          }

          const canHaveMore = nextBatch.length === currentPageSize && unique.length > 0;
          setHasMore(canHaveMore);
          hasMoreRef.current = canHaveMore;
        } else {
          setHasMore(false);
          hasMoreRef.current = false;
        }
      } else {
        // Legacy slicing
        const currentAllItems = allItemsRef.current;
        const start = (currentPage - 1) * currentPageSize;
        const end = start + currentPageSize;
        const nextBatch = currentAllItems.slice(start, end);

        if (nextBatch.length > 0) {
          setVisibleData(prev => [...prev, ...nextBatch]);
          setPage(prev => {
            const nextPage = prev + 1;
            pageRef.current = nextPage;
            return nextPage;
          });
        }
        const canHaveMore = end < currentAllItems.length;
        setHasMore(canHaveMore);
        hasMoreRef.current = canHaveMore;
      }
    } catch (error) {
      console.error('Error fetching more items:', error);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [visualDelay]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback((node: HTMLElement | null) => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }

    if (!node) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
        loadMore();
      }
    }, { threshold: 0.1 });

    observer.current.observe(node);
  }, [loadMore]);

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

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

