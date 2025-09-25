// Temporary storage for WhatsApp receipts to be sent
// Each entry: { name, whatsapp, service, package, amount, timestamp }
module.exports = {
  receipts: [],
  addReceipt(receipt) {
    this.receipts.push({ ...receipt, timestamp: Date.now() });
  },
  getAndClearReceipts() {
    const all = [...this.receipts];
    this.receipts = [];
    return all;
  }
};
