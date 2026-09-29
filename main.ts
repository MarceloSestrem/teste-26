//% color="#000080" weight=120 icon="\uf013" block="Super Kit Automação"
//% groups=['Robótica', 'Displays', 'Keypads & Expansores', 'RFID', 'Sensores', 'LEDs & Atuadores']
namespace superKitAutomacao {


    // =======================================================
    // ENUMERAÇÕES
    // =======================================================


    const enum LcdBacklight {
        //% block="desligado"
        Off = 0,
        //% block="ligado"
        On = 8
    }


    const enum TextAlignment {
        //% block="esquerda"
        Left,
        //% block="direita"
        Right,
        //% block="centro"
        Center,
    }


    const enum TextOption {
        //% block="alinhar à esquerda"
        AlignLeft,
        //% block="alinhar à direita"
        AlignRight,
        //% block="centralizar"
        AlignCenter,
        //% block="preencher com zeros"
        PadWithZeros
    }


    const enum LcdChar {
        //% block="1"
        c1 = 0,
        //% block="2"
        c2 = 1,
        //% block="3"
        c3 = 2,
        //% block="4"
        c4 = 3,
        //% block="5"
        c5 = 4,
        //% block="6"
        c6 = 5,
        //% block="7"
        c7 = 6,
        //% block="8"
        c8 = 7
    }


    export enum EstadoLinha {
        //% block="Branco"
        Branco = 0,
        //% block="Preto"
        Preto = 1
    }


    export enum DistanciaUnidade {
        //% block="cm"
        Centimetros = 0,
        //% block="polegadas"
        Polegadas = 1
    }


    export enum MotorSelecao {
        //% block="M1A"
        M1A = 1,
        //% block="M1B"
        M1B = 2,
        //% block="M2A"
        M2A = 3,
        //% block="M2B"
        M2B = 4
    }


    export enum ServoPorta {
        //% block="S1"
        S1 = 1,
        //% block="S2"
        S2 = 2,
        //% block="S3"
        S3 = 3,
        //% block="S4"
        S4 = 4
    }


    export enum LinhasLCD {
        //% block="Linha 1"
        Linha1 = 0,
        //% block="Linha 2"
        Linha2 = 1,
        //% block="Linha 3"
        Linha3 = 2,
        //% block="Linha 4"
        Linha4 = 3
    }


    export enum ModeloLCD {
        //% block="16x2"
        LCD16x2 = 16,
        //% block="20x4"
        LCD20x4 = 20
    }


    export enum AlinhamentoTexto {
        //% block="Esquerda"
        Esquerda = 0,
        //% block="Centro"
        Centro = 1,
        //% block="Direita"
        Direita = 2
    }


    export enum EstadoChave {
        //% block="LIGADO"
        Ligado = 1,
        //% block="DESLIGADO"
        Desligado = 0
    }


    export enum PinoPCF8574 {
        //% block="P0"
        P0 = 0,
        //% block="P1"
        P1 = 1,
        //% block="P2"
        P2 = 2,
        //% block="P3"
        P3 = 3,
        //% block="P4"
        P4 = 4,
        //% block="P5"
        P5 = 5,
        //% block="P6"
        P6 = 6,
        //% block="P7"
        P7 = 7
    }


    // =======================================================
    // CONSTANTES
    // =======================================================


    const PCA9685_ADDRESS = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const PRESCALE = 0xFE
    const LED0_ON_L = 0x06


    let pcaInicializado = false


    let lcdAddr = 0x27
    let oledAddr = 0x3C
    let rfidAddr = 0x24
    let keypadI2cAddr = 0x20


    let pcfStates: { [addr: number]: number } = {}


    // =======================================================
    // FONTE OLED
    // =======================================================


    const FONTE_OLED = [
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x5f, 0x00, 0x00, 0x00, 0x07, 0x00, 0x07, 0x00,
        0x14, 0x7f, 0x14, 0x7f, 0x14, 0x24, 0x2a, 0x7f, 0x2a, 0x12, 0x23, 0x13, 0x08, 0x64, 0x62,
        0x36, 0x49, 0x55, 0x22, 0x50, 0x00, 0x05, 0x03, 0x00, 0x00, 0x00, 0x1c, 0x22, 0x41, 0x00,
        0x00, 0x41, 0x22, 0x1c, 0x00, 0x14, 0x08, 0x3e, 0x08, 0x14, 0x08, 0x08, 0x3e, 0x08, 0x08,
        0x00, 0x50, 0x30, 0x00, 0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x60, 0x60, 0x00, 0x00,
        0x20, 0x10, 0x08, 0x04, 0x02, 0x3e, 0x51, 0x49, 0x45, 0x3e, 0x00, 0x42, 0x7f, 0x40, 0x00,
        0x42, 0x61, 0x51, 0x49, 0x46, 0x21, 0x41, 0x45, 0x4b, 0x31, 0x18, 0x14, 0x12, 0x7f, 0x10,
        0x27, 0x45, 0x45, 0x45, 0x39, 0x3c, 0x4a, 0x49, 0x49, 0x30, 0x01, 0x71, 0x09, 0x05, 0x03,
        0x36, 0x49, 0x49, 0x49, 0x36, 0x06, 0x49, 0x49, 0x29, 0x1e, 0x00, 0x36, 0x36, 0x00, 0x00,
        0x00, 0x56, 0x36, 0x00, 0x00, 0x08, 0x14, 0x22, 0x41, 0x00, 0x24, 0x24, 0x24, 0x24, 0x24,
        0x00, 0x41, 0x22, 0x14, 0x08, 0x02, 0x01, 0x51, 0x09, 0x06, 0x32, 0x49, 0x79, 0x41, 0x3e,
        0x7e, 0x11, 0x11, 0x11, 0x7e, 0x7f, 0x49, 0x49, 0x49, 0x36, 0x3e, 0x41, 0x41, 0x41, 0x22,
        0x7f, 0x41, 0x41, 0x22, 0x1c, 0x7f, 0x49, 0x49, 0x49, 0x41, 0x7f, 0x09, 0x09, 0x09, 0x01,
        0x3e, 0x41, 0x49, 0x49, 0x7a, 0x7f, 0x08, 0x08, 0x08, 0x7f, 0x00, 0x41, 0x7f, 0x41, 0x00,
        0x20, 0x40, 0x41, 0x3f, 0x01, 0x7f, 0x08, 0x14, 0x22, 0x41, 0x7f, 0x40, 0x40, 0x40, 0x40,
        0x7f, 0x02, 0x0c, 0x02, 0x7f, 0x7f, 0x04, 0x08, 0x10, 0x7f, 0x3e, 0x41, 0x41, 0x41, 0x3e,
        0x7f, 0x09, 0x09, 0x09, 0x06, 0x3e, 0x41, 0x51, 0x21, 0x5e, 0x7f, 0x09, 0x19, 0x29, 0x46,
        0x46, 0x49, 0x49, 0x49, 0x31, 0x01, 0x01, 0x7f, 0x01, 0x01, 0x3f, 0x40, 0x40, 0x40, 0x3f,
        0x1f, 0x20, 0x40, 0x20, 0x1f, 0x3f, 0x40, 0x38, 0x40, 0x3f, 0x63, 0x14, 0x08, 0x14, 0x63,
        0x07, 0x08, 0x70, 0x08, 0x07, 0x61, 0x51, 0x49, 0x45, 0x43
    ]


    // =======================================================
    // ROBÓTICA
    // =======================================================


    function initPCA9685(): void {


        if (pcaInicializado) return;


        let buf = pins.createBuffer(2);


        buf.setNumber(NumberFormat.UInt8LE, 0, MODE1);
        buf.setNumber(NumberFormat.UInt8LE, 1, 0x10);
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);


        buf.setNumber(NumberFormat.UInt8LE, 0, PRESCALE);
        buf.setNumber(NumberFormat.UInt8LE, 1, 132);
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);


        buf.setNumber(NumberFormat.UInt8LE, 0, MODE1);
        buf.setNumber(NumberFormat.UInt8LE, 1, 0x81);
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);


        buf.setNumber(NumberFormat.UInt8LE, 0, MODE2);
        buf.setNumber(NumberFormat.UInt8LE, 1, 0x04);
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);


        pcaInicializado = true;
    }


    function writePWM(canal: number, valor: number): void {


        initPCA9685();


        let buf = pins.createBuffer(5);


        buf.setNumber(
            NumberFormat.UInt8LE,
            0,
            LED0_ON_L + (canal * 4)
        );


        buf.setNumber(NumberFormat.UInt8LE, 1, 0);
        buf.setNumber(NumberFormat.UInt8LE, 2, 0);


        buf.setNumber(
            NumberFormat.UInt8LE,
            3,
            valor & 0xFF
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            4,
            (valor >> 8) & 0xFF
        );


        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }


    //% blockId=robotbit_controlar_motor block="mover motor $motor | velocidade $velocidade"
    //% velocidade.min=-255 velocidade.max=255
    //% weight=100 group="Robótica"
    export function controlarMotor(
        motor: MotorSelecao,
        velocidade: number
    ): void {


        let canalM1 = 0;
        let canalM2 = 0;


        if (motor == MotorSelecao.M1A) {
            canalM1 = 2;
            canalM2 = 3;
        }
        else if (motor == MotorSelecao.M1B) {
            canalM1 = 4;
            canalM2 = 5;
        }
        else if (motor == MotorSelecao.M2A) {
            canalM1 = 6;
            canalM2 = 7;
        }
        else if (motor == MotorSelecao.M2B) {
            canalM1 = 8;
            canalM2 = 9;
        }


        let velMapeada = Math.map(
            Math.abs(velocidade),
            0,
            255,
            0,
            4095
        );


        if (velocidade >= 0) {


            writePWM(canalM1, velMapeada);
            writePWM(canalM2, 0);


        }
        else {


            writePWM(canalM1, 0);
            writePWM(canalM2, velMapeada);


        }
    }


    //% blockId=robotbit_controlar_dois_motores block="mover motor 1 $motor1 velocidade $vel1 | e motor 2 $motor2 velocidade $vel2"
    //% vel1.min=-255 vel1.max=255
    //% vel2.min=-255 vel2.max=255
    //% weight=98 group="Robótica" inlineInputMode=inline
    export function controlarDoisMotores(
        motor1: MotorSelecao,
        vel1: number,
        motor2: MotorSelecao,
        vel2: number
    ): void {


        controlarMotor(motor1, vel1);
        controlarMotor(motor2, vel2);
    }


    //% blockId=robotbit_parar_todos_motores block="parar todos os motores"
    //% weight=95 group="Robótica"
    export function pararTodosOsMotores(): void {


        controlarMotor(MotorSelecao.M1A, 0);
        controlarMotor(MotorSelecao.M1B, 0);
        controlarMotor(MotorSelecao.M2A, 0);
        controlarMotor(MotorSelecao.M2B, 0);
    }


    //% blockId=robotbit_controlar_servo block="definir servo na porta $porta | para ângulo $angulo °"
    //% angulo.min=0 angulo.max=180
    //% weight=90 group="Robótica"
    export function controlarServo(
        porta: ServoPorta,
        angulo: number
    ): void {


        let canalChip = 11 + porta;


        let pulso = Math.map(
            angulo,
            0,
            180,
            150,
            500
        );


        writePWM(canalChip, pulso);
    }


    //% blockId=robotbit_ler_tres_sensores block="sensores Esquerdo $pinoEsq Centro $pinoCent Direito $pinoDir leem respectivamente $estEsq $estCent $estDir"
    //% weight=85 group="Robótica" inlineInputMode=inline
    export function lerTresSensores(
        pinoEsq: DigitalPin,
        pinoCent: DigitalPin,
        pinoDir: DigitalPin,
        estEsq: EstadoLinha,
        estCent: EstadoLinha,
        estDir: EstadoLinha
    ): boolean {


        let valEsq = pins.digitalReadPin(pinoEsq);
        let valCent = pins.digitalReadPin(pinoCent);
        let valDir = pins.digitalReadPin(pinoDir);


        return (
            valEsq == estEsq &&
            valCent == estCent &&
            valDir == estDir
        );
    }


    //% blockId=robotbit_ultrassonico_distancia block="distância ultrassônico Trig $trig | Echo $echo em $unidade"
    //% weight=80 group="Robótica"
    export function lerUltrassonico(
        trig: DigitalPin,
        echo: DigitalPin,
        unidade: DistanciaUnidade
    ): number {


        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);


        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);


        pins.digitalWritePin(trig, 0);


        let duracao = pins.pulseIn(
            echo,
            PulseValue.High,
            25000
        );


        if (duracao == 0) return 0;


        if (unidade == DistanciaUnidade.Centimetros) {
            return Math.round(duracao / 58);
        }
        else {
            return Math.round(duracao / 148);
        }
    }


    // =======================================================
    // LCD
    // =======================================================







    // =======================================================
    // CARACTERE PERSONALIZADO LCD
    // ======================================================
    const enum Lcd {
        Command = 0,
        Data = 1
    }


    interface LcdState {
        i2cAddress: number;
        backlight: LcdBacklight;
        characters: Buffer;
        rows: number;
        columns: number;
        rowNeedsUpdate: number;
        refreshIntervalId: number;
        sendBuffer: Buffer;
    }


    let lcdState: LcdState = undefined;


    function connect(): boolean {
        let buf = control.createBuffer(1);
        buf.setNumber(NumberFormat.UInt8LE, 0, 0);


        if (0 == pins.i2cWriteBuffer(39, buf, false)) {
            // PCF8574
            connectLcd(39);
        } else if (0 == pins.i2cWriteBuffer(63, buf, false)) {
            // PCF8574A
            connectLcd(63);
        }
        return !!lcdState;
    }


    // Write 4 bits (high nibble) to I2C bus
    function write4bits(i2cAddress: number, value: number, threeBytesBuffer: Buffer) {
        threeBytesBuffer.setNumber(NumberFormat.Int8LE, 0, value);
        threeBytesBuffer.setNumber(NumberFormat.Int8LE, 1, value | 0x04);
        threeBytesBuffer.setNumber(NumberFormat.Int8LE, 2, value & (0xff ^ 0x04));
        pins.i2cWriteBuffer(i2cAddress, threeBytesBuffer);
    }


    // Send high and low nibble
    function send(RS_bit: number, payload: number) {
        if (!lcdState) {
            return;
        }


        const highnib = (payload & 0xf0) | lcdState.backlight | RS_bit;
        const lownib = ((payload << 4) & 0xf0) | lcdState.backlight | RS_bit;


        lcdState.sendBuffer.setNumber(NumberFormat.Int8LE, 0, highnib);
        lcdState.sendBuffer.setNumber(NumberFormat.Int8LE, 1, highnib | 0x04);
        lcdState.sendBuffer.setNumber(NumberFormat.Int8LE, 2, highnib & (0xff ^ 0x04));
        lcdState.sendBuffer.setNumber(NumberFormat.Int8LE, 3, lownib);
        lcdState.sendBuffer.setNumber(NumberFormat.Int8LE, 4, lownib | 0x04);
        lcdState.sendBuffer.setNumber(NumberFormat.Int8LE, 5, lownib & (0xff ^ 0x04));
        pins.i2cWriteBuffer(lcdState.i2cAddress, lcdState.sendBuffer);
    }


    // Send command
    function sendCommand(command: number) {
        send(Lcd.Command, command);
    }


    // Send data
    function sendData(data: number) {
        send(Lcd.Data, data);
    }


    // Set cursor
    function setCursor(line: number, column: number) {
        const offsets = [0x00, 0x40, 0x14, 0x54];
        sendCommand(0x80 | (offsets[line] + column));
    }


    function requestRedraw() {
        if (!lcdState.refreshIntervalId) {
            lcdState.refreshIntervalId = control.setInterval(refreshDisplay, 100, control.IntervalMode.Timeout);
        }
        basic.pause(0); // Allow refreshDisplay to run
    }


    function initBuffer(columns: number, rows: number) {
        if (lcdState && lcdState.columns === 0) {
            lcdState.columns = columns;
            lcdState.rows = rows;
            lcdState.characters = pins.createBuffer(lcdState.rows * lcdState.columns);


            // Clear display and buffer
            const whitespace = " ".charCodeAt(0);
            for (let pos = 0; pos < lcdState.rows * lcdState.columns; pos++) {
                lcdState.characters[pos] = whitespace;
            }
            updateCharacterBuffer(
                "",
                0,
                lcdState.columns * lcdState.rows,
                lcdState.columns,
                lcdState.rows,
                TextAlignment.Left,
                " "
            );
        }
    }


    export function updateCharacterBuffer(
        text: string,
        offset: number,
        length: number,
        columns: number,
        rows: number,
        alignment: TextAlignment,
        pad: string
    ): void {
        if (!lcdState && !connect()) {
            return;
        }


        initBuffer(columns, rows);


        if (columns !== lcdState.columns || rows !== lcdState.rows) {
            return;
        }


        if (offset < 0) {
            offset = 0;
        }


        const fillCharacter =
            pad.length > 0 ? pad.charCodeAt(0) : " ".charCodeAt(0);


        let endPosition = offset + length;
        if (endPosition > lcdState.columns * lcdState.rows) {
            endPosition = lcdState.columns * lcdState.rows;
        }
        let lcdPos = offset;


        // Add padding at the beginning
        let paddingEnd = offset;


        if (alignment === TextAlignment.Right) {
            paddingEnd = endPosition - text.length;
        }
        else if (alignment === TextAlignment.Center) {
            paddingEnd = offset + Math.idiv(endPosition - offset - text.length, 2);
        }


        while (lcdPos < paddingEnd) {
            if (lcdState.characters[lcdPos] != fillCharacter) {
                lcdState.characters[lcdPos] = fillCharacter;
                invalidateLcdPosition(lcdPos);
            }
            lcdPos++;
        }


        // Copy the text
        let textPosition = 0;
        while (lcdPos < endPosition && textPosition < text.length) {
            if (lcdState.characters[lcdPos] != text.charCodeAt(textPosition)) {
                lcdState.characters[lcdPos] = text.charCodeAt(textPosition);
                invalidateLcdPosition(lcdPos);
            }
            lcdPos++;
            textPosition++;
        }


        // Add padding at the end
        while (lcdPos < endPosition) {
            if (lcdState.characters[lcdPos] != fillCharacter) {
                lcdState.characters[lcdPos] = fillCharacter;
                invalidateLcdPosition(lcdPos);
            }
            lcdPos++;
        }


        requestRedraw();
    }


    function sendRowRepeated(row: number): void {
        setCursor(row, 0);


        for (let position = lcdState.columns * row; position < lcdState.columns * (row + 1); position++) {
            sendData(lcdState.characters[position]);
        }
    }


    function refreshDisplay() {
        if (!lcdState) {
            return;
        }
        lcdState.refreshIntervalId = undefined;


        for (let i = 0; i < lcdState.rows; i++) {
            if (lcdState.rowNeedsUpdate & (1 << i)) {
                lcdState.rowNeedsUpdate &= ~(1 << i);
                sendRowRepeated(i);
            }
        }
    }


    export function toAlignment(option?: TextOption): TextAlignment {
        if (
            option === TextOption.AlignRight ||
            option === TextOption.PadWithZeros
        ) {
            return TextAlignment.Right;
        } else if (option === TextOption.AlignCenter) {
            return TextAlignment.Center;
        } else {
            return TextAlignment.Left;
        }
    }


    export function toPad(option?: TextOption): string {
        if (option === TextOption.PadWithZeros) {
            return "0";
        } else {
            return " ";
        }
    }


    /**
     * Liga ou desliga a luz de fundo do LCD.
     * @param backlight novo estado da luz de fundo, ex: LcdBacklight.Off
     */
    //% group="Displays"
    //% blockId="superkitautomacao_lcd_backlight" block="mudar luz de fundo do LCD para %backlight"
    //% weight=50
    export function setLcdBacklight(backlight: LcdBacklight): void {
        if (!lcdState && !connect()) {
            return;
        }
        lcdState.backlight = backlight;
        send(Lcd.Command, 0);
    }


    /**
     * Conecta ao LCD em um endereço I2C específico.
     * @param i2cAddress Endereço I2C do LCD (0 a 127), ex: 39
     */
    //% group="Displays"
    //% blockId="superkitautomacao_lcd_set_address" block="conectar LCD no endereço I2C %i2cAddress"
    //% i2cAddress.min=0 i2cAddress.max=127
    //% weight=100
    export function connectLcd(i2cAddress: number): void {


        if (lcdState && lcdState.i2cAddress == i2cAddress) {
            return;
        }


        if (lcdState && lcdState.refreshIntervalId) {
            control.clearInterval(lcdState.refreshIntervalId, control.IntervalMode.Timeout);
            lcdState.refreshIntervalId = undefined;
        }


        lcdState = {
            i2cAddress: i2cAddress,
            backlight: LcdBacklight.On,
            columns: 0,
            rows: 0,
            characters: undefined,
            rowNeedsUpdate: 0,
            refreshIntervalId: undefined,
            sendBuffer: pins.createBuffer(6 * pins.sizeOf(NumberFormat.Int8LE))
        };


        basic.pause(50);


        pins.i2cWriteNumber(
            lcdState.i2cAddress,
            lcdState.backlight,
            NumberFormat.Int8LE
        );
        basic.pause(50);


        // Set 4bit mode
        const buf = pins.createBuffer(3 * pins.sizeOf(NumberFormat.Int8LE));
        write4bits(i2cAddress, 0x30, buf);
        control.waitMicros(4100);
        write4bits(i2cAddress, 0x30, buf);
        control.waitMicros(4100);
        write4bits(i2cAddress, 0x30, buf);
        control.waitMicros(4100);
        write4bits(i2cAddress, 0x20, buf);
        control.waitMicros(1000);


        // Configure function set
        const LCD_FUNCTIONSET = 0x20;
        const LCD_4BITMODE = 0x00;
        const LCD_2LINE = 0x08;
        const LCD_5x8DOTS = 0x00;
        send(Lcd.Command, LCD_FUNCTIONSET | LCD_4BITMODE | LCD_2LINE | LCD_5x8DOTS);
        control.waitMicros(1000);


        // Configure display
        const LCD_DISPLAYCONTROL = 0x08;
        const LCD_DISPLAYON = 0x04;
        const LCD_CURSOROFF = 0x00;
        const LCD_BLINKOFF = 0x00;
        send(
            Lcd.Command,
            LCD_DISPLAYCONTROL | LCD_DISPLAYON | LCD_CURSOROFF | LCD_BLINKOFF
        );
        control.waitMicros(1000);


        // Set entry mode
        const LCD_ENTRYMODESET = 0x04;
        const LCD_ENTRYLEFT = 0x02;
        const LCD_ENTRYSHIFTDECREMENT = 0x00;
        send(
            Lcd.Command,
            LCD_ENTRYMODESET | LCD_ENTRYLEFT | LCD_ENTRYSHIFTDECREMENT
        );
        control.waitMicros(1000);
    }


    /**
     * Retorna true se o LCD estiver conectado.
     */
    //% subcategory="LCD"
    //% blockId="superkitautomacao_lcd_is_connected" block="LCD está conectado"
    //% weight=69
    export function isLcdConnected(): boolean {
        return !!lcdState || connect();
    }


    /**
     * Grava um caractere customizado na memória do LCD usando a matriz 5x8.
     */
    //% group="Displays"
    //% blockId="superkitautomacao_lcd_makecharacter"
    //% block="criar caractere %char|%im"
    //% weight=60
    export function lcdMakeCharacter(char: LcdChar, im: Image): void {
        if (!lcdState && !connect()) {
            return;
        }


        const customChar = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 5; x++) {
                if (im.pixel(x, y)) {
                    customChar[y] |= 1 << (4 - x);
                }
            }
        }
        const LCD_SETCGRAMADDR = 0x40;
        sendCommand(LCD_SETCGRAMADDR | (char << 3));
        for (let y = 0; y < 8; y++) {
            sendData(customChar[y]);
        }
        control.waitMicros(1000);
    }


    /**
     * Matriz de pixels 5x8 para desenhar o caractere no editor de blocos.
     */
    //% group="Displays"
    //% blockId="superkitautomacao_lcd_characterpixels"
    //% block="caractere"
    //% imageLiteral=1
    //% imageLiteralColumns=5
    //% imageLiteralRows=8
    //% imageLiteralScale=0.6
    //% shim=images::createImage
    //% weight=59
    export function lcdCharacterPixels(i: string): Image {
        return <Image><any>"00000:00000:00000:00000:00000:00000:00000:00000";
    }


    export function setCharacter(char: number, offset: number, columns: number, rows: number): void {
        if (!lcdState && !connect()) {
            return;
        }


        initBuffer(columns, rows);


        if (columns !== lcdState.columns || rows !== lcdState.rows) {
            return;
        }


        if (offset < 0 || offset >= lcdState.rows * lcdState.columns) {
            return;
        }


        lcdState.characters[offset] = char;
        invalidateLcdPosition(offset);
        requestRedraw();
    }


    function invalidateLcdPosition(lcdPos: number) {
        lcdState.rowNeedsUpdate |= (1 << Math.idiv(lcdPos, lcdState.columns));
    }




    // =======================================================
    // OLED
    // =======================================================


    //% blockId=superkit_init_oled block="inicializar Tela OLED I2C endereço $addr"
    //% addr.defl=0x3C
    //% weight=88 group="Displays"
    export function inicializarOLED(
        addr: number
    ): void {


        oledAddr = addr;


        let cmds = [
            0xAE, 0xD5, 0x80,
            0xA8, 0x3F, 0xD3,
            0x00, 0x40, 0x8D,
            0x14, 0x20, 0x00,
            0xA1, 0xC8, 0xDA,
            0x12, 0x81, 0xCF,
            0xD9, 0xF1, 0xDB,
            0x40, 0xA4, 0xA6,
            0xAF
        ];


        for (let c of cmds) {


            let buf =
                pins.createBuffer(2);


            buf.setNumber(
                NumberFormat.UInt8LE,
                0,
                0x00
            );


            buf.setNumber(
                NumberFormat.UInt8LE,
                1,
                c
            );


            pins.i2cWriteBuffer(
                oledAddr,
                buf
            );
        }


        limparOLED();
    }


    //% blockId=superkit_clear_oled block="limpar Tela OLED"
    //% weight=86 group="Displays"
    export function limparOLED(): void {


        for (
            let pagina = 0;
            pagina < 8;
            pagina++
        ) {


            setPosicaoOLED(
                0,
                pagina
            );


            let buf =
                pins.createBuffer(17);


            buf.setNumber(
                NumberFormat.UInt8LE,
                0,
                0x40
            );


            for (
                let i = 1;
                i < 17;
                i++
            ) {


                buf.setNumber(
                    NumberFormat.UInt8LE,
                    i,
                    0x00
                );
            }


            for (
                let x = 0;
                x < 8;
                x++
            ) {


                pins.i2cWriteBuffer(
                    oledAddr,
                    buf
                );
            }
        }
    }


    function setPosicaoOLED(
        coluna: number,
        pagina: number
    ): void {


        let buf =
            pins.createBuffer(2);


        buf.setNumber(
            NumberFormat.UInt8LE,
            0,
            0x00
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            1,
            0xB0 | pagina
        );


        pins.i2cWriteBuffer(
            oledAddr,
            buf
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            1,
            0x00 |
            (coluna & 0x0F)
        );


        pins.i2cWriteBuffer(
            oledAddr,
            buf
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            1,
            0x10 |
            ((coluna >> 4) & 0x0F)
        );


        pins.i2cWriteBuffer(
            oledAddr,
            buf
        );
    }


    //% blockId=superkit_print_oled block="OLED mostrar texto $texto | na Coluna $x Linha $y"
    //% x.min=0 x.max=120 y.min=0 y.max=7
    //% weight=84 group="Displays"
    export function mostrarTextoOLED(
        texto: string,
        x: number,
        y: number
    ): void {


        setPosicaoOLED(
            x,
            y
        );


        for (
            let k = 0;
            k < texto.length;
            k++
        ) {


            let charCode =
                texto.charCodeAt(k);


            let indiceFonte =
                (charCode - 32) * 5;


            if (
                indiceFonte < 0 ||
                indiceFonte >=
                FONTE_OLED.length
            ) {


                indiceFonte = 0;
            }


            let buf =
                pins.createBuffer(6);


            buf.setNumber(
                NumberFormat.UInt8LE,
                0,
                0x40
            );


            for (
                let i = 0;
                i < 5;
                i++
            ) {


                buf.setNumber(
                    NumberFormat.UInt8LE,
                    i + 1,
                    FONTE_OLED[
                    indiceFonte + i
                    ]
                );
            }


            pins.i2cWriteBuffer(
                oledAddr,
                buf
            );
        }
    }


    // =======================================================
    // KEYPAD E EXPANSORES
    // =======================================================


    //% blockId=superkit_read_keypad block="varrer Keypad 4x4 pino L1 $l1 L2 $l2 L3 $l3 L4 $l4 C1 $c1 C2 $c2 C3 $c3 C4 $c4"
    //% weight=100 group="Keypads & Expansores" inlineInputMode=inline
    export function lerKeypad4x4(
        l1: DigitalPin,
        l2: DigitalPin,
        l3: DigitalPin,
        l4: DigitalPin,
        c1: DigitalPin,
        c2: DigitalPin,
        c3: DigitalPin,
        c4: DigitalPin
    ): string {


        let teclas = [
            "1", "2", "3", "A",
            "4", "5", "6", "B",
            "7", "8", "9", "C",
            "*", "0", "#", "D"
        ];


        let linhas = [
            l1, l2, l3, l4
        ];


        let colunas = [
            c1, c2, c3, c4
        ];


        for (
            let c = 0;
            c < 4;
            c++
        ) {


            pins.setPull(
                colunas[c],
                PinPullMode.PullUp
            );
        }


        for (
            let r = 0;
            r < 4;
            r++
        ) {


            pins.digitalWritePin(
                linhas[r],
                0
            );


            for (
                let c = 0;
                c < 4;
                c++
            ) {


                if (
                    pins.digitalReadPin(
                        colunas[c]
                    ) == 0
                ) {


                    pins.digitalWritePin(
                        linhas[r],
                        1
                    );


                    return teclas[
                        r * 4 + c
                    ];
                }
            }


            pins.digitalWritePin(
                linhas[r],
                1
            );
        }


        return "";
    }


    //% blockId=superkit_init_i2c_keypad block="configurar Keypad I2C endereço $addr"
    //% addr.defl=0x20
    //% weight=95 group="Keypads & Expansores"
    export function configurarKeypadI2C(
        addr: number
    ): void {


        keypadI2cAddr = addr;


        let buf =
            pins.createBuffer(1);


        buf.setNumber(
            NumberFormat.UInt8LE,
            0,
            0xFF
        );


        pins.i2cWriteBuffer(
            keypadI2cAddr,
            buf
        );
    }


    //% blockId=superkit_read_i2c_keypad block="varrer Keypad 4x4 via I2C"
    //% weight=90 group="Keypads & Expansores"
    export function lerKeypadI2C(): string {


        let teclas = [
            "1", "2", "3", "A",
            "4", "5", "6", "B",
            "7", "8", "9", "C",
            "*", "0", "#", "D"
        ];


        for (
            let r = 0;
            r < 4;
            r++
        ) {


            let wBuf =
                pins.createBuffer(1);


            wBuf.setNumber(
                NumberFormat.UInt8LE,
                0,
                0xFF & ~(1 << r)
            );


            pins.i2cWriteBuffer(
                keypadI2cAddr,
                wBuf
            );


            let rBuf =
                pins.i2cReadBuffer(
                    keypadI2cAddr,
                    1
                );


            let leitura =
                rBuf.getNumber(
                    NumberFormat.UInt8LE,
                    0
                );


            for (
                let c = 0;
                c < 4;
                c++
            ) {


                if (
                    (
                        (leitura >>
                            (4 + c)) &
                        0x01
                    ) == 0
                ) {


                    let rstBuf =
                        pins.createBuffer(1);


                    rstBuf.setNumber(
                        NumberFormat.UInt8LE,
                        0,
                        0xFF
                    );


                    pins.i2cWriteBuffer(
                        keypadI2cAddr,
                        rstBuf
                    );


                    return teclas[
                        r * 4 + c
                    ];
                }
            }
        }


        return "";
    }


    //% blockId=superkit_write_pcf8574 block="expansor PCF8574 endereço $addr | enviar byte $byteData"
    //% addr.defl=0x20
    //% weight=85 group="Keypads & Expansores"
    export function writePCF8574(
        addr: number,
        byteData: number
    ): void {


        pcfStates[addr] =
            byteData;


        let buf =
            pins.createBuffer(1);


        buf.setNumber(
            NumberFormat.UInt8LE,
            0,
            byteData
        );


        pins.i2cWriteBuffer(
            addr,
            buf
        );
    }


    //% blockId=superkit_write_pcf8574_pin block="expansor PCF8574 endereço $addr | pino $pino como $estado"
    //% addr.defl=0x20
    //% weight=84 group="Keypads & Expansores"
    export function controlarPinoPCF8574(
        addr: number,
        pino: PinoPCF8574,
        estado: EstadoChave
    ): void {


        let currentState =
            (
                pcfStates[addr] !== undefined
            )
                ? pcfStates[addr]
                : 0xFF;


        if (
            estado ==
            EstadoChave.Ligado
        ) {


            currentState |=
                (1 << pino);
        }
        else {


            currentState &=
                ~(1 << pino);
        }


        writePCF8574(
            addr,
            currentState
        );
    }


    //% blockId=superkit_read_pcf8574_pin block="expansor PCF8574 endereço $addr | ler pino $pino"
    //% addr.defl=0x20
    //% weight=83 group="Keypads & Expansores"
    export function lerPinoPCF8574(
        addr: number,
        pino: PinoPCF8574
    ): number {


        let rBuf =
            pins.i2cReadBuffer(
                addr,
                1
            );


        let val =
            rBuf.getNumber(
                NumberFormat.UInt8LE,
                0
            );


        return (
            (val & (1 << pino)) != 0
        )
            ? 1
            : 0;
    }


    // =======================================================
    // RFID
    // =======================================================


    //% blockId=superkit_init_rfid block="inicializar Leitor RFID PN532 via I2C"
    //% weight=100 group="RFID"
    export function inicializarPN532(): boolean {


        let buf =
            pins.createBuffer(7);


        buf.setNumber(
            NumberFormat.UInt8LE,
            0,
            0x00
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            1,
            0x00
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            2,
            0xFF
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            3,
            0x03
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            4,
            0xFC
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            5,
            0xD4
        );


        buf.setNumber(
            NumberFormat.UInt8LE,
            6,
            0x14
        );


        pins.i2cWriteBuffer(
            rfidAddr,
            buf
        );


        return true;
    }


    //% blockId=superkit_read_rfid_uid block="ler UID da tag RFID presente"
    //% weight=95 group="RFID"
    export function lerTagUID(): string {


        let cmd =
            pins.createBuffer(9);


        cmd.setNumber(
            NumberFormat.UInt8LE,
            0,
            0x00
        );


        cmd.setNumber(
            NumberFormat.UInt8LE,
            1,
            0x00
        );


        cmd.setNumber(
            NumberFormat.UInt8LE,
            2,
            0xFF
        );


        cmd.setNumber(
            NumberFormat.UInt8LE,
            3,
            0x04
        );


        cmd.setNumber(
            NumberFormat.UInt8LE,
            4,
            0xFC
        );


        cmd.setNumber(
            NumberFormat.UInt8LE,
            5,
            0xD4
        );


        cmd.setNumber(
            NumberFormat.UInt8LE,
            6,
            0x4A
        );


        cmd.setNumber(
            NumberFormat.UInt8LE,
            7,
            0x01
        );


        cmd.setNumber(
            NumberFormat.UInt8LE,
            8,
            0x00
        );


        pins.i2cWriteBuffer(
            rfidAddr,
            cmd
        );


        basic.pause(30);


        let response =
            pins.i2cReadBuffer(
                rfidAddr,
                20
            );


        if (
            response.getNumber(
                NumberFormat.UInt8LE,
                6
            ) == 0x4B
        ) {


            let uid = "";


            let numBytes =
                response.getNumber(
                    NumberFormat.UInt8LE,
                    12
                );


            let hexChars =
                "0123456789ABCDEF";


            for (
                let i = 0;
                i < numBytes;
                i++
            ) {


                let byteValor =
                    response.getNumber(
                        NumberFormat.UInt8LE,
                        13 + i
                    );


                uid +=
                    hexChars.charAt(
                        (byteValor >> 4) &
                        0x0F
                    ) +
                    hexChars.charAt(
                        byteValor &
                        0x0F
                    );
            }


            return uid;
        }


        return "";
    }


    // =======================================================
    // SENSORES
    // =======================================================


    //% blockId=superkit_sensor_agua block="sensor de água/chuva no pino analógico $pino"
    //% weight=100 group="Sensores"
    export function lerSensorAgua(
        pino: AnalogPin
    ): number {


        return pins.analogReadPin(
            pino
        );
    }


    //% blockId=superkit_sensor_gas block="sensor de gás no pino analógico $pino"
    //% weight=95 group="Sensores"
    export function lerSensorGas(
        pino: AnalogPin
    ): number {


        return pins.analogReadPin(
            pino
        );
    }


    //% blockId=superkit_sensor_umidade_solo block="umidade do solo (0-100%%) no pino analógico $pino"
    //% weight=90 group="Sensores"
    export function lerUmidadeSolo(
        pino: AnalogPin
    ): number {


        let leitura =
            pins.analogReadPin(pino);


        let porcentagem =
            Math.map(
                leitura,
                0,
                1023,
                0,
                100
            );


        return Math.clamp(
            0,
            100,
            Math.round(porcentagem)
        );
    }


    //% blockId=superkit_sensor_ldr block="luminosidade LDR no pino analógico $pino"
    //% weight=85 group="Sensores"
    export function lerLuminosidadeLDR(
        pino: AnalogPin
    ): number {


        return pins.analogReadPin(
            pino
        );
    }


    //% blockId=superkit_ler_porta_digital block="ler porta digital $pino"
    //% weight=80 group="Sensores"
    export function lerPortaDigital(
        pino: DigitalPin
    ): number {


        return pins.digitalReadPin(
            pino
        );
    }


    //% blockId=superkit_ler_porta_analogica block="ler porta analógica $pino"
    //% weight=75 group="Sensores"
    export function lerPortaAnalogica(
        pino: AnalogPin
    ): number {


        return pins.analogReadPin(
            pino
        );
    }


    // =======================================================
    // LEDS E ATUADORES
    // =======================================================


    //% blockId=superkit_rele_bomba block="definir Relé / Bomba D'água no pino $pino como $estado"
    //% weight=100 group="LEDs & Atuadores"
    export function controlarReleBomba(
        pino: DigitalPin,
        estado: EstadoChave
    ): void {


        pins.digitalWritePin(
            pino,
            estado
        );
    }


    //% blockId=superkit_led_digital block="definir LED no pino digital $pino como $estado"
    //% weight=95 group="LEDs & Atuadores"
    export function controlarLEDDigital(
        pino: DigitalPin,
        estado: EstadoChave
    ): void {


        pins.digitalWritePin(
            pino,
            estado
        );
    }


    //% blockId=superkit_led_dimerizado block="ajustar brilho do LED no pino analógico $pino em $porcentagem %%"
    //% porcentagem.min=0 porcentagem.max=100
    //% weight=90 group="LEDs & Atuadores"
    export function controlarBrilhoLED(
        pino: AnalogPin,
        porcentagem: number
    ): void {


        let pwmValor =
            Math.map(
                Math.clamp(
                    0,
                    100,
                    porcentagem
                ),
                0,
                100,
                0,
                1023
            );


        pins.analogWritePin(
            pino,
            Math.round(pwmValor)
        );
    }


    //% blockId=superkit_led_rgb block="definir LED RGB | Pino R $pinoR Pino G $pinoG Pino B $pinoB | Red $r Green $g Blue $b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% weight=85 group="LEDs & Atuadores" inlineInputMode=inline
    export function controlarLEDRGB(
        pinoR: AnalogPin,
        pinoG: AnalogPin,
        pinoB: AnalogPin,
        r: number,
        g: number,
        b: number
    ): void {


        pins.analogWritePin(
            pinoR,
            Math.map(
                Math.clamp(0, 255, r),
                0,
                255,
                0,
                1023
            )
        );


        pins.analogWritePin(
            pinoG,
            Math.map(
                Math.clamp(0, 255, g),
                0,
                255,
                0,
                1023
            )
        );


        pins.analogWritePin(
            pinoB,
            Math.map(
                Math.clamp(0, 255, b),
                0,
                255,
                0,
                1023
            )
        );
    }


    //% blockId=superkit_controlar_semaforo block="semáforo de veículos | Verde $pinoV Amarelo $pinoA Vermelho $pinoVm | Verde $estV Amarelo $estA Vermelho $estVm"
    //% weight=80 group="LEDs & Atuadores" inlineInputMode=inline
    export function controlarSemaforo(
        pinoV: DigitalPin,
        pinoA: DigitalPin,
        pinoVm: DigitalPin,
        estV: EstadoChave,
        estA: EstadoChave,
        estVm: EstadoChave
    ): void {


        pins.digitalWritePin(
            pinoV,
            estV
        );


        pins.digitalWritePin(
            pinoA,
            estA
        );


        pins.digitalWritePin(
            pinoVm,
            estVm
        );
    }


    //% blockId=superkit_controlar_semaforo_pedestre block="semáforo de pedestre | Verde $pinoV Vermelho $pinoVm | Verde $estV Vermelho $estVm"
    //% weight=78 group="LEDs & Atuadores" inlineInputMode=inline
    export function controlarSemaforoPedestre(
        pinoV: DigitalPin,
        pinoVm: DigitalPin,
        estV: EstadoChave,
        estVm: EstadoChave
    ): void {


        pins.digitalWritePin(
            pinoV,
            estV
        );


        pins.digitalWritePin(
            pinoVm,
            estVm
        );
    }




    // =======================================================
    // NOVOS BLOCOS — STRING, NÚMERO E CARACTERE
    // =======================================================
    // Estes três blocos são adicionais.
    // Nenhuma função ou bloco existente foi alterado.

    //% blockId=superkitautomacao_lcd_string_novo
    //% block="LCD mostrar string %texto na $linha"
    //% weight=47 group="Displays"
    export function lcdMostrarStringNovo(
        texto: string,
        linha: LinhasLCD
    ): void {
        if (!lcdState && !connect()) {
            return;
        }

        initBuffer(16, 2);

        if (linha >= lcdState.rows) {
            return;
        }

        updateCharacterBuffer(
            texto,
            linha * lcdState.columns,
            lcdState.columns,
            lcdState.columns,
            lcdState.rows,
            TextAlignment.Left,
            " "
        );
    }


    //% blockId=superkitautomacao_lcd_numero_novo
    //% block="LCD mostrar número %numero na $linha"
    //% weight=46 group="Displays"
    export function lcdMostrarNumeroNovo(
        numero: number,
        linha: LinhasLCD
    ): void {
        lcdMostrarStringNovo("" + numero, linha);
    }


    //% blockId=superkitautomacao_lcd_caractere_novo
    //% block="LCD mostrar caractere %caractere na $linha"
    //% weight=45 group="Displays"
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



