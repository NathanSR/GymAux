/**
 * Promessa que rejeita após um determinado tempo.
 */
export function timeout(ms: number, message = 'Timeout'): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

/**
 * Executa uma operação com tempo limite, garantindo a limpeza do timer e
 * preservando a inferência de tipo correta para Promises e Thenables (Supabase).
 */
export async function withTimeout<T>(promise: T, ms: number = 5000): Promise<Awaited<T>> {
  let timeoutId: any;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  try {
    // Promise.race com Awaited<T> garante que o tipo retornado seja o valor resolvido
    return await (Promise.race([promise, timeoutPromise]) as Promise<Awaited<T>>);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
