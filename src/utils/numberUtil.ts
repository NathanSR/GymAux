import { ChangeEvent, FocusEvent } from "react";

/**
 * Utilitário para lidar com inputs numéricos de forma mais amigável.
 * Resolve o problema de não conseguir apagar o valor '0' e facilita a edição ao selecionar tudo no foco.
 */
export const numberInputUtils = {
    /**
     * Seleciona todo o conteúdo do input ao ganhar foco.
     * Isso permite que o usuário comece a digitar um novo valor imediatamente,
     * sobrescrevendo o valor atual sem precisar apagar manualmente.
     */
    onFocus: (e: FocusEvent<HTMLInputElement>) => {
        e.target.select();
    },

    /**
     * Formata o valor para exibição no input.
     * Se o valor for 0 e quisermos permitir que ele seja "apagável", 
     * podemos retornar uma string vazia ou o próprio valor.
     * 
     * @param value O valor numérico atual
     * @returns O valor formatado para o atributo 'value' do input
     */
    formatValue: (value: number | undefined | null): string | number => {
        if (value === null || value === undefined) return "";
        return value;
    },

    /**
     * Processa a mudança de valor no input.
     * Permite que o campo fique vazio (string vazia) para que o usuário possa apagar tudo.
     * 
     * @param e O evento de mudança
     * @param callback Função para atualizar o estado com o novo número ou string vazia
     */
    onChange: (e: ChangeEvent<HTMLInputElement>, callback: (val: number | "") => void) => {
        const val = e.target.value;
        if (val === "") {
            callback("");
            return;
        }
        
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            callback(parsed);
        }
    }
};
