"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeEvaluate = safeEvaluate;
function safeEvaluate(expression) {
    const cleaned = expression.replace(/\s+/g, '');
    if (!/^[0-9+\-*/().]+$/.test(cleaned)) {
        throw new Error("Ifodada ruxsat etilmagan belgilar bor");
    }
    let pos = 0;
    const peek = () => cleaned[pos];
    const consume = () => cleaned[pos++];
    function parseNumber() {
        let start = pos;
        while (pos < cleaned.length && /[0-9.]/.test(peek()))
            pos++;
        if (start === pos)
            throw new Error('Raqam kutilgan edi');
        return parseFloat(cleaned.slice(start, pos));
    }
    function parseFactor() {
        if (peek() === '(') {
            consume();
            const value = parseExpression();
            if (peek() !== ')')
                throw new Error("Yopilmagan qavs");
            consume();
            return value;
        }
        if (peek() === '-') {
            consume();
            return -parseFactor();
        }
        return parseNumber();
    }
    function parseTerm() {
        let value = parseFactor();
        while (peek() === '*' || peek() === '/') {
            const op = consume();
            const next = parseFactor();
            value = op === '*' ? value * next : value / next;
        }
        return value;
    }
    function parseExpression() {
        let value = parseTerm();
        while (peek() === '+' || peek() === '-') {
            const op = consume();
            const next = parseTerm();
            value = op === '+' ? value + next : value - next;
        }
        return value;
    }
    const result = parseExpression();
    if (pos !== cleaned.length)
        throw new Error("Ifoda noto'g'ri");
    if (!isFinite(result))
        throw new Error("Hisoblash natijasi noto'g'ri");
    return result;
}
//# sourceMappingURL=safe-math.js.map