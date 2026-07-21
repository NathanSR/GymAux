import { useTopLoader } from 'nextjs-toploader';

/**
 * Inicia a barra de progresso (top loader).
 * Usa um pequeno delay (10ms) para evitar que o listener de pushState/replaceState
 * do nextjs-toploader encerre a animação imediatamente no momento em que a navegação do Next.js inicia.
 */
export const startTopLoader = () => {
    if (typeof window !== 'undefined') {
        setTimeout(() => {
            try {
                const loader = useTopLoader();
                loader.start();
            } catch (err) {
                console.error('[topLoader] start error:', err);
            }
        }, 10);
    }
};

/**
 * Finaliza e remove a barra de progresso (top loader).
 */
export const stopTopLoader = () => {
    if (typeof window !== 'undefined') {
        try {
            const loader = useTopLoader();
            loader.done();
        } catch (err) {
            console.error('[topLoader] stop error:', err);
        }
    }
};
