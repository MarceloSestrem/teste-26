export function lcdMostrarCaractereNovo(
    caractere: string,
    linha: LinhasLCD
): void {
    if (caractere.length == 0) {
        return;
    }

    lcdMostrarStringNovo(
        caractere.charAt(0),
        linha
    );
}
}