//% color="#0fbc11" icon="\uf12e" block="SuperKit"
//% groups=['Robótica', 'Displays', 'Keypads & Expansores', 'RFID', 'Sensores', 'LEDs & Atuadores']
namespace superkit {

    // =======================================================
    // ENUMERAÇÕES
    // =======================================================

    export enum LcdBacklight {
        //% block="Desligado"
        Off = 0,
        //% block="Ligado"
        On = 0x08
    }

    export enum LcdCommand {
        Command = 0,
        Data = 1
    }

    export enum Direction {
        //% block="Frente"
        Forward = 1,
        //% block="Trás"
        Backward = 2,
        //% block="Esquerda"
        Left = 3,
        //% block="Direita"
        Right = 4,
        //% block="Parar"
        Stop = 0
    }

    export enum DistanceUnit {
        //% block="cm"
        Centimeters,
        //% block="polegadas"
        Inches
    }

    // =======================================================
    // ESTADOS GLOBAIS DO LCD
    // =======================================================

    class LcdState {
        addr: number;
        backlight: number;
        rows: number;
        cols: number;
    }

    let lcdState: LcdState = null;

    // =======================================================
    // GRUPO: DISPLAYS (LCD I2C PCF8574)
    // =======================================================

    function write4bits(addr: number, value: number): void {
        let bl = lcdState ? lcdState.backlight : LcdBacklight.On;
        pins.i2cWriteNumber(addr, value | bl, NumberFormat.UInt8LE);
        control.waitMicros(1);
        // Pulso no pino Enable (E)
        pins.i2cWriteNumber(addr, (value | 0x04) | bl, NumberFormat.UInt8LE);
        control.waitMicros(1);
        pins.i2cWriteNumber(addr, (value & ~0x04) | bl, NumberFormat.UInt8LE);
        control.waitMicros(50);
    }

    function send(mode: number, value: number): void {
        if (!lcdState) return;
        let highNibble = value & 0xF0;
        let lowNibble = (value << 4) & 0xF0;
        let rs = mode === LcdCommand.Data ? 0x01 : 0x00;

        write4bits(lcdState.addr, highNibble | rs);
        write4bits(lcdState.addr, lowNibble | rs);
    }

    export function sendCommand(comando: number): void {
        send(LcdCommand.Command, comando);
    }

    export function sendData(dado: number): void {
        send(LcdCommand.Data, dado);
    }

    //% blockId=superkit_lcd_init block="inicializar LCD I2C no endereço %addr| colunas %cols| linhas %rows"
    //% addr.defl=0x27 cols.defl=16 rows.defl=2
    //% group="Displays"
    //% weight=100
    export function inicializarLCD(addr: number = 0x27, cols: number = 16, rows: number = 2): void {
        lcdState = new LcdState();
        lcdState.addr = addr;
        lcdState.backlight = LcdBacklight.On;
        lcdState.cols = cols;
        lcdState.rows = rows;

        basic.pause(50);
        // Sequência de inicialização para modo 4 bits HD44780
        write4bits(addr, 0x30);
        basic.pause(5);
        write4bits(addr, 0x30);
        control.waitMicros(150);
        write4bits(addr, 0x30);
        write4bits(addr, 0x20); // Mudar interface para 4 bits

        // Configuração do Display
        sendCommand(0x28); // 2 linhas, fonte 5x8
        sendCommand(0x0C); // Display ligado, cursor desligado
        sendCommand(0x06); // Deslocamento automático do cursor
        limparLCD();
    }

    //% blockId=superkit_lcd_clear block="limpar LCD"
    //% group="Displays"
    //% weight=90
    export function limparLCD(): void {
        sendCommand(0x01);
        basic.pause(2);
    }

    //% blockId=superkit_lcd_backlight block="definir luz de fundo do LCD %state"
    //% group="Displays"
    //% weight=85
    export function setBacklight(state: LcdBacklight): void {
        if (lcdState) {
            lcdState.backlight = state;
            pins.i2cWriteNumber(lcdState.addr, state, NumberFormat.UInt8LE);
        }
    }

    //% blockId=superkit_lcd_set_cursor block="definir cursor do LCD linha %row| coluna %col"
    //% row.min=0 row.max=3 col.min=0 col.max=19
    //% group="Displays"
    //% weight=80
    export function setCursor(row: number, col: number): void {
        let offsets = [0x00, 0x40, 0x14, 0x54];
        if (row >= offsets.length) row = 0;
        sendCommand(0x80 | (offsets[row] + col));
    }

    //% blockId=superkit_lcd_show_text block="mostrar texto %text| na linha %row| coluna %col"
    //% row.defl=0 col.defl=0
    //% group="Displays"
    //% weight=75
    export function mostrarTextoLCD(text: string, row: number = 0, col: number = 0): void {
        setCursor(row, col);
        for (let i = 0; i < text.length; i++) {
            sendData(text.charCodeAt(i));
        }
    }

    //% blockId=superkit_lcd_custom_char block="criar caractere personalizado no LCD índice %index| dados %bytes"
    //% index.min=0 index.max=7
    //% group="Displays"
    //% weight=70
    export function lcdMakeCharacter(index: number, bytes: number[]): void {
        if (index < 0 || index > 7 || bytes.length < 8) return;
        sendCommand(0x40 | (index << 3));
        for (let i = 0; i < 8; i++) {
            sendData(bytes[i]);
        }
    }

    // =======================================================
    // GRUPO: KEYPADS & EXPANSORES
    // =======================================================

    //% blockId=superkit_write_pcf8574 block="expansor PCF8574 endereço %addr| envia byte %value"
    //% addr.defl=0x20 value.defl=255
    //% group="Keypads & Expansores"
    //% weight=100
    export function superkit_write_pcf8574(addr: number, value: number): void {
        pins.i2cWriteNumber(addr, value & 0xFF, NumberFormat.UInt8LE);
    }

    //% blockId=superkit_read_pcf8574 block="expansor PCF8574 lê byte no endereço %addr"
    //% addr.defl=0x20
    //% group="Keypads & Expansores"
    //% weight=90
    export function superkit_read_pcf8574(addr: number): number {
        return pins.i2cReadNumber(addr, NumberFormat.UInt8LE);
    }

    //% blockId=superkit_read_keypad_matrix block="ler tecla da matriz 4x4 L1 %r1 L2 %r2 L3 %r3 L4 %r4 C1 %c1 C2 %c2 C3 %c3 C4 %c4"
    //% group="Keypads & Expansores"
    //% weight=80
    export function lerMatrizTeclado(
        r1: DigitalPin, r2: DigitalPin, r3: DigitalPin, r4: DigitalPin,
        c1: DigitalPin, c2: DigitalPin, c3: DigitalPin, c4: DigitalPin
    ): string {
        let keys = [
            ["1", "2", "3", "A"],
            ["4", "5", "6", "B"],
            ["7", "8", "9", "C"],
            ["*", "0", "#", "D"]
        ];
        let rows = [r1, r2, r3, r4];
        let cols = [c1, c2, c3, c4];

        for (let r = 0; r < 4; r++) {
            for (let i = 0; i < 4; i++) {
                pins.digitalWritePin(rows[i], 1);
            }
            pins.digitalWritePin(rows[r], 0);

            for (let c = 0; c < 4; c++) {
                pins.setPull(cols[c], PinPullMode.PullUp);
                if (pins.digitalReadPin(cols[c]) == 0) {
                    return keys[r][c];
                }
            }
        }
        return "";
    }

    // =======================================================
    // GRUPO: SENSORES
    // =======================================================

    //% blockId=superkit_ultrasonic block="ler ultrassônico Trigger %trig| Echo %echo| unidade %unit"
    //% group="Sensores"
    //% weight=100
    export function lerUltrassonico(trig: DigitalPin, echo: DigitalPin, unit: DistanceUnit = DistanceUnit.Centimeters): number {
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        let duration = pins.pulseIn(echo, PulseValue.High, 25000);
        let distance = duration / 58;

        if (unit == DistanceUnit.Inches) {
            distance = distance / 2.54;
        }

        return Math.round(distance);
    }

    //% blockId=superkit_read_3_line_sensors block="ler 3 sensores de linha pino Esq %left| pino Centro %center| pino Dir %right"
    //% group="Sensores"
    //% weight=90
    export function lerTresSensores(left: DigitalPin, center: DigitalPin, right: DigitalPin): number[] {
        return [
            pins.digitalReadPin(left),
            pins.digitalReadPin(center),
            pins.digitalReadPin(right)
        ];
    }

    // =======================================================
    // GRUPO: ROBÓTICA
    // =======================================================

    //% blockId=superkit_move_robot block="mover robô direção %dir| velocidade %speed"
    //% speed.min=0 speed.max=1023 speed.defl=500
    //% group="Robótica"
    //% weight=100
    export function moverRobo(dir: Direction, speed: number): void {
        let p1 = AnalogPin.P8;  // Motor A IN1
        let p2 = AnalogPin.P12; // Motor A IN2
        let p3 = AnalogPin.P13; // Motor B IN3
        let p4 = AnalogPin.P14; // Motor B IN4

        switch (dir) {
            case Direction.Forward:
                pins.analogWritePin(p1, speed);
                pins.analogWritePin(p2, 0);
                pins.analogWritePin(p3, speed);
                pins.analogWritePin(p4, 0);
                break;
            case Direction.Backward:
                pins.analogWritePin(p1, 0);
                pins.analogWritePin(p2, speed);
                pins.analogWritePin(p3, 0);
                pins.analogWritePin(p4, speed);
                break;
            case Direction.Left:
                pins.analogWritePin(p1, 0);
                pins.analogWritePin(p2, speed);
                pins.analogWritePin(p3, speed);
                pins.analogWritePin(p4, 0);
                break;
            case Direction.Right:
                pins.analogWritePin(p1, speed);
                pins.analogWritePin(p2, 0);
                pins.analogWritePin(p3, 0);
                pins.analogWritePin(p4, speed);
                break;
            case Direction.Stop:
                pins.analogWritePin(p1, 0);
                pins.analogWritePin(p2, 0);
                pins.analogWritePin(p3, 0);
                pins.analogWritePin(p4, 0);
                break;
        }
    }

    // =======================================================
    // GRUPO: RFID (MFRC522 SPI)
    // =======================================================

    let rfidInitialized = false;

    function rfidWriteReg(reg: number, val: number) {
        pins.digitalWritePin(DigitalPin.P16, 0); // CS Low
        pins.spiWrite((reg << 1) & 0x7E);
        pins.spiWrite(val);
        pins.digitalWritePin(DigitalPin.P16, 1); // CS High
    }

    function rfidReadReg(reg: number): number {
        pins.digitalWritePin(DigitalPin.P16, 0);
        pins.spiWrite(((reg << 1) & 0x7E) | 0x80);
        let val = pins.spiWrite(0);
        pins.digitalWritePin(DigitalPin.P16, 1);
        return val;
    }

    //% blockId=superkit_init_rfid block="inicializar leitor RFID (SPI: CS=P16, RST=P0)"
    //% group="RFID"
    //% weight=100
    export function inicializarRFID(): void {
        pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13); // MOSI, MISO, SCK
        pins.spiFormat(8, 0);
        pins.spiFrequency(1000000);

        pins.digitalWritePin(DigitalPin.P0, 0); // Reset
        basic.pause(10);
        pins.digitalWritePin(DigitalPin.P0, 1);
        basic.pause(50);

        rfidWriteReg(0x01, 0x0F); // Soft Reset
        rfidWriteReg(0x2A, 0x8D); // Configuração do Timer
        rfidWriteReg(0x2B, 0x3E);
        rfidWriteReg(0x2D, 30);
        rfidWriteReg(0x2C, 0);
        rfidWriteReg(0x15, 0x40); // 100% ASK
        rfidWriteReg(0x11, 0x3D); // CRC Preset

        // Ativa a antena
        let current = rfidReadReg(0x14);
        if ((current & 0x03) != 0x03) {
            rfidWriteReg(0x14, current | 0x03);
        }

        rfidInitialized = true;
    }

    //% blockId=superkit_read_rfid_uid block="ler UID do cartão RFID"
    //% group="RFID"
    //% weight=90
    export function lerRFID_UID(): string {
        if (!rfidInitialized) inicializarRFID();

        rfidWriteReg(0x0D, 0x07); // BitFramingReg
        pins.digitalWritePin(DigitalPin.P16, 0);
        pins.spiWrite(((0x09 << 1) & 0x7E)); // FIFODataReg
        pins.spiWrite(0x26); // REQA
        pins.digitalWritePin(DigitalPin.P16, 1);
        rfidWriteReg(0x01, 0x0C); // Transceive
        rfidWriteReg(0x0C, 0x80 | 0x20); // StartSend

        basic.pause(20);
        let n = rfidReadReg(0x0A); // FIFOLevelReg
        if (n > 0) {
            let uid = "";
            for (let i = 0; i < n; i++) {
                let byteVal = rfidReadReg(0x09);
                let hex = byteVal.toString();
                if (byteVal < 16) hex = "0" + hex;
                uid += hex;
            }
            return uid;
        }
        return "";
    }

    // =======================================================
    // GRUPO: LEDs & ATUADORES
    // =======================================================

    //% blockId=superkit_servo block="posicionar servo pino %pin| ângulo %angle°"
    //% angle.min=0 angle.max=180 angle.defl=90
    //% group="LEDs & Atuadores"
    //% weight=100
    export function moverServo(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, Math.clamp(0, 180, angle));
    }

    //% blockId=superkit_buzzer_tone block="tocar tom no pino %pin| frequência %freq Hz por %duration ms"
    //% freq.defl=440 duration.defl=500
    //% group="LEDs & Atuadores"
    //% weight=90
    export function tocarTom(pin: AnalogPin, freq: number, duration: number): void {
        pins.analogPitch(freq, duration);
    }

    //% blockId=superkit_actuator_state block="definir atuador/LED pino %pin| para %state"
    //% group="LEDs & Atuadores"
    //% weight=80
    export function controlarAtuador(pin: DigitalPin, state: boolean): void {
        pins.digitalWritePin(pin, state ? 1 : 0);
    }
}